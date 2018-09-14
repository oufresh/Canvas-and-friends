//@flow
import React from 'react';

const svgCanvasStyle = {
    position: 'absolute',
    top: '0px',
    left: '0px',
    width: '100%',
    height: '100%'
};

const SvgCanvas = (props) => {
    return <svg style={svgCanvasStyle} ref={props.r}>
            {props.children}
        </svg>;
}

export { SvgCanvas };
