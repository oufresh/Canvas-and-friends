import React from 'react';

export const Circle = (props) => {
    const style={
        fill: props.color ? props.color : undefined
    };
    return <circle x={0} y={0} r={props.r} style={style}></circle>;
}
