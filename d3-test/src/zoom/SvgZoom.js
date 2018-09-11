import React from 'react'
import { zoom as d3Zoom, zoomIdentity } from 'd3-zoom';
import { event, select as d3Select } from 'd3-selection';
import * as svgStyle from './SvgZoom.css';
import { MyShape } from '../shapes/MyShape';
import Ruler from './Ruler';

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

    moveTo(scale, tx, ty, px, py)
    {
      const t = zoomIdentity.translate(tx, ty).scale(scale).translate(px, py);
      this.svg.call(this.zoom.transform, t);
    }

    animMoveTo(scale, tx, ty, px, py)
    {
      const t = zoomIdentity.translate(tx, ty).scale(scale).translate(px, py);
      this.svg.transition().duration(100).call(this.zoom.transform, t);
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

      if (this.props.moveTo)
      {
        const { moveTo } = this.props;
        this.moveTo(moveTo.scale, moveTo.tx, moveTo.ty, moveTo.px, moveTo.py);
      }

      /*document.getElementById("svg").addEventListener("dblclick", (e) => {
        console.log("doubleclick!!!");
        if (e.target.id !== "svg") {
          console.log("stop it!!!");
          e.stopPropagation();
        }
      });*/
    }

    componentDidUpdate(prevProps)
    {
      //if (prevProps.moveTo.scale != this.props.moveTo.scale) {
      if (isMovedTo(this.props.moveTo, prevProps.moveTo)) {
        console.log("moveTo");
        this.animMoveTo(this.props.moveTo.scale, this.props.moveTo.tx, this.props.moveTo.ty, this.props.moveTo.px, this.props.moveTo.py);
      }
    }

    onMouseMove(e) {
      const pos = getMousePos(e, this.svgRef.current);
      /*if (this.props.onMouseMove) {
        this.props.onMouseMove(pos);
      }*/
    }

    onDoubleClick(e) {
      if (this.props.onDoubleClick)
      {
        const foundTarget = getActualTarget(e, (e) => { 
          return (e ? (e.dataset ? (e.dataset.id === "2"): false) : false); 
        });
        if (foundTarget)
          this.props.onDoubleClick(foundTarget);
        else {
          console.log("no target!!!");
          const pos = getMousePos(e, this.svgRef.current);
          this.props.onDblClickZoom(pos);
        }
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
            <svg 
              id={"svg"}
              ref={this.svgRef}
              className={svgStyle.svgZoom} 
              onMouseMove={this.onMouseMove} 
              onDoubleClick={this.onDoubleClick} 
              width={this.props.viewPort[0]} 
              height={this.props.viewPort[1]}
            >
              <Ruler width={this.props.viewPort[0]} height={this.props.viewPort[1]}/>
              <g id="layer" transform={transform}>
                <MyShape />
              </g>         
            </svg>
          </div>
        );
    }
}
