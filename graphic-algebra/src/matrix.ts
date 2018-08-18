/**
 * Vogliamo moltiplicare delle matrici di traslazione per fare gli esempi. Nota se usassi webgl piazzando dei punti in un vector poi userei la GPU.
 * Mica detto che devo disegnarli poi ....
 * altra libreia interessante è glMatrix
 */

import * as glMatrix from 'gl-matrix';

export function Test(cb: Function): void
{
    //creo un vettore che rappresenta un vertice
    const aVec = glMatrix.vec2.create();
    aVec[0] = 10;
    aVec[1] = 20;

    console.log(aVec.toString());
    cb(aVec);

    //parto dalla matrice identità
    const aMat = glMatrix.mat2d.create();

    //per un certo numero di cicli, come in un movimento, calcolo una nuova matrice di trasformazione
    let i = 0;
    const tId = setInterval(()=>{
        const tVec = glMatrix.vec2.create();
        tVec[0] = 5;

        const tMat = glMatrix.mat2d.clone(aMat);

        glMatrix.mat2d.translate(aMat, tMat, tVec);

        console.log(aMat.toString());


        //trasformo il vettore moltiplicando per la matrice per trasformare il vettore -> in questo caso solo traslazione
        const out = glMatrix.vec2.create();
        glMatrix.vec2.transformMat2d(out, aVec, aMat);
        console.log('vettore trasformato: ' + out.toString());
        cb(out);

        if (i >= 10)
            clearInterval(tId);

        i++;
    }, 2000);
    
}