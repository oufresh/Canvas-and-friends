import { Shape } from './base';

export class Point implements Shape {
    id: string;
    x: number;
    y: number;

    constructor(id: string, x: number, y: number) {
        this.id = id;
        this.x = x;
        this.y = y;
    }

    hit(p: Point): boolean {
        return this.x === p.x && this.y === p.y;
    }

    hitCoords(x: number, y: number): boolean {
        return x === this.x && y === this.y;
    }
}

export class ExpPoint extends Point {
    r: number;
    constructor(id: string, x: number, y: number, r: number) {
        super(id, x, y);
        this.r = r;
    }

    hit(p: Point): boolean {
        return Math.abs(p.x - this.x) <= this.r && Math.abs(p.y - this.y) <= this.r;
    }

    hitCoords(x: number, y: number): boolean {
        return x === this.x && y === this.y;
    }
}