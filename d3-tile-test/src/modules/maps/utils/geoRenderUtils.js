//@flow
import { geoMercator } from "d3-geo";

export const getOSMUrl = (z: number, x: number, y: number): string => {
  //prettier-ignore
  return "http://" + "abc"[x % 3] + ".tile.openstreetmap.org/" + z + "/" + x + "/" + y + ".png";
};

export const getMercatorProjection = (): Function => {
  return geoMercator()
    .scale(1 / (2 * Math.PI))
    .translate([0, 0]);
};
