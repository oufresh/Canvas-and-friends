//@flow
import { TILE_SIZE } from "../../modules/maps/utils/constants";

function isValidTransform(x: number, y: number, k: number) {
  return (
    k !== undefined &&
    k !== null &&
    x !== undefined &&
    x !== null &&
    y !== undefined &&
    y !== null
  );
}

export const transformToString = (x: number, y: number, k: number): string => {
  return isValidTransform(x, y, k) === true
    ? "translate(" + x + "," + y + ") scale(" + k + ")"
    : "translate(0,0) scale(1)";
};

/**
 * Definizione della trasformazione da applicare al canvas svg per renderizzare
 * @param {*} scale fattore di scala, poi riportato in base alle tile usate
 * @param {*} translate traslazione scalata in base base alla scala delle tile
 */
export const stringify = (scale: number, translate: Array<number>): string => {
  //r vale round se la scala è un vaore intero -> traslo di un numero intero di pixel
  //k non è la expScale ma è stata ricalcolata a seconda del livello di tiles a cui siamo
  const k = scale / TILE_SIZE,
    r = scale % 1 ? Number : Math.round;
  // prettier-ignore
  return "translate(" + r(translate[0] * scale) + "," + r(translate[1] * scale) + ") scale(" + k + ")";
};
/**
 * Definizione della matrice di tasformazione affine in coordinate omogenee
 * @param {*} scale fattore di scala, poi riportato in base alle tile usate
 * @param {*} translate traslazione scalata in base base alla scala delle tile
 *
 * @description Costruisce la matrice definendola per colonne
 * k 0 0 tx
 * 0 k 0 ty
 * 0 0 k 0
 * 0 0 0 1
 */
export const stringifyM = (scale: number, translate: Array<number>): string => {
  const k = scale / TILE_SIZE,
    r = scale % 1 ? Number : Math.round;
  // prettier-ignore
  return "matrix3d(" + [k, 0, 0, 0, 0, k, 0, 0, 0, 0, k, 0, r(translate[0] * scale), r(translate[1] * scale), 0, 1 ].toString() + ")";
};
