import { Point } from './point';

export class Line {
    id: string;
    vertex: Array<Point>;
    constructor(id: string, p1: Point, p2: Point) {
        this.id = id;
        this.vertex = [];
        this.vertex.push(p2);
        this.vertex.push(p1);
    }
}
