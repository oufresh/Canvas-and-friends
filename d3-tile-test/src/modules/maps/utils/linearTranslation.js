//@flow
import {
  DEFALUT_SCALED_OBJ_TRANSLATION_X,
  DEFALUT_SCALED_OBJ_TRANSLATION_Y
} from "./constants";
/**
 * Calcola la dimensione scalata nelle coordinate dell'oggetto
 * @param {*} d dimensione da scalare
 * @param {*} dMax dimensione massima dell'oggetto
 */
const scaleDimension = (d: number, dMax: number): number => d / dMax;

/**
 * Calcola la traslazione nelle coordinate scalate dell'oggetto date le coordinate
 * dell'oggetto.
 * @param {*} objPos coordinate del punto dello schema
 * @param {*} width larghezza schema
 * @param {*} height altezza schema
 */
export function calcLinearScaledTranslation(
  objPos: Array<number>,
  width: number,
  height: number,
  defaultExpScale: number
): Array<number> {
  const X = scaleDimension(objPos[0], defaultExpScale);
  const Y = scaleDimension(objPos[1], defaultExpScale);

  const DX = DEFALUT_SCALED_OBJ_TRANSLATION_X - X;
  const DY = DEFALUT_SCALED_OBJ_TRANSLATION_Y - Y;

  return [DX, DY];
}
