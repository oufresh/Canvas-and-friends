import { DrawTypes, CanvasShapes } from './canvasShapes';
import { CanvasPosition } from './types';
import { pointInCircle } from '../collisions/pointInCircle';
import { circleInLine } from '../collisions/circleOnLine';

export type MouseHitEvent = {
    pos: CanvasPosition,
    shapeType: DrawTypes,
    mouseHits: MouseHits
};

export interface MouseHits {
    hits: Map<DrawTypes, Set<string>>;
    detectedHits: boolean;
}

const deltaHit: number = 3;

export function collisionProcessor(pos: CanvasPosition, shapes: CanvasShapes): MouseHits {
    let ret: MouseHits = {
        hits: new Map(),
        detectedHits: false
    };

    const hps = new Set();
    for (const point of shapes.points.values()) {
        const hit = pointInCircle(point.x, point.y, pos[0], pos[1], deltaHit);
        if (hit === true) {
            hps.add(point.id);
            ret.detectedHits = true;
        }
    }
    ret.hits.set(DrawTypes.POINT, hps);

    const hls = new Set();
    for (const line of shapes.lines.values()) {
        const hit = circleInLine(line.vertex[0].x, line.vertex[0].y, line.vertex[1].x, line.vertex[1].y, pos[0], pos[1], deltaHit);
        if (hit.hit === true) {
            hls.add(line.id);
            ret.detectedHits = true;
        }
    }
    ret.hits.set(DrawTypes.LINE, hls);
    
    return ret;
}