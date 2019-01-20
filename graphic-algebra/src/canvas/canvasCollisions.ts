import { ShapeTypes, CanvasShapes } from './canvasShapes';
import { CanvasPosition } from './types';
import { pointInCircle } from '../collisions/pointInCircle';

export type MouseHitEvent = {
    pos: CanvasPosition,
    shapeType: ShapeTypes,
    mouseHits: MouseHits
};

export type MouseHits = {
    hits: Map<ShapeTypes, Set<string>>;
};

export function collisionProcessor(pos: CanvasPosition, shapes: CanvasShapes): MouseHits {
    let ret: MouseHits = {
        hits: new Map()
    };

    for (let point of shapes.points.values()) {
        const hps = new Set();
        const hit = pointInCircle(point.x, point.y, pos[0], pos[1], 3);
        if (hit === true) {
            hps.add(point.id);
        }
        ret.hits.set(ShapeTypes.POINT, hps);
    }
    
    return ret;
}