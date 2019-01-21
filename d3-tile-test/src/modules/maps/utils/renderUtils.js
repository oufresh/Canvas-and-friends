//@flow
import * as MathJs from "mathjs";
import { TILE_SIZE, MIN_D3TILE_EXPONENT } from "./constants";
import {
  EXP_RENDER_MODALITY,
  LINEAR_RENDER_MODALITY,
  SINGLE_LINEAR_RENDER_MODALITY,
  SINGLE_EXP_RENDER_MODALITY
} from "../renderModalities";
import { calcExpScale } from "./expRenderUtils";
import { calcLinearScale } from "./linearRenderUtils";
import { calcSingleExpScale } from "./singleExpRenderUtils";
import { type RenderModality } from "../types";

export const calcExpInt = (
  schemaWidth: number,
  schemaHeight: number
): number => {
  //prendo la massima dimensione lineare per calcolare il numero
  //di tiles per contenere l'oggetto
  const dimension = Math.max(schemaWidth, schemaHeight);

  //calcolo la scala esponenenziale di base:
  //data la dimensione originale quante tiles ci vogliono
  //per rappresentarla tutta e ne faccio il logaritmo in base 2.

  const expDouble = MathJs.log2(dimension / TILE_SIZE);
  //calcolo indice tiles corrispondente alla scala di base
  return Math.max(MIN_D3TILE_EXPONENT, Math.ceil(expDouble));
};

export const calObjExpScale = (
  renderModality: RenderModality,
  schemaWidth: number,
  schemaHeight: number,
  objScale: number,
  scaleDefault?: number
): number => {
  const expInt = calcExpInt(schemaWidth, schemaHeight);
  if (EXP_RENDER_MODALITY === renderModality) {
    return calcExpScale(expInt, objScale, scaleDefault ? scaleDefault : 0);
  } else if (LINEAR_RENDER_MODALITY === renderModality) {
    return calcLinearScale(expInt, objScale);
  } else return objScale;
};

export const calcSingleObjScale = (
  renderModality: RenderModality,
  objScale: number,
  scaleDefault?: number
): number => {
  if (SINGLE_LINEAR_RENDER_MODALITY === renderModality) return objScale;
  else if (SINGLE_EXP_RENDER_MODALITY === renderModality) {
    return calcSingleExpScale(objScale, scaleDefault);
  } else return objScale;
};
