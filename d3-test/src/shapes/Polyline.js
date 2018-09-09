import React from 'react';

export const Polyline = (props) => {
    const style = {
        fill:'none',
        stroke: props.color?props.color:'black',
        strokeWidth: props.width?props.width:1
    };

    let points = "";
    props.points.map(point => {
        points += point[0] + "," + point[1] + " ";
    });

    return (
        <polyline points={points} style={style} />
    );
}