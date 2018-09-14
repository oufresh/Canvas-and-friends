//@flow
import { geoMercator } from 'd3-geo';

export const getOSMUrl = (z: number, x: number, y:number): string => {
    return "http://" + "abc"[x % 3] + ".tile.openstreetmap.org/" + z + "/" + x + "/" + y + ".png";
}

export const getMercatorProjection = (): Function => {
    return geoMercator().scale(1 / (2*Math.PI)).translate([0, 0]);
}

export function calcToMove(lon: number, lat: number)
{
    const projection = getMercatorProjection();
    return projection([lon, lat]);
}