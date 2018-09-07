import React from 'react'
import { zoom as d3Zoom, zoomIdentity } from 'd3-zoom';
import * as svgStyle from './SvgZoom.css';

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
  
  function calcCoords(mx, my)
  {
    if (d3Transform) {
      let cx = (mx - d3Transform.x) / d3Transform.k;
      let cy = (my - d3Transform.y) / d3Transform.k;
      return [cx, cy];
    }
  
    return [mx, my];
  }

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

function getActualTarget(event) {
  var el = event.target || event.srcElement;
  return el.nodeType == 1? el : el.parentNode;
}


class SvgZoom extends React.PureComponent
{
    constructor(props)
    {
        super(props);
        this.svgRef = React.createRef();
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
    }

    componentDidMount()
    {
    }



    onMouseMove(e) {
      const pos = getMousePos(e, this.svgRef.current);
      if (this.props.onMouseMove) {
        this.props.onMouseMove(pos);
      }
    }

    onDoubleClick(e) {
      if (this.props.onDoubleClick)
        this.props.onDoubleClick(getActualTarget(e));
    }

    render()
    {
        const transform = null;
        
        return(
          <div className={svgStyle.svgZoomCont}>
            <svg ref={this.svgRef} className={svgStyle.svgZoom} onMouseMove={this.onMouseMove} onDoubleClick={this.onDoubleClick} width={800} height={600}>
                <g id="layer" transform={transform} dangerouslySetInnerHTML={createMarkup(this.props.drawings)} />
            </svg>
          </div>
        );
    }
}

export default SvgZoom;
