import { ShapeTypes, CanvasShapes } from './canvasShapes';
import { CanvasPosition } from './types';
import { pointInCircle } from '../collisions/pointInCircle';

export type MouseHitEvent = {
    pos: CanvasPosition,
    shapeType: ShapeTypes,
    mouseHits: MouseHits
};

export type MouseHits = {
    hits: Set<string>;
};

export function collisionProcessor(pos: CanvasPosition, shapes: CanvasShapes): MouseHits {
    let ret: MouseHits = {
        hits: new Set()
    };

    for (let point of shapes.points.values()) {
        const hit = pointInCircle(point.x, point.y, pos[0], pos[1], 3);
        if (hit === true) {
            ret.hits.add(point.id);
        }
    }
    
    return ret;
}