//@flow
/**
 * Calcolo delle coordinate del mouse relative all'elemento <svg>
 * @param {*} evt Evento del mouse ricevuto con listener sull'elemento <svg>
 * @param {*} svgElem riferimento a <svg>
 */
export function getMousePos(
  evt: SyntheticMouseEvent<HTMLElement>,
  svgElem?: HTMLElement
): Array<number> {
  const target: any = svgElem ? svgElem : evt.target;
  const rect = target ? target.getBoundingClientRect() : { left: 0, top: 0 };
  const x =
    evt.pageX -
    rect.left -
    (window.scrollX ? window.scrollX : window.pageXOffset);
  const y =
    evt.pageY -
    rect.top -
    (window.scrollY ? window.scrollY : window.pageYOffset);
  return [x, y];
}
