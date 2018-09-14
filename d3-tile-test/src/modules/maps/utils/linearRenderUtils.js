import * as MathJs from 'mathjs';
import { TILE_SIZE, MIN_D3TILE_EXPONENT, DEFALUT_SCALED_OBJ_TRANSLATION_X, DEFALUT_SCALED_OBJ_TRANSLATION_Y } from './constants';
import { type LinearRenderInfoT } from './types';
/**
 * ATTENZIONE QUESTI CALCOLI FANNO IPOTESI DI SCALA LINEARE PER DEFINIRE LO ZOOM MASSIMO E MINIMO
 * MESS COSì NON SEMBRA TROPPO SENSATO PERCHé
 * L'IIMAGINE RISULTANTE è MOLTO PICCOLA RISPETTO
 * A QUELLO CHE CI SI PUò ASPETTARE!!!
 * 
 * NELL'ESEMPIO 200000 è FATTO CON RELATIVAMENTE POCHE TILES ....
 * pROBABILMETNE è PIù CORETTO L'APPROCCIO ESPONENZIALE!!!!!
 * 
 * 
 */



/**
 * Calcola la dimensione scalata nelle coordinate dell'oggetto
 * @param {*} d dimensione da scalare
 * @param {*} dMax dimensione massima dell'oggetto
 */
export const scaleDimension = (d: number, dMax: number) => d/dMax;
    
/**
 * Calcola i dati iniziali per il rendering di un modello 2D a tile. Scala esponeziale massima e minima, centro
 * dell'oggetto e scala iniziale.
 * Il punto iniziale è la suddivisiione in tile dell'oggetto e vedere quante ne servono. Poi tener conto
 * che ogni livello diverso di zoom implica un raddoppio del numero di tiles per dimensione lineare; da qui usare
 * una scala esponenziale base 2.
 * @param {*} objWidth larghezza oggetto
 * @param {*} objHeight altezza oggetto
 * @param {*} objZoomExtent range di zoom [min, max]
 * @param {*} objInitZoom zoom iniziale
 */
export const initRenderInfo = (objWidth: number, objHeight: number, objZoomExtent: Array<number>, objectDefaultZoom: number, objInitZoom: number): LinearRenderInfoT => {

    //prendo la massima dimensione lineare per calcolare il numero
    //di tiles per contenere l'oggetto
    const dimension = Math.max(objWidth, objHeight);

    //calcolo la scala esponenenziale di base:
    //data la dimensione originale quante tiles ci vogliono
    //per rappresentarla tutta e ne faccio il logaritmo in base 2.
    const expDouble = MathJs.log2(dimension / TILE_SIZE);

    //calcolo indice tiles corrispondente alla scala di base
    const expInt = Math.max(MIN_D3TILE_EXPONENT, Math.ceil(expDouble));
    
    //la scala di default è data dal numero intero superiore di tiles
    //contenute nell'immagine di partenza
    const expScaleDefault = Math.pow(2, expInt);
    const tileIndexDefault = expInt - MIN_D3TILE_EXPONENT;


    //calcolo la scala minima dato il livello minimo di zoom:
    const expMinDouble = MathJs.log2(objZoomExtent[0]*dimension/TILE_SIZE);
    const expMinInt = Math.min(expInt, Math.ceil(expMinDouble));
    const expScaleMin = Math.pow(2, expMinInt);
    const tileIndexMin = expMinInt - MIN_D3TILE_EXPONENT;

    //come scala minima prendo il minimo possibile che è dato dal log in base 2 della
    //dimensione della tile (log base 2 perché si dividono sempre in due le tiles nello zoom)
    //const expScaleMin = Math.pow(2, MIN_D3TILE_EXPONENT);
    //const tileIndexMin = 0;

    //il massimo in teoria potrebbe essere infinito se zoommassi di continuo
    //di fatto metto un vincolo ad esempio che posso ingrandire di maxMlt volte
    const expMaxDouble = MathJs.log2(objZoomExtent[1]*dimension/TILE_SIZE);

    //indice intero deve essere almeno quello di default, non più piccolo
    //altrimenti non sto ingrandendo nemmeno!!!
    const expMaxInt =  Math.max(expInt, Math.ceil(expMaxDouble));
    const expScaleMax = Math.pow(2, expMaxInt);
    const tileIndexMax = expMaxInt - MIN_D3TILE_EXPONENT;

    /**
     * Ora se diciamo che la scala di partenza è quella di default dell'immagine
     * originale possiamo usare le coordinate proprie per spostarci e centrare
     * altrimenti dovremmo scalarle
     */
    const expCurrentDouble = MathJs.log2(objInitZoom*dimension/TILE_SIZE);
    const expCurrentInt = Math.ceil(expCurrentDouble);
    const expScaleCurrent = Math.pow(2, expCurrentInt);


    return {
        expScaleExtent: [expScaleMin, expScaleMax],
        initExpScale: expScaleCurrent
    };
};

/**
 * Calcola la traslazione nelle coordinate scalate dell'oggetto date le coordinate
 * dell'oggetto
 * @param {*} objPos posizione del punto di posiziamento dell'oggetto
 * @param {*} width larghezza oggetto
 * @param {*} height altezza oggetto
 */
export function calcScaledTranslation(objPos, width, height)
{
    const X = scaleDimension(objPos[0], width);
    const Y = scaleDimension(objPos[1], height);

    const DX = DEFALUT_SCALED_OBJ_TRANSLATION_X - X;
    const DY = DEFALUT_SCALED_OBJ_TRANSLATION_Y - Y;

    return [ DX, DY ];
}
