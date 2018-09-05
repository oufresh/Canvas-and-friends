import * as d3 from "d3";
import * as d3Tile from "d3-tile";
//import {zoom as d3Zoom} from 'd3-zoom';
import * as topojson from 'topojson';

var pi = Math.PI,
    tau = 2 * pi;

var width = 960;//Math.max(960, document.getElementById("container").clientWidth),
var height = 500;//Math.max(500, document.getElementById("container").clientHeight);

var tile = null;
var raster = null;
var vector = null;

function zoomed() {
    var transform = d3.event.transform;
  
    var tiles = tile
        .scale(transform.k)
        .translate([transform.x, transform.y])
        ();
  
    vector
        .attr("transform", transform)
        .style("stroke-width", 1 / transform.k);
  
    var image = raster
        .attr("transform", stringify(tiles.scale, tiles.translate))
      .selectAll("image")
      .data(tiles, function(d) { return d; });
  
    image.exit().remove();
  
    image.enter().append("image")
        .attr("xlink:href", function(d) {
              console.log(d);
              return "http://" + "abc"[d.x % 3] + ".tile.openstreetmap.org/" + d.z + "/" + d.x + "/" + d.y + ".png"; 
          })
        .attr("x", function(d) { return d.x * 256; })
        .attr("y", function(d) { return d.y * 256; })
        .attr("width", 256)
        .attr("height", 256);
  }
  
  function stringify(scale, translate) {
      var k = scale / 256, r = scale % 1 ? Number : Math.round;
      return "translate(" + r(translate[0] * scale) + "," + r(translate[1] * scale) + ") scale(" + k + ")";
  }

export function testSvgMap()
{
    // Initialize the projection to fit the world in a 1×1 square centered at the origin.
    var projection = d3.geoMercator()
        .scale(1 / tau)
        .translate([0, 0]);

    var path = d3.geoPath()
        .projection(projection);

    tile = d3Tile.tile()
        .size([width, height]);

    var zoom = d3.zoom()
        .scaleExtent([1 << 11, 1 << 14])
        .on("zoom", zoomed);

    var svg = d3.select("#svgmap")
        .attr("width", width)
        .attr("height", height);

    raster = svg.append("g");

    vector = svg.append("path");

    fetch('http://localhost:8080/us.json').then(resp => {
            if (resp.ok)
                return resp.json();
            else {
                console.error(resp.statusText);
                throw new Error('Response error');
            }
        }).then(us => {
            // Compute the projected initial center.
            var center = projection([-98.5, 39.5]);

            // Apply a zoom transform equivalent to projection.{scale,translate,center}.
            svg
                .call(zoom)
                .call(zoom.transform, d3.zoomIdentity
                .translate(width / 2, height / 2)
                .scale(1 << 12)
                .translate(-center[0], -center[1]));

            vector
                .attr("d", path(topojson.mesh(us, us.objects.counties)));
        }).catch(error => {
            console.error(error);
    });
}


