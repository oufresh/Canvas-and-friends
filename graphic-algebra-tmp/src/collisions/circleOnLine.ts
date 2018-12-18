import { calcDistance } from './collisionCals';
import { pointInCircle } from './pointInCircle';
import { pointInLine } from './pointInLine';

export interface CollisionPoint {
    hit: boolean;
    x?: number;
    y?: number;
    onSegment: boolean;
}

export function circleInLine(x1: number, y1: number, x2: number, y2: number, cx: number, cy: number, r: number) {
    // is either end INSIDE the circle?
    // if so, return true immediately
    const inside1 = pointInCircle(x1, y1, cx, cy, r);
    if (inside1) {
        return {
            onSegment: true,
            hit: true,
            x: x1,
            y: y1
        };
    }
    const inside2 = pointInCircle(x2, y2, cx, cy, r);
    if (inside2) {
        return {
            onSegment: true,
            hit: true,
            x: x2,
            y: y2
        };
    }

    // il prodotto scalare di un vettore sull'altro diviso la norma determina la proieizione del 
    // primo sul secondo

    const lineLen = calcDistance(x1, y1, x2, y2);
    const dot =  ( ((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1)) ) / Math.pow(lineLen, 2);

    // find the closest point on the line
    // si usano i coseni per il segmento proiettato sull'alrto vettore
    const closestX = x1 + (dot * (x2 - x1));
    const closestY = y1 + (dot * (y2 - y1));

    const onSegment = pointInLine(x1, y1, x2, y2, closestX, closestY);
    if (!onSegment) {
        return {
            onSegment: false,
            hit: false,
            x: closestX,
            y: closestY
        };
    }

    // get distance to closest point
    const distance = calcDistance(cx, cy, closestX, closestY);
    
    if (distance <= r) {
        return {
            hit: true,
            onSegment: true,
            x: closestX,
            y: closestY
        };
    }

    return {
        hit: false,
        onSegment: true,
        x: closestX,
        y: closestY
    };
}
