//@flow
import * as MathJs from "mathjs";

/**
 * Calcolo del fattore di scala k di d3 per gestire lo zoom con scala di partenza esponenziale.
 * k = 2 ^ (s - default)
 * Serve se si parte da una scala esponenziale in base 2 con valore di default.
 * @param {*} objScale scala a cui interessa calcolare il fattore di zoom k di d3
 * @param {*} scaleDefault valore di defautl della scala esxp in base 2
 */
export const calcSingleExpScale = (
  objScale: number,
  scaleDefault?: number
): number => {
  const exp = -(objScale - (scaleDefault ? scaleDefault : 0));
  return Math.pow(2, exp);
};

/**
 *
 * @param {*} expScaleOffset
 * @param {*} currentExpScale
 */
export const calcSingleExpScaleInv = (
  expScaleOffset: number,
  currentExpScale: number
): number => {
  return expScaleOffset - MathJs.log2(currentExpScale);
};
