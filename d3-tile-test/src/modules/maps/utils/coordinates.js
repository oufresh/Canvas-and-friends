//@flow
import { TILE_SIZE } from "./constants";
import { EXP_RENDER_MODALITY } from "../renderModalities";
import { type RenderModality } from "../types";
/**
 * Calcolo delle coordinate della mappa partendo da quelle relative al canvas svg,
 * avendo applicato prima la getMousePos(...). Da utilizzare per lo zoom e pan
 * su SvgRender o ZoomBehaviour. I dati di traslazione e scala sono direttamente quelli
 * calcolati da d3-zoom e usati poi per la transform.
 *
 * @param {number} mx Coordinata x mouse relativa a svg
 * @param {number} my Coordinata y mouse relativa a svg
 * @param {number} tx Traslazione su x
 * @param {number} ty Traslazione su y
 * @param {number} k Fattore di scala del canvas
 */
export function calcCoords(
  mx: number,
  my: number,
  tx: number,
  ty: number,
  k: number
): Array<number> {
  if (
    tx !== undefined &&
    tx !== null &&
    (ty !== undefined && ty !== null) &&
    (k !== undefined && k !== null)
  ) {
    let cx = (mx - tx) / k;
    let cy = (my - ty) / k;
    return [cx, cy];
  }
  return [mx, my];
}

/**
 * Calcola le coordinate nell'oggetto correggendo quelle a scala di base con il fattore di scala. da usare dopo la calcCoordsforTiles.
 * @param {number} objScale scala  attuale
 * @param {number} objScaleDefault scala di default
 * @param {Array<number>} coords coordinate nella scala di default
 */
export const convertCoordsForTiles = (
  objScale: number,
  objScaleDefault: number,
  coords: Array<number>
): Array<number> => {
  const factor = Math.pow(2, objScaleDefault - objScale);
  return coords.map(c => Math.round(c / factor));
};

/**
 * Calcolo delle coordinate del mouse per tile rendering alla scala attuale.
 * Sono necessari i parametri di scala e traslazione dell'oggetto tile calcolati da d3.
 * @param {*} renderModality tipo di rendering e scala delle tiles.
 * @param {*} viewportCoords coordinate realtive all'svg.
 * @param {*} tileScale fattore di scala dell'oggetto tile calcolato da d3
 * @param {*} tileTranslateX fattore di traslazione X dell'oggetto tile calcolato da d3
 * @param {*} tileTranslateY fattore di traslazione y dell'oggetto tile calcolato da d3
 */
export const calcCoordsforTiles = (
  renderModality: RenderModality,
  viewportCoords: Array<number>,
  tileScale: number,
  tileTranslateX: number,
  tileTranslateY: number
): Array<number> => {
  let ret = [0, 0];
  if (EXP_RENDER_MODALITY === renderModality) {
    const k = tileScale / TILE_SIZE;
    const tx = tileTranslateX * tileScale;
    const ty = tileTranslateY * tileScale;
    const x = Math.round((viewportCoords[0] - tx) / k);
    const y = Math.round((viewportCoords[1] - ty) / k);
    return [x, y];
  }
  return ret;
};
