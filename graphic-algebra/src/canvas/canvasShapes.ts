import { Line } from '../shapes/line';
import { Point } from '../shapes/point';
import { Polygon } from '../shapes/polygon';
import { Polyline } from '../shapes/polyline';

export enum DrawTypes {
    POINT = 'POINT',
    LINE = 'LINE',
    POLYLINE = 'POLYLINE',
    POLYGON = 'POLYGON',
    MOVEMENT = 'MOVEMENT'
}

export interface CanvasShapes {
    polylines: Map<string, Polyline>;
    lines: Map<string, Line>;
    points: Map<string, Point>;
    polygons: Map<string, Polygon>;
}

export function createInitCanvasShapes() {
    return  {
        lines: new Map(),
        points: new Map(),
        polylines: new Map(),
        polygons: new Map()
    };
}

export function createPointShape(id: string, pos: Array<number>): Point {
    return new Point(id, pos[0], pos[1]);
}

// export function createCanvasShape()