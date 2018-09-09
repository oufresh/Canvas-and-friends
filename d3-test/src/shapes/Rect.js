import React from "react";

/*
    <rect width="100" height="200" x="50" y="110" 
    style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />
*/

export const Rect = (props) => {
    //const style = 'fill:'+props.color+(props.strokeWidth?(';stroke-width:'+props.strokeWidth):'')+(props.stroke?(';stroke:'+props.strokeColor):'');
    return <rect x="0" y="0" width={props.width+""} height={props.height+""} style={{fill:props.color}}></rect>
}