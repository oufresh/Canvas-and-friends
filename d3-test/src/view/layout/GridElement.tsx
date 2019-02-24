import * as React from 'react';
import './GridElement.css';

export interface GridElementProps {
    enabled: boolean;
    render?: (enabled: boolean) => React.SFCElement<any>;
}

export const GridElement: React.SFC<GridElementProps> = (props: GridElementProps) => {
    return <div className={"grid-element " + (props.enabled === true ? "enabled" : "")}>
        {props.render ? props.render(props.enabled) : null}
    </div>;
};