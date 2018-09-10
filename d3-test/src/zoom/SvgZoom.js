import React from 'react'
import { zoom as d3Zoom, zoomIdentity } from 'd3-zoom';
import { event, select as d3Select } from 'd3-selection';
import * as svgStyle from './SvgZoom.css';
import { Rect } from '../shapes/Rect';
import { Circle } from '../shapes/Circle';
import { MyShape } from '../shapes/MyShape';

function drawStyle(d)
{
  if (d.id === 'bckground')
    return "fill:rgb(200,200,200);";
  else if (d.id === 'shape')
    return "fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)";
  else if (d.id === 'center')
    return "fill:rgb(255,0,0);stroke-width:1;stroke:rgb(255,0,0)";
  else
    return "";
}

function getMousePos(evt, svgElem) {
  const rect = svgElem.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };

  
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

function stringify(transform)
{
  return ''+transform;
}


export class SvgZoom extends React.Component
{
    constructor(props)
    {
        super(props);
        this.svgRef = React.createRef();
        this.zoom = null;
        this.svg = null;
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onZoomed = this.onZoomed.bind(this);
    }

    onZoomed()
    {
      if (this.props.onZoomed)
        this.props.onZoomed(event.transform);
    }

    componentDidMount()
    {
      this.svg = d3Select(this.svgRef.current);

      //se vogliamo gestire il click con d3 altrimenti mettiamo null e lo gestisce React
      this.zoom = d3Zoom().on("zoom", this.onZoomed);
      this.svg.call(this.zoom, zoomIdentity).on("dblclick.zoom", null);
    }

    onMouseMove(e) {
      const pos = getMousePos(e, this.svgRef.current);
      if (this.props.onMouseMove) {
        this.props.onMouseMove(pos);
      }
    }

    onDoubleClick(e) {
      if (this.props.onDoubleClick)
      {
        const foundTarget = getActualTarget(e, (e) => { 
          return (e ? (e.dataset ? (e.dataset.id === "2"): false) : false); 
        });
        if (foundTarget)
          this.props.onDoubleClick(foundTarget);
        else
          this.props.onDoubleClick(null);
      }
    }

    /**
     * <g id="layer" transform={transform} dangerouslySetInnerHTML={createMarkup(this.props.drawings)} />
     
     */
    
    render()
    {
        
        const transform = this.props.transform ? stringify(this.props.transform) : null;
        
        return(
          <div className={svgStyle.svgZoomCont}>
            <svg id={"svg"} ref={this.svgRef} className={svgStyle.svgZoom} onMouseMove={this.onMouseMove} onDoubleClick={this.onDoubleClick} width={800} height={600}>
              <g id="layer" transform={transform}>
                <MyShape />
              </g>         
            </svg>
          </div>
        );
    }
}
