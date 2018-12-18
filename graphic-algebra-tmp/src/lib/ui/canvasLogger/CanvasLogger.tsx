import * as React from 'react';
import './CanvasLogger.css';

export interface CanvasLoggerProps {
    mouseCoords?: Array<number>;
    mouseClickPos?: Array<number>;
}

export class CanvasLogger extends React.Component<CanvasLoggerProps, {}> {
    constructor(props: CanvasLoggerProps) {
        super(props);
    }

    render() {
        return (
        <div className={'canvasLogger'}>
            {this.props.mouseCoords ? <div><label>Mouse coords: x {this.props.mouseCoords[0]}, y {this.props.mouseCoords[1]}</label></div> : null}
            {this.props.mouseClickPos ? <div><label>Mouse click: x {this.props.mouseClickPos[0]}, y {this.props.mouseClickPos[1]}</label></div> : null}
        </div>);
    }
}