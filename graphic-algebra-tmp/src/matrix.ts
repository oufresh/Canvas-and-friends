/**
 * Vogliamo moltiplicare delle matrici di traslazione per fare gli esempi. Nota se usassi webgl piazzando dei punti in un vector poi userei la GPU.
 * Mica detto che devo disegnarli poi ....
 * altra libreia interessante è glMatrix
 */

import * as glMatrix from 'gl-matrix';

declare type testCb = (v: glMatrix.vec2) => void;

export function Test(cb: testCb): void {
    // creo un vettore che rappresenta un vertice
    const aVec = glMatrix.vec2.create();
    aVec[0] = 10;
    aVec[1] = 20;

    console.log(aVec.toString());
    cb(aVec);

    // parto dalla matrice identità
    const aMat = glMatrix.mat2d.create();

    // per un certo numero di cicli, come in un movimento, calcolo una nuova matrice di trasformazione
    let i = 0;
    const tId = setInterval(() => {
        const tVec = glMatrix.vec2.create();
        tVec[0] = 5;

        const tMat = glMatrix.mat2d.clone(aMat);

        glMatrix.mat2d.translate(aMat, tMat, tVec);

        console.log(aMat.toString());

        // trasformo il vettore moltiplicando per la matrice per trasformare il vettore -> in questo caso solo traslazione
        const out = glMatrix.vec2.create();
        glMatrix.vec2.transformMat2d(out, aVec, aMat);
        console.log('vettore trasformato: ' + out.toString());
        cb(out);

        if (i >= 10) {
            clearInterval(tId);
        }

        i++;
    }, 2000);

}

declare type testTranslateCb = (vs: Array<glMatrix.vec2>) => void;

export function TestTranslate(cb: testTranslateCb) {
    const va = glMatrix.vec2.create();
    const vb = glMatrix.vec2.create();
    const vc = glMatrix.vec2.create();

    va[0] = 10;
    va[1] = 20;
    vb[0] = 100;
    vb[1] = 75;
    vc[0] = 100;
    vc[1] = 25;

    // parto dalla matrice identità
    const resMat = glMatrix.mat2d.create();

    // per un certo numero di cicli, come in un movimento, calcolo una nuova matrice di trasformazione
    let i = 0;
    const deltaX = 5;
    const tVec = glMatrix.vec2.create();
    tVec[0] = deltaX;

    const tId = setInterval(() => {
        const tMat = glMatrix.mat2d.clone(resMat);

        glMatrix.mat2d.translate(resMat, tMat, tVec);

        // trasformo il vettore moltiplicando per la matrice per trasformare il vettore -> in questo caso solo traslazione
        const outA = glMatrix.vec2.create();
        const outB = glMatrix.vec2.create();
        const outC = glMatrix.vec2.create();
        glMatrix.vec2.transformMat2d(outA, va, resMat);
        glMatrix.vec2.transformMat2d(outB, vb, resMat);
        glMatrix.vec2.transformMat2d(outC, vc, resMat);
        // console.log('vettore trasformato: ' + out.toString());
        cb([outA, outB, outC]);

        if (i >= 10) {
            clearInterval(tId);
        }

        i++;
    }, 2000);
}