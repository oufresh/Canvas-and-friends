//@flow
import {
  EXP_RENDER_MODALITY,
  SINGLE_LINEAR_RENDER_MODALITY,
  SINGLE_EXP_RENDER_MODALITY
} from "../renderModalities";
import { type RenderModality } from "../types";
import { calcLinearScaleFromScaleInv } from "./linearRenderUtils";
import { calcExpScaleFromScaleInv } from "./expRenderUtils";
import { calcSingleExpScaleInv } from "./singleExpRenderUtils";

export const calcIntegerScaleInvByRenderModality = (
  renderModality: RenderModality,
  width: number,
  height: number,
  scaleToConvert: ?number,
  expScaleOffset: ?number,
  truncate: boolean
): number => {
  if (scaleToConvert === null || scaleToConvert === undefined) return NaN;
  if (expScaleOffset === null || expScaleOffset === undefined) return NaN;

  let objScale = 0;
  if (EXP_RENDER_MODALITY === renderModality) {
    objScale = calcExpScaleFromScaleInv(
      width,
      height,
      scaleToConvert,
      expScaleOffset
    );
  } else if (SINGLE_LINEAR_RENDER_MODALITY == renderModality) {
    objScale = scaleToConvert;
  } else if (SINGLE_EXP_RENDER_MODALITY == renderModality) {
    objScale = calcSingleExpScaleInv(expScaleOffset, scaleToConvert);
  }
  //TODO controllare che il caso GEO sia uguale al lineare
  else {
    objScale = calcLinearScaleFromScaleInv(
      width,
      height,
      scaleToConvert,
      expScaleOffset
    );
  }
  if (truncate === true) {
    const dec = Math.abs(objScale) - Math.floor(Math.abs(objScale));
    return dec === 0.5
      ? Math.round(objScale - 0.0000001)
      : Math.round(objScale);
  } else return objScale;
};
