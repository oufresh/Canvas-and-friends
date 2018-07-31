import * as d3 from 'd3';

let reset = null;

let svgC = null;
let width = null;
let height = null;

let zoom = null;
let layer = null;


function zoomed()
{
    console.log(d3.event.transform);
    
    // x => xt
    // xt = tx + x*k
    // allora tx non deve uscire dal range permesso altrimenti non applico la trasformazione
    const x0 = 10;
    let xt0 = x0*d3.event.transform.k + d3.event.transform.x;
    if (xt0 < 0)
        console.log('out!!!');
    else
        layer.attr("transform", d3.event.transform);
}

function resetted() {
    layer.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
  }

function svg()
{
    reset = document.getElementById('reset');

    svgC = d3.select("#svg");
    width = +svgC.attr("width");
    height = +svgC.attr("height");

    zoom = d3.zoom();
    zoom.scaleExtent([0.5, 4])
        //.translateExtent([[-100, -100], [width + 90, height + 100]])
        .on("zoom", zoomed);
    
    svgC.call(zoom);

    layer = svgC.append("g")
        .attr("transform", "translate(0, 0) scale(1)");

    layer.append("rect")
        .attr("x", 10)
        .attr("y", 10)
        .attr("width", width-20)
        .attr("height", height-20)
        .attr("fill", "blue")
        .attr("stroke","pink")
        .attr("stroke-width",1)
        .attr("fill-opacity",0.1);
    

d3.select("button")
    .on("click", resetted);
}

export default svg;