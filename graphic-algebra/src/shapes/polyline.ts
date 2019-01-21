import { Point } from './point';
import { Shape } from './base';

/**
 * La polyline è difficile poi da rappresentare e anche pixi non sembra avere eventi su questa
 * Quando si disegna è utile fare dei cerchi e rettangoli per avere meglio gli eventi
 * cerchi -> vertici
 * rettangoli -> lati
 * In questo modo si dovrebbero anche evitare gli effetti dei bordi non tondi
 * 
 * Qui per ora facciamo il rettangolo per divertirci con l'algebra, sarebbe meglio usare solo
 * la linea per descrivere il collegamento tra oggetti
 */

export class Polyline implements Shape {
    points: Array<Point>;
    id: string;

    constructor(id: string, start: Point, end: Point) {
        this.id = id;
        this.points = [];
        this.points.push(start);
        this.points.push(end);

        const d = 2;
        const k = (end.y - start.y) / (end.x - start.x);
        const alfa = Math.atan(k);

        const dd = d * Math.SQRT2;

        const dx = dd / Math.cos(alfa);
        const dy = dd / Math.sin(alfa);

        const A: Point = new Point(id + '-S', start.x - dx, start.y - dy);
    }

    addPoint(point: Point, index?: number): void {
        if (index !== undefined) {
            this.points.splice(index, 0, point);
        } else {
            this.points.push(point);
        }
    }

    isBeetween(A: Point, B: Point, C: Point): boolean {
        // if AC is horizontal
        if (A.x === C.x) { return B.x === C.x; }
        // if AC is vertical.
        if (A.y === C.y) { return B.y === C.y; }
        // match the gradients  
        const k = (B.y - A.y) / (B.x - A.x);
        const b = A.y - A.x * k;
        const Y = C.x * k + b;
        return Math.round(Y) === C.y;
    }

    hit(x: number, y: number): boolean {
        let hit = false;
        for (let i = 0; i < (this.points.length - 1); i++) {
            const isb = this.isBeetween(this.points[i], this.points[i + 1], new Point('TEMP', x, y));
            hit = hit || isb;
        }

        return hit;
    }
}
