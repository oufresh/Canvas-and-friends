import * as MathJs from 'mathjs';
import { TILE_SIZE, MIN_D3TILE_EXPONENT, DEFALUT_SCALED_OBJ_TRANSLATION_X, DEFALUT_SCALED_OBJ_TRANSLATION_Y } from '../../src/modules/maps/utils/constants';
import { calcExpScale } from './stSchemaUtils';

/**
 * Attenzione!!!!
 * Iniziamo a guardare le scale con gil esponenti e non con fattori lineri
 * Cambiano i calcoli della scala minima e massima e quindi degli indici dell tiles!!!
 * 
 * Le scale di st sono logartimiche vedi il facor nell'altro file js.
 * 
 */

export type StRenderInfotType = {
    schemaWidth: number,
    schemaHeight: number,
    expScaleDefault: number,
    maxScaleConv: number,
    stScales: Array<number>,
    expScaleExtent: Array<number>,
    initExpScale: number,
    expScaleDefault: number
};

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
 * Calcola i dati iniziali per il rendering di un modello 2D a tile. Scala esponeziale massima e minima, centro
 * dell'oggetto e scala iniziale.
 * Il punto iniziale è la suddivisiione in tile dell'oggetto e vedere quante ne servono. Poi tener conto
 * che ogni livello diverso di zoom implica un raddoppio del numero di tiles per dimensione lineare; da qui usare
 * una scala esponenziale base 2.
 * @param {*} schemaWidth larghezza oggetto
 * @param {*} schemaHeight altezza oggetto
 * @param {*} objZoomExtent range di zoom [min, max]
 * @param {*} objInitZoom zoom iniziale
 */
export const initRenderInfo = (schemaWidth: number, schemaHeight: number, stScales: Array<number>, stScaleDefault: number, stScaleCurrent: number): StRenderInfotType => {

    //prendo la massima dimensione lineare per calcolare il numero
    //di tiles per contenere l'oggetto
    const dimension = Math.max(schemaWidth, schemaHeight);

    //calcolo la scala esponenenziale di base:
    //data la dimensione originale quante tiles ci vogliono
    //per rappresentarla tutta e ne faccio il logaritmo in base 2.
    const expDouble = MathJs.log2(dimension / TILE_SIZE);

    //calcolo indice tiles corrispondente alla scala di base
    const expInt = Math.max(MIN_D3TILE_EXPONENT, Math.ceil(expDouble));
    
    //le scale max e min sono invertite in st la 0 è la più ingrandita e la 4la meno ingrandita
    const expScaleDefault = calcExpScale(expInt, stScaleDefault, stScaleDefault, TILE_SIZE);
	const expScaleCurrent = calcExpScale(expInt, stScaleCurrent, stScaleDefault, TILE_SIZE);
	const expScaleMin = calcExpScale(expInt, stScales[stScales.length-1], stScaleDefault, TILE_SIZE);
	const expScaleMax = calcExpScale(expInt, stScales[0], stScaleDefault, TILE_SIZE);
    const maxScaleConv = log2int(expScaleMax/TILE_SIZE);

    console.log(`
        Dimensioni di partenza: ${schemaWidth} x ${schemaHeight},
        Scala di default (dimensioni originali): ${expScaleDefault},
        ExpInt di dafault: ${expInt},
        Scala esponenziale di base: ${expDouble},
        Scala minima: ${expScaleMin},
        Scala massima: ${expScaleMax},
        Scala corrente: ${expScaleCurrent},
        maxScaleConv: ${maxScaleConv}
    `);

    return {
        expScaleExtent: [expScaleMin, expScaleMax],
        initExpScale: expScaleCurrent,
        schemaWidth: schemaWidth, //controllare se serve
        schemaHeight: schemaHeight,//controllare se serve
        expScaleDefault: expScaleDefault,
        maxScaleConv: maxScaleConv,
        stScales: stScales //da cancellare
    };
};

/**
 * Calcola la traslazione nelle coordinate scalate dell'oggetto date le coordinate
 * dell'oggetto.
 * DA RIVEDERE PER LE COORDINATE DI ST!!!!!
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

    console.log("calcScaledTranslation: " + schemaPoint + " => " + [ DX, DY ]);

    return [ DX, DY ];
}


export function calcStScaledTranslation(schemaPoint: Array<number>, width: number, height: number, currentScale: number): Array<number>
{

    console.log("calcStScaledTranslation: currentScale" + currentScale);
    
    const X = scaleDimension(schemaPoint[0], currentScale);
    const Y = scaleDimension(schemaPoint[1], currentScale);

    const DX = DEFALUT_SCALED_OBJ_TRANSLATION_X - X;
    const DY = DEFALUT_SCALED_OBJ_TRANSLATION_Y - Y;

    console.log("calcStScaledTranslation: " + schemaPoint + " => " + [ DX, DY ]);

    return [ DX, DY ];
}
