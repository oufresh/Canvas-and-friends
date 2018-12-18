import { Point } from './point';

export class Line {
    vertex: Array<Point>;
    constructor(p1: Point, p2: Point) {
        this.vertex = [];
        this.vertex.push(p2);
        this.vertex.push(p1);
    }
}
