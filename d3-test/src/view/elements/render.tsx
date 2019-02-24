import * as React from 'react';
import { Simple } from './Simple';
import { Complex } from './Complex'; 

export interface ElementProps {
    enabled: boolean;
    onClick: () => any;
}

const renderElement = (enabled: boolean, onClick: ()=>any, simple?: boolean): React.SFCElement<ElementProps> => {
    return simple === true ? <Simple enabled={enabled} /> : <Complex enabled={enabled} onClick={onClick} />;
}