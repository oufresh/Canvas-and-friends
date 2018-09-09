import React from 'react';

export const ShapeGroup = (props) => {
    const translate=(props.tx || props.ty)?'translate('+(props.tx?props.tx:0)+','+(props.ty?props.ty:0)+')':'';
    return <g transform={translate} data-id={props.dataId}>
        {props.children}
    </g>
}
