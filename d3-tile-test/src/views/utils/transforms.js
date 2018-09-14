//@flow
import { zoomIdentity } from 'd3-zoom';
import { ANIMATION_MOVE_DURATION_DEFAULT } from '../../modules/maps/utils/constants';

export const transformToString = (x: number, y: number, k: number ): string => {
    return "translate("+ x + "," + y + ") scale(" + k + ")";
}

/**
 * Muove lo schema in modo programmatico data la traslazione rispetto al centro di default di d3 in coordinate scalate
 * nel punto della viewport specificato alla scala voluta.
 * @param {*} svg d3 svg selected object
 * @param {*} dx 
 * @param {*} dy 
 * @param {*} vX 
 * @param {*} vY 
 * @param {*} expScale 
 */
export function moveRenderTo(svg: Object, dx: number, dy: number, vX: number, vY: number, expScale: number)
{
    svg.call(this.zoom.transform, zoomIdentity
        .translate(vX, vY) //con questa sposto il centro nel mezzo della viewport definisco i tx e non moltiplicati per k
        .scale(expScale)
        .translate(dx, dy) // calcolo le dimensioni in proporzione a [-1, 1] esattamente come in opengl si trasla tra 0 e 1 nella matrice di proiezione
    );
}

/**
 * 
 */
export function animatedMoveRenderTo(svg: Object, dx: number, dy: number, vX: number, vY: number, expScale: number, duration?: number)
{
    const dt = duration ? duration : ANIMATION_MOVE_DURATION_DEFAULT;
    svg.transition().duration(dt).call(this.zoom.transform, zoomIdentity
        .translate(vX, vY) //con questa sposto il centro nel mezzo della viewport definisco i tx e non moltiplicati per k
        .scale(expScale)
        .translate(dx, dy) // calcolo le dimensioni in proporzione a [0, 1] esattamente come in opengl si trasla tra 0 e 1 nella matrice di proiezione
    );
}