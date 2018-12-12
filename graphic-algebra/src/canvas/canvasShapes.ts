import { Line, ExpLine } from '../line';
import { Point, ExpPoint } from '../point';
import { Polygon } from '../shapes/polygon';
import { Polyline } from '../polyline';

export enum ShapeTypes {
    POINT = 'POINT',
    LINE = 'LINE',
    POLYLINE = 'POLYLINE',
    POLYGON = 'POLYGON',
    MOVEMENT = 'MOVEMENT'
}

export interface CanvasShapes {
    polylines: Array<Polyline>;
    lines: Array<Line>;
    points: Array<Point>;
    polygons: Array<Polygon>;
}

export function createInitCanvasShapes() {
    return  {
        lines: [],
        points: [],
        polylines: [],
        polygons: []
    };
}

export function createPointShape(pos: Array<number>): Point {
    return new Point(pos[0], pos[1]);
}

// export function createCanvasShape()