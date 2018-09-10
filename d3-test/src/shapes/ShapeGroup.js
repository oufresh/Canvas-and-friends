import React from 'react';

export const ShapeGroup = (props) => {
    const translate=(props.tx || props.ty)?'translate('+(props.tx?props.tx:0)+','+(props.ty?props.ty:0)+')': undefined;
    return <g id={props.id} transform={translate} data-id={props.dataId}>
        {props.children}
    </g>
}
