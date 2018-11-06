import { Line } from './line';
import { Point } from '../point/point';
import * as glMatrix from 'gl-matrix';

export class ExpLine extends Line {
    expVertex: Array<Point>;
    constructor(p1: Point, p2: Point, d: number) {
        super(p1, p2);
        this.expVertex = [];

        // se fosse orizzontale
        // if (p1.y === p2.y)
        //    this.expVertex.push(new Point(p1.x - d, p1.y - d));
        
        const m = (p2.y - p1.y) / (p2.x - p1.x);
        const alfa = Math.atan(m);

        console.log(alfa);

        // storta tra 0 e Pi/2
        const diag = d * Math.SQRT2;
        const da = diag * Math.sin(alfa);
        const db = diag * Math.cos(alfa);

        /*console.log(diag);
        console.log(da);
        console.log(db);*/

        // this.expVertex.push(new Point(p1.x - db, p1.y - da));

        // const tVec = glMatrix.vec2.create();
        // parto dalla matrice identità
        const iMat = glMatrix.mat2d.create();
        const tempMat = glMatrix.mat2d.clone(iMat);
        let tMat = glMatrix.mat2d.clone(iMat);

        // l'ordine logico delle trasformazioni è inverso
        // a quello del prodotto delle matrici, ricordare!!
        // così lo riporto dritto nell'origine
        glMatrix.mat2d.rotate(tempMat, iMat, -alfa/*Math.PI / 8*/);
        glMatrix.mat2d.translate(tMat, tempMat, glMatrix.vec2.fromValues(-p1.x, -p1.y));

        let aVec = glMatrix.vec2.fromValues(p1.x, p1.y);
        let out = glMatrix.vec2.create();
        glMatrix.vec2.transformMat2d(out, aVec, tMat);
        console.log(out);
        this.expVertex.push(new Point(out[0], out[1]));

        aVec = glMatrix.vec2.fromValues(p2.x, p2.y);
        out = glMatrix.vec2.create();
        glMatrix.vec2.transformMat2d(out, aVec, tMat);
        const p2t = new Point(out[0], out[1]);
        this.expVertex.push(p2t);

        // a questo punto poi posso aggiungere i punti calcolando le traslazioni
        tMat = glMatrix.mat2d.clone(iMat);
        glMatrix.mat2d.translate(tMat, iMat, glMatrix.vec2.fromValues(d, d));
        aVec = glMatrix.vec2.fromValues(p2t.x, p2t.y);
        glMatrix.vec2.transformMat2d(out, aVec, tMat);
        this.expVertex.push(new Point(out[0], out[1]));

        tMat = glMatrix.mat2d.clone(iMat);
        glMatrix.mat2d.translate(tMat, iMat, glMatrix.vec2.fromValues(d, -d));
        aVec = glMatrix.vec2.fromValues(p2t.x, p2t.y);
        glMatrix.vec2.transformMat2d(out, aVec, tMat);
        this.expVertex.push(new Point(out[0], out[1]));

        glMatrix.mat2d.translate(tempMat, iMat, glMatrix.vec2.fromValues(p1.x, p1.y));
        glMatrix.mat2d.rotate(tMat, tempMat, alfa);

        const ret = this.expVertex.map((v: Point) => {
            aVec = glMatrix.vec2.fromValues(v.x, v.y);
            glMatrix.vec2.transformMat2d(out, aVec, tMat);
            this.expVertex.push(new Point(out[0], out[1]));
        });

        // const pc = new Point()

        // riapplico la trasformazione inverssa per portare la linea nella
        // posizione iniziale
        
        // this.expVertex.push(new Point(p1.x - dy, p1.y + dx));
    }
}