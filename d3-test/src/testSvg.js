import * as d3 from "d3";

function getRandomData() {
    const data = [];
    let num = Math.floor(Math.random() * 10) + 1;
    while (num > 0)
    {   
        data.push({
            x: 20 + num * 50,
            y: 20,
            r: 10
        });
        num--;
    }
    return data;
}

const testSvg = () => {
    const svg = d3.select("svg");
    const circleData = getRandomData();

    //data join
    var circle = svg.selectAll("circle").data(circleData);

    //update
    circle
        //.attr("cx", function(d) { return d.x; })
        //.attr("cy", function(d) { return d.y; })
        //.attr("r", 0).transition()
        //.attr("r", function(d) { return d.r; })
        .attr("fill", "blue");

  
    //enter + update
    circle.enter().append("circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("fill", "green")
        .merge(circle)
        .attr("r", 0).transition()
        .attr("r", function(d) { return d.r; });
        
        

    //exit
    circle.exit().transition().attr("r", 0).remove();



    var text = svg.selectAll("text").data(circleData);
    
    text.enter().append("text")//.merge(text)
        .attr("x", function(d) { return d.x - d.r/2; })
        .attr("y", function(d) { return d.y + d.r/2; })
        .text( function (d) { return "( " + d.x + ", " + d.y +" )"; })
        .attr("font-family", "sans-serif")
        .attr("font-size", "8px")
        .attr("fill", "red");

    text.exit().remove();
};

document.getElementById("refresh-svg").addEventListener('click', testSvg);

export default testSvg;