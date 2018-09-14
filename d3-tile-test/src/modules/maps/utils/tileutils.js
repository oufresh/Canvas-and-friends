import { tile } from "d3-tile";
import { TILE_SIZE } from './constants';
import * as MathJs from 'mathjs';

/**
 * Definizione della trasformazione da applicare al canvas svg per renderizzare
 * @param {*} scale fattore di scala, poi riportato in base alle tile usate
 * @param {*} translate traslazione scalata in base base alla scala delle tile
 */
export const stringify = (scale: number, translate: Array<number>): string =>
{
    //r vale round se la scala è un vaore intero -> traslo di un numero intero di pixel
    //k non è la expScale ma è stata ricalcolata a seconda del livello di tiles a cui siamo
    const k = scale / TILE_SIZE, r = scale % 1 ? Number : Math.round;
    return "translate(" + r(translate[0] * scale) + "," + r(translate[1] * scale) + ") scale(" + k + ")";
}
/**
 * Definizione della matrice di tasformazione affine in coordinate omogenee
 * @param {*} scale fattore di scala, poi riportato in base alle tile usate
 * @param {*} translate traslazione scalata in base base alla scala delle tile
 * 
 * @description Costruisce la matrice definendola per colonne
 * k 0 tx
 * 0 k ty
 * 0 0 1
 */
export function stringifyM(scale, translate) {
    const k = scale / TILE_SIZE, r = scale % 1 ? Number : Math.round;
    return "matrix3d(" + [k, 0, 0, 0, 0, k, 0, 0, 0, 0, k, 0, r(translate[0] * scale), r(translate[1] * scale), 0, 1 ] + ")";
}

/**
 * Calcola le tile da utilizzare con i relativi indici dato il livello di scala esponenziale corrente,
 * le dimensioni della viewport e la taslazione applicata da d3-zoom (diversa da quella poi applicata al 
 * canvas che è riscalata).
 * @param {*} width 
 * @param {*} height 
 * @param {*} x 
 * @param {*} y 
 * @param {*} k 
 */
export const calcTiles = (width: number, height: number, x:number, y: number, k: number): Array<Object> => {
    const t = tile().size([width, height]).wrap(false);
    return t.scale(k).translate([x, y])();
}

export const calcZ = (currentExpScale: number): number => {
    const z = Math.max(MathJs.log2(currentExpScale/TILE_SIZE), 0);
    return Math.round(z);
}