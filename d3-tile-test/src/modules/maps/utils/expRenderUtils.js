//@flow
import * as MathJs from "mathjs";
import { TILE_SIZE } from "./constants";
import { calcExpInt } from "./renderUtils";

export const log2int = (value: number): number => {
  return Math.round(MathJs.log2(value));
};

/**
 * Questo valore rappresenta lo scalamento in termini esponenziali base 2
 * che posso fare ulteriormente alla suddvisione in tiles. Potenzialmente fino ad
 * arrivare al valore minimo di 1x1 pixels.
 * Bisogna pensare che l'oggetto di base oltre a suddividerlo in tiles di vari livelli di zoom
 * può anche essere scalato ulteriormente, restringendo o allargando la tile stessa.
 */
export const baseScaleExp = Math.round(MathJs.log2(TILE_SIZE));

/**
 * Calcolo della scala esponenziale. La scala viene calcolata tenendo conto sia della suddivisione in tile
 * sia dello scalamento che posso fare a livello di svg della tile stessa, ovvero baseScaleExp.
 * Gli epsonenti quindi si sommano ragionando con il logaritmi e corrisponde a moltiplicare i valori
 * di scala.
 * @param {*} exp
 * @param {*} scale
 * @param {*} scaleDefault
 */
export const calcExpScale = (
  exp: number,
  scale: number,
  scaleDefault: number
): number => {
  // prettier-ignore
  return Math.pow(2, (exp - (scale - scaleDefault)) + baseScaleExp);
};

/**
 * Calcola il fattore di conversione usato ad esempio nelle coordinate
 * al passaggio di scala dell'oggetto sorgente.
 * @param {*} objScale scala specifica dell'oggetto, numero intero
 * @param {*} objScaleDefault scala di default dell'oggetto, numbero intero
 */
export const getFactorForStScale = (
  objScale: number,
  objScaleDefault: number
): number => {
  return Math.pow(2, objScaleDefault - objScale);
};

/**
 * calcola il valore della scala dell'oggetto originale intera dato l'indice delle tiles.
 * @param {*} minObjScale minimo valore di scala originale dell'oggetto
 * @param {*} maxScaleConv fattore di scala massimo
 * @param {*} z indice tiles.
 */
export const calcObjScaleFromZ = (
  minObjScale: number,
  maxScaleConv: number,
  z: number
): number => {
  return Math.round(minObjScale + (maxScaleConv - z));
};

/**
 *Conversione di una scale (ad esempio scala di ST) in scala esponenziale
 * @param {*} schemaWidth
 * @param {*} schemaHeight
 * @param {*} scaleToConvert
 * @param {*} defaultScale
 */
export const calcExpScaleFromScale = (
  schemaWidth: number,
  schemaHeight: number,
  scaleToConvert: number,
  defaultScale: number
): number => {
  //calcolo indice tiles corrispondente alla scala di base
  const expInt = calcExpInt(schemaWidth, schemaHeight);
  return calcExpScale(expInt, scaleToConvert, defaultScale);
};

/**
 * Formaula inversa di  calcExpScale
 * @param {*} expInt
 * @param {*} scale
 * @param {*} defaultScale
 */
export const calcExpScaleInv = (
  expInt: number,
  scale: number,
  expScaleOffset: number
): number => {
  // prettier-ignore
  return expInt +  expScaleOffset + MathJs.log2(TILE_SIZE) - MathJs.log2(scale);
};

export const calcExpScaleFromScaleInv = (
  schemaWidth: number,
  schemaHeight: number,
  scaleToConvert: number,
  expScaleOffset: number
): number => {
  const expInt = calcExpInt(schemaWidth, schemaHeight);
  return calcExpScaleInv(expInt, scaleToConvert, expScaleOffset);
};
