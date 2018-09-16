import React from 'react';
import { zoom as d3Zoom, zoomIdentity } from 'd3-zoom';

import * as svgStyle from '../SvgZoom.css';
import { MyShape } from '../../shapes/MyShape';
import Ruler from '../Ruler';


function stringify(transform)
{
  return ''+transform;
}

export class Zoom extends React.Component
{
    constructor(props)
    {
        super(props);
        this.svgRef = React.createRef();
        this.zoom = null;
        this.svg = null;
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.state = {
            transform: zoomIdentity
        };
    }

    moveTo(scale, tx, ty, px, py)
    {
      //const t = zoomIdentity.translate(tx, ty).scale(scale).translate(px, py);
      //this.svg.call(this.zoom.transform, t);
    }

    animMoveTo(scale, tx, ty, px, py)
    {
      //const t = zoomIdentity.translate(tx, ty).scale(scale).translate(px, py);
      //this.svg.transition().duration(100).call(this.zoom.transform, t);
    }

    componentDidMount()
    {
      /*this.svg = d3Select(this.svgRef.current);

      //se vogliamo gestire il click con d3 altrimenti mettiamo null e lo gestisce React
      this.zoom = d3Zoom().on("zoom", this.onZoomed);
      this.svg.call(this.zoom, zoomIdentity).on("dblclick.zoom", null);

      if (this.props.moveTo)
      {
        const { moveTo } = this.props;
        this.moveTo(moveTo.scale, moveTo.tx, moveTo.ty, moveTo.px, moveTo.py);
      }*/

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
      /*if (isMovedTo(this.props.moveTo, prevProps.moveTo)) {
        console.log("moveTo");
        this.animMoveTo(this.props.moveTo.scale, this.props.moveTo.tx, this.props.moveTo.ty, this.props.moveTo.px, this.props.moveTo.py);
      }*/
    }

    onMouseMove(e) {
      //const pos = getMousePos(e, this.svgRef.current);
      /*if (this.props.onMouseMove) {
        this.props.onMouseMove(pos);
      }*/
    }

    onDoubleClick(e) {
      /*if (this.props.onDoubleClick)
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
      }*/

      this.setState(ps => {
        const transform = ps.transform.scale(1.2);
        return {
            transform
        };
      })
    }

    onMouseWheel(e) {
        console.log(e);
    }

    /**
     * <g id="layer" transform={transform} dangerouslySetInnerHTML={createMarkup(this.props.drawings)} />
     
     */
    
    render()
    {     
        const trs = stringify(this.state.transform);
        
        return(
          <div className={svgStyle.svgZoomCont}>
            <svg 
              id={"svg"}
              ref={this.svgRef}
              className={svgStyle.svgZoom} 
              onMouseMove={this.onMouseMove} 
              onDoubleClick={this.onDoubleClick} 
              onWheel={this.onMouseWheel}
              width={this.props.viewPort[0]} 
              height={this.props.viewPort[1]}
            >
              <Ruler width={this.props.viewPort[0]} height={this.props.viewPort[1]}/>
              <g id="layer" transform={trs}>
                <MyShape />
              </g>         
            </svg>
          </div>
        );
    }
}
