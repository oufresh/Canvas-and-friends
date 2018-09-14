import * as MathJs from 'mathjs';

export const ST_SCALE_DEFAULT = 2;

export const getFactorForStScale = (scale) => {
	return Math.pow(2, scale - ST_SCALE_DEFAULT);
}

export const calcStScale = (minStScale: number, maxScaleConv: number, z: number): number => Math.round(minStScale + (maxScaleConv - z));

/**
 * Calcolo della scala esponenziale
 * @param {*} exp 
 * @param {*} stScale 
 * @param {*} stScaleDefault 
 */
export const calcExpScale = (exp: number, stScale: number, stScaleDefault: number, tileSize: number): number => {
    return Math.pow(2, (exp - (stScale - stScaleDefault)) + Math.round(MathJs.log2(tileSize)));
}

export const calcCurrentStScale = (currentExpScale: number, z: number, minScale: number, maxScaleConv: number) => {

    return calcStScale(minScale, maxScaleConv, z);
};