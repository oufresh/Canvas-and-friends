//@flow
/* eslint-disable no-console */
import { tile } from "d3-tile";
import { TILE_SIZE } from "./constants";
import { type Tiles, TileIndex } from "../types";
import * as MathJs from "mathjs";
import memoizeOne from "memoize-one";

/**
 * Calcola le tile da utilizzare con i relativi indici dato il livello di scala esponenziale corrente,
 * le dimensioni della viewport e la taslazione applicata da d3-zoom (diversa da quella poi applicata al
 * canvas che è riscalata).
 * @param {*} viewportWidth
 * @param {*} viewportHeight
 * @param {*} x
 * @param {*} y
 * @param {*} k
 */
export const calcTiles = (
  viewportWidth: number,
  viewportHeight: number,
  x: ?number,
  y: ?number,
  k: ?number
): Tiles => {
  const t = tile()
    .size([viewportWidth, viewportHeight])
    .wrap(false);
  // prettier-ignore
  if (k !== null && x !== null && y !== null)
    return t.scale(k).translate([x, y])();
  else {
    console.warn("No scale / translate factor defined!")
    return t.scale(1).translate([0, 0])();
  }
};

/**
 * Versione memoizzata di calcTiles per non ricalcolare gli indici
 * delle tiles da visualizzare per mappe non variate.
 */
export const memoizedCalTiles = memoizeOne(calcTiles);

export const calcZ = (currentExpScale: number): number => {
  const z = Math.max(MathJs.log2(currentExpScale / TILE_SIZE), 0);
  return Math.round(z);
};

export function serializeTileIndex(tileIndex: TileIndex): string {
  return tileIndex.z + "-" + tileIndex.x + "-" + tileIndex.y;
}

export function deSerializeTileIndex(serTileIndex: string): TileIndex | null {
  try {
    const nums: Array<string> = serTileIndex.split(" - ");
    return {
      z: parseInt(nums[0]),
      x: parseInt(nums[1]),
      y: parseInt(nums[2])
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}
