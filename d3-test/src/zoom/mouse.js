
function getMousePos(evt, svgElem) {
    const rect = svgElem.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  
  function isMovedTo(moveTo, prevMoveTo) {
    return moveTo.tx != prevMoveTo.tx ||
      moveTo.ty != prevMoveTo.ty ||
      moveTo.px != prevMoveTo.px ||
      moveTo.py != prevMoveTo.py ||
      moveTo.scale != prevMoveTo.scale;
  }
    
  export function calcCoords(d3Transform, mx, my)
  {
    //console.log(d3Transform);
    if (d3Transform) {
      let cx = (mx - d3Transform.x) / d3Transform.k;
      let cy = (my - d3Transform.y) / d3Transform.k;
      return [cx, cy];
    }
  
    return [mx, my];
  }
  
  export const initialTransform = zoomIdentity;
  
  function createMarkup(drawings) {
      return { __html: drawings};
  }
  
  let oldTarget = null;
  function getTarget(e, cb)
  {
    var target=e.target;
    if(target!==oldTarget){
        if (cb)
          cb(target);
        oldTarget=target;
    }
  }
  
  function filterTarget(element, filter)
  {
    //console.log(element);
    if (element.id === "svg")
      return null;
    else if (element.nodeType === 1) {
      if (filter(element) === true)
        return element;
      else
        return filterTarget(element.parentNode, filter);
    }
    else //if (element.nodeType === 9)
      return null;
    //else
    //  return filterTarget(element.parentNode, filter);
  }
  
  function getActualTarget(event, filter) {
    var el = event.target || event.srcElement;
    const f = filter ? filter : () => true;
    const found = filterTarget(el, f);
    return found;
  }