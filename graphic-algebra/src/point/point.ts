
export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
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
    constructor(x: number, y: number, r: number) {
        super(x, y);
        this.r = r;
    }

    hit(p: Point): boolean {
        return Math.abs(p.x - this.x) <= this.r && Math.abs(p.y - this.y) <= this.r;
    }

    hitCoords(x: number, y: number): boolean {
        return x === this.x && y === this.y;
    }
}