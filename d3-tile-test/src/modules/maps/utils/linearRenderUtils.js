//@flow
import * as MathJs from "mathjs";
import { TILE_SIZE } from "./constants";
import { calcExpInt } from "./renderUtils";

export const baseScaleLinear = Math.round(MathJs.log2(TILE_SIZE));

export const calcLinearScale = (exp: number, scale: number): number => {
  // prettier-ignore
  return Math.pow(2, exp + Math.round(MathJs.log2(scale)) + baseScaleLinear);
};

/**
 * Formaula inversa di  calcLinearScale
 * @param {*} expInt
 * @param {*} scale
 * @param {*} defaultScale
 */
export const calcLinearScaleInv = (
  expInt: number,
  scale: number,
  expScaleOffset: number
): number => {
  return expInt + expScaleOffset + MathJs.log2(TILE_SIZE) - MathJs.log2(scale);
};

/**
 *
 * @param {*} schemaWidth
 * @param {*} schemaHeight
 * @param {*} scaleToConvert
 * @param {*} defaultScale
 */
export const calcLinearScaleFromScaleInv = (
  schemaWidth: number,
  schemaHeight: number,
  scaleToConvert: number,
  expScaleOffset: number
): number => {
  const expInt = calcExpInt(schemaWidth, schemaHeight);
  return calcLinearScaleInv(expInt, scaleToConvert, expScaleOffset);
};
