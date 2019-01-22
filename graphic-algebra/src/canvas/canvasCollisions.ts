import { DrawTypes, CanvasShapes } from './canvasShapes';
import { CanvasPosition } from './types';
import { pointInCircle } from '../collisions/pointInCircle';
import { circleInLine } from '../collisions/circleOnLine';
import { Line } from '../shapes/line';

export type MouseHitEvent = {
    pos: CanvasPosition,
    shapeType: DrawTypes,
    mouseHits: MouseHits
};

export type MouseHits = {
    hits: Map<DrawTypes, Set<string>>;
};

const deltaHit: number = 3;

export function collisionProcessor(pos: CanvasPosition, shapes: CanvasShapes): MouseHits {
    let ret: MouseHits = {
        hits: new Map()
    };

    for (const point of shapes.points.values()) {
        const hps = new Set();
        const hit = pointInCircle(point.x, point.y, pos[0], pos[1], deltaHit);
        if (hit === true) {
            hps.add(point.id);
        }
        ret.hits.set(DrawTypes.POINT, hps);
    }

    for (const line of shapes.lines.values()) {
        const hls = new Set();
        const hit = circleInLine(line.vertex[0].x, line.vertex[0].y, line.vertex[1].x, line.vertex[1].y, pos[0], pos[1], deltaHit);
        if (hit.hit === true) {
            hls.add(line.id);
        }
        ret.hits.set(DrawTypes.LINE, hls);
    }
    
    return ret;
}