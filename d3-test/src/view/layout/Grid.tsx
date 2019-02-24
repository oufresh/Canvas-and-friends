import * as React from 'react';
import './Grid.css';
import { GridElement } from './GridElement';

export interface GridProps {
    elements: Map<number, boolean>;
    onElementClick: (index: number) => any;
    render?: (enabled: boolean) => any;
};

export class Grid extends React.Component<GridProps, {}> {

    render() {
        const els: Array<React.ReactElement> = [];
        this.props.elements.forEach((v: boolean, k: number) => {
            els.push(<GridElement enabled={v} render={this.props.render} />)
        });
        return (
            <div className="grid-container">
                {els}
            </div>
        );
    }
}