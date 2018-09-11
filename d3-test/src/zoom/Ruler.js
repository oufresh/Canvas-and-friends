import React from 'react';
import { ShapeGroup } from '../shapes/ShapeGroup';
import { Polyline } from '../shapes/Polyline';

const Ruler = ({width, height}) => {
    return (
        <ShapeGroup>
            <Polyline points={[[0,0],[width,height]]} color={'rgba(0,255,125,0.4)'} />
            <Polyline points={[[width,0],[0,height]]} color={'rgba(0,255,125,0.4)'} />
        </ShapeGroup>
    );
}

export default Ruler;
