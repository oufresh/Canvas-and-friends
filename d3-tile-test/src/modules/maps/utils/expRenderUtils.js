import * as MathJs from 'mathjs';
import { TILE_SIZE, MIN_D3TILE_EXPONENT, DEFALUT_SCALED_OBJ_TRANSLATION_X, DEFALUT_SCALED_OBJ_TRANSLATION_Y } from './constants';
import { type ExpRenderInfoT } from './types';


/**
 * Calcola la dimensione scalata nelle coordinate dell'oggetto
 * @param {*} d dimensione da scalare
 * @param {*} dMax dimensione massima dell'oggetto
 */
export const scaleDimension = (d: number, dMax: number) => d/dMax;

export const ST_DEFAULT_SCALE = 2;

export const log2int = (value) => {
    return Math.round(MathJs.log2(value));
};

/**
 * Calcolo della scala esponenziale
 * @param {*} exp 
 * @param {*} scale 
 * @param {*} scaleDefault 
 */
export const calcExpScale = (exp: number, scale: number, scaleDefault: number, tileSize: number): number => {
    return Math.pow(2, (exp - (scale - scaleDefault)) + Math.round(MathJs.log2(tileSize)));
}

export const calcExpInt = (schemaWidth: number, schemaHeight: number) => {

    //prendo la massima dimensione lineare per calcolare il numero
    //di tiles per contenere l'oggetto
    const dimension = Math.max(schemaWidth, schemaHeight);

    //calcolo la scala esponenenziale di base:
    //data la dimensione originale quante tiles ci vogliono
    //per rappresentarla tutta e ne faccio il logaritmo in base 2.

    const expDouble = MathJs.log2(dimension / TILE_SIZE);
    //calcolo indice tiles corrispondente alla scala di base
    return Math.max(MIN_D3TILE_EXPONENT, Math.ceil(expDouble));
}

/**
 * Calcola i dati iniziali per il rendering di un modello 2D a tile. Scala esponeziale massima e minima, centro
 * dell'oggetto e scala iniziale.
 * Il punto iniziale è la suddivisione in tile dell'oggetto e vedere quante ne servono. Poi tener conto
 * che ogni livello diverso di zoom implica un raddoppio del numero di tiles per dimensione lineare; da qui usare
 * una scala esponenziale base 2.
 * @param {*} objZoomExtent range di zoom [min, max]
 * @param {*} objInitZoom zoom iniziale
 */
export const initRenderInfo = (schemaWidth: number, schemaHeight: number, scales: Array<number>, scaleDefault: number, scaleCurrent: number): ExpRenderInfoT => {

    //calcolo indice tiles corrispondente alla scala di base
    const expInt = calcExpInt(schemaWidth, schemaHeight);
    
    //le scale max e min sono invertite in st la 0 è la più ingrandita e la 4la meno ingrandita
	const expScaleCurrent = calcExpScale(expInt, scaleCurrent, scaleDefault, TILE_SIZE);
	const expScaleMin = calcExpScale(expInt, scales[scales.length-1], scaleDefault, TILE_SIZE);
    const expScaleMax = calcExpScale(expInt, scales[0], scaleDefault, TILE_SIZE);
    const expScaleDefault = calcExpScale(expInt, scaleDefault, scaleDefault, TILE_SIZE);
    
    // TODO da spostare nei selettori
    const maxScaleConv = log2int(expScaleMax/TILE_SIZE);

    return {
        expScaleExtent: [expScaleMin, expScaleMax],
        initExpScale: expScaleCurrent,
        expScaleDefault: expScaleDefault,
        maxScaleConv: maxScaleConv,
        schemaWidth: schemaWidth,
        schemaHeight: schemaHeight,
        scaleExtent: [scales[0], scales[scales.length-1]]
    };
};

/**
 * Calcola la traslazione nelle coordinate scalate dell'oggetto date le coordinate
 * dell'oggetto.
 * @param {*} schemaPoint coordinate del punto dello schema
 * @param {*} width larghezza schema
 * @param {*} height altezza schema
 */
export function calcScaledTranslation(schemaPoint: Array<number>, width: number, height: number): Array<number>
{
    const X = scaleDimension(schemaPoint[0], width);
    const Y = scaleDimension(schemaPoint[1], height);

    const DX = DEFALUT_SCALED_OBJ_TRANSLATION_X - X;
    const DY = DEFALUT_SCALED_OBJ_TRANSLATION_Y - Y;

    return [ DX, DY ];
}
