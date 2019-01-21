import { Point } from './point';
import { Shape } from './base';

export class Line implements Shape {
    vertex: Array<Point>;
    id: string;
    constructor(id: string, p1: Point, p2: Point) {
        this.id = id;
        this.vertex = [];
        this.vertex.push(p2);
        this.vertex.push(p1);
    }
}
