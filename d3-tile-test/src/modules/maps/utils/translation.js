//@flow
import {
  EXP_RENDER_MODALITY,
  LINEAR_RENDER_MODALITY,
  SINGLE_LINEAR_RENDER_MODALITY,
  SINGLE_EXP_RENDER_MODALITY,
  type RenderModality
} from "..";
import { calcExpScaledTranslation } from "./expTranslation";
import { calcLinearScaledTranslation } from "./linearTranslation";
import { calcCoords } from "./coordinates";

export const DEFAULT_OBJ_POS = [0.5, 0.5];

/**
 * Calcolo della traslazione dell'oggetto per il posizionamento nel caso di tile.
 * @param {*} renderModality
 * @param {*} objPos
 * @param {*} width width of object
 * @param {*} height height of object
 * @param {*} k the current scale factor in teh store (currentExpScale) depending of the renderModality
 */
export const calcObjectTranslation = (
  renderModality: RenderModality,
  objPos: Array<number>,
  width: number,
  height: number,
  k: number
): ?Array<number> => {
  if (EXP_RENDER_MODALITY === renderModality)
    return calcExpScaledTranslation(objPos, width, height, k);
  else if (LINEAR_RENDER_MODALITY === renderModality)
    return calcLinearScaledTranslation(objPos, width, height, k);
  else if (
    SINGLE_LINEAR_RENDER_MODALITY === renderModality ||
    SINGLE_EXP_RENDER_MODALITY === renderModality
  )
    return null;
  else return DEFAULT_OBJ_POS;
};

export const calcSingleObjectTranslation = (
  renderModality: RenderModality,
  objPos: Array<number>,
  viewPortWidth: number,
  viewPortHeight: number,
  k: number
): ?Array<number> => {
  if (
    SINGLE_LINEAR_RENDER_MODALITY === renderModality ||
    SINGLE_EXP_RENDER_MODALITY === renderModality
  ) {
    const p = calcCoords(viewPortWidth / 2, viewPortHeight / 2, 0, 0, k);
    return [p[0] + objPos[0], p[1] + objPos[1]];
  } else return null;
};
