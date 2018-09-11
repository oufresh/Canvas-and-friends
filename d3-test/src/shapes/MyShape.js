import React from 'react';

import { ShapeGroup } from './ShapeGroup';
import { Rect } from './Rect';
import { Circle } from './Circle';
import { Polyline } from './Polyline';

export const MyShape = (props) => {
    const w = props.l? props.l : 40,
        h = w;
    const r = w / 2;
    const tx = r;
    return(
        <ShapeGroup>
            <Rect width={400} height={200} color={'rgba(200,200,200,0.5)'} />
            <Polyline points={[[0,0],[400,200]]} />
            <Polyline points={[[400,0],[0,200]]} />
            <ShapeGroup tx={2*w} ty={1.5*w} id="cane" dataId={"2"}>
                <ShapeGroup tx={tx}>
                    <Circle r={r} color={'rgb(0,125,0)'} />
                </ShapeGroup>
                <Rect width={w} height={h} color={'rgb(125,0,0)'} />
                <ShapeGroup tx={tx} ty={-tx}>
                    <Polyline points={[[0,0],[20,-20]]} />
                </ShapeGroup>
            </ShapeGroup>
        </ShapeGroup>
    );
}