import { Point } from '../point';

export class Polyline
{
    points: Array<Point>
    
    constructor(start: Point, end: Point)
    {
        this.points.push(start);
        this.points.push(end);
    }

    addPoint(point: Point, index?: number) {
        if (index !== undefined) {
            this.points.splice(index, 0, point);
        }
        else
            this.points.push(point);
    }

    isBeetween(A: Point, B: Point, C: Point)
    {
        // if AC is horizontal
        if (A.x == C.x) return B.x == C.x;
        // if AC is vertical.
        if (A.y == C.y) return B.y == C.y;
        // match the gradients
        return (A.x - C.x)*(A.y - C.y) == (C.x - B.x)*(C.y - B.y);
    }
}
