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
        <ShapeGroup id="cane" dataId={"2"}>
            <ShapeGroup tx={tx}>
                <Circle r={r} color={'rgb(0,125,0)'} />
            </ShapeGroup>
            <Rect width={w} height={h} color={'rgb(125,0,0)'} />
            <ShapeGroup tx={tx} ty={-tx}>
                <Polyline points={[[0,0],[20,-20]]} />
            </ShapeGroup>
        </ShapeGroup>
    );
}