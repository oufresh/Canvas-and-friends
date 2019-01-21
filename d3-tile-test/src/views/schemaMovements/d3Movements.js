//@flow
import { zoomIdentity } from "d3-zoom";
import { ANIMATION_MOVE_DURATION_DEFAULT } from "../../modules/maps/utils/constants";
/**
 * Muove lo schema in modo programmatico data la traslazione rispetto al centro di default di d3 in coordinate scalate
 * nel punto della viewport specificato alla scala voluta.
 * @param {*} svg d3 svg selected object
 * @param {*} zoom
 * @param {*} dx
 * @param {*} dy
 * @param {*} vX
 * @param {*} vY
 * @param {*} expScale
 */
export function moveRenderTo(
  svg: Object,
  zoom: Object,
  dx: number,
  dy: number,
  vX: number,
  vY: number,
  expScale: number
) {
  svg.call(
    zoom.transform,
    zoomIdentity
      .translate(vX, vY) //con questa sposto il centro nel mezzo della viewport definisco i tx e non moltiplicati per k
      .scale(expScale)
      .translate(dx, dy) //traslazione con le dimensioni dell'oggetto usando solo d3-zoom, con d3-tile [0,1]
  );
}

/**
 * Come moveRenderTo ma con animazione con una certa durata
 */
export function animatedMoveRenderTo(
  svg: Object,
  zoom: Object,
  dx: number,
  dy: number,
  vX: number,
  vY: number,
  expScale: number,
  duration?: number
) {
  const dt = duration ? duration : ANIMATION_MOVE_DURATION_DEFAULT;
  svg
    .transition()
    .duration(dt)
    .call(
      zoom.transform,
      zoomIdentity
        .translate(vX, vY)
        .scale(expScale)
        .translate(dx, dy)
    );
}

/**
 * Fa una taslazione dell'oggetto ma bisogna tener conto della scala:
 * tx = cx - kx and ty = cy - ky
 * 
 * @param {*} svg 
 * @param {*} zoom 
 * @param {*} dx 
 * @param {*} dy 
 */
export function moveTo(svg: Object, zoom: Object, dx: number, dy: number) {
  zoom.translateTo(svg, dx, dy);
}

/*export function scaleTo() {

}*/