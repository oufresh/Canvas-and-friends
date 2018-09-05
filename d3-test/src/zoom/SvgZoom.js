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

function getMousePos(evt) {
    //console.log(svg._groups[0][0]);
    var rect = svgElem.getBoundingClientRect();
    //console.log(rect);
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  
  var d3Transform = null;
  
  function calcCoords(mx, my)
  {
    if (d3Transform) {
      let cx = (mx - d3Transform.x) / d3Transform.k;
      let cy = (my - d3Transform.y) / d3Transform.k;
      return [cx, cy];
    }
  
    return [mx, my];
  }


class SvgZoom extends React.Component
{
    constructor(props)
    {
        super(props);
        this.svgRef = React.createRef();
    }

    componentDidMount()
    {
    }

    render()
    {
        const transform = null;
        return(
            <svg ref={this.svgRef} className={svgStyle.svgZoom}>
                <g id="layer" transform={transform}>
                    {this.props.drwaings}
                </g>
            </svg>
        );
    }
}

export default SvgZoom;
/*
const svgElem = document.getElementById("svgmap");
let st = getComputedStyle(svgElem);
const svgWidth = parseInt(st.width.split("px")[0]);
const svgHeight = parseInt(st.height.split("px")[0]);

const svg = d3.select(svgElem);
const container = svg.append('g');
const data = [
  { x: 0, y: 0, width: svgWidth, height: svgHeight, id: 'bckground' },
  { x: 50, y: 110, width: 100, height: 200, id: 'shape' },
  { x: ((svgWidth/2)-1), y: ((svgHeight/2)-1), width: 2, height: 2, id: 'center' },
];

const rect = container.selectAll('rect').data(data, d => d)  .attr('width', d => d.width)
.attr('id', d => d.id)
.attr('height', d => d.height)
.attr('x', d => d.x)
.attr('y', d => d.y)
.attr('style',d => drawStyle(d));

rect.exit().remove();
rect.enter().append('rect')
.on("mouseover", function() {
  if (this.id == "shape")
    d3.select(this).attr('style', "fill:rgb(0,125,255);stroke-width:3;stroke:rgb(0,0,0)")
})
.on("mouseout", function() {
  if (this.id == "shape")
  d3.select(this).attr('style', "fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)")
})
  .attr('id', d => d.id)
  .attr('width', d => d.width)
  .attr('height', d => d.height)
  .attr('x', d => d.x)
  .attr('y', d => d.y)
  .attr('style',d =>  drawStyle(d)
);

const infos = document.getElementById("infos");
infos.classList.add(widget.infos);
infos.innerHTML = `
<div class="${widget.infoRow}">
  <div class="${widget.infoValue}">
    <label>Schema width</label><label>${svgWidth}</label>
  </div>
  <div class="${widget.infoValue}">
    <label>Schema height</label><label>${svgHeight}</label>
  </div>
  <div class="${widget.infoValue}">
    <label>Schema center</label><label>(${((svgWidth/2)-1)},${((svgHeight/2)-1)})</label>
  </div>
</div>
<div class="${widget.infoRow}">
  <div class="${widget.infoValue}">
    <label>Mouse X:</label><label id="mousex"></label>
  </div>
  <div class="${widget.infoValue}">
    <label>Mouse y:</label><label id="mousey"></label>
  </div>
  <div class="${widget.infoValue}">
    <label>Schema X:</label><label id="schemax"></label>
  </div>
  <div class="${widget.infoValue}">
    <label>Schema y:</label><label id="schemay"></label>
  </div>
</div>
`;

const mousex = infos.querySelector("#mousex");
const mousey = infos.querySelector("#mousey");
const schemax = infos.querySelector("#schemax");
const schemay = infos.querySelector("#schemay");



svg.on("mousemove", () => {
  //console.log(d3Transform);
  const pos = getMousePos(d3.event);
  //clientX clientY
  mousex.innerHTML = pos.x;
  mousey.innerHTML = pos.y;
  const schemaPos = calcCoords(pos.x, pos.y);
  schemax.innerHTML = Math.round(schemaPos[0]);
  schemay.innerHTML = Math.round(schemaPos[1]);
})

const zoom = d3.zoom()
  .scaleExtent([0.25, 2.25])
  .on("zoom", () => {
    d3Transform = d3.event.transform;
    container.attr("transform", d3.event.transform);
  });

  svg.call(zoom);
  svg.call(zoom.transform, d3.zoomIdentity
    .translate(50, 50)
    .scale(0.5)
    .translate(-svgWidth/2, -svgHeight/2)
  );

*/