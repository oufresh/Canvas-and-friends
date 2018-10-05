import { Line } from "./line";
import { Point } from "../point/point";

export class ExpLine extends Line {
    expVertex: Array<Point>;
    constructor(p1: Point, p2: Point, d: number) {
        super(p1, p2);
        this.expVertex = [];

        // se fosse orizzontale
        //if (p1.y === p2.y)
        //    this.expVertex.push(new Point(p1.x - d, p1.y - d));
        

        const m = (p2.y - p1.y) / (p2.x - p1.x);
        const alfa = Math.atan(m);

        console.log(alfa);

        //storta tra 0 e Pi/2
        const diag = d * Math.SQRT2;
        const da = diag * Math.sin(alfa);
        const db = diag * Math.cos(alfa);

        console.log(diag);
        console.log(da);
        console.log(db);

        this.expVertex.push(new Point(p1.x - db, p1.y - da));

        new Point(p1.x - db, p1.y - da)
        //this.expVertex.push(new Point(p1.x - dy, p1.y + dx));
    }
}