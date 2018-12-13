import * as React from 'react';
import { CanvasShapes, createInitCanvasShapes, createPointShape, ShapeTypes } from './canvasShapes';
import { ResizeController, ResizeEvent } from '../lib/ui/resize/ResizeController';
import { Canvas } from './Canvas';
import { CanvasLogger } from '../lib/ui/canvasLogger/CanvasLogger';
import { CanvasPosition } from './types';
import * as rxjs from 'rxjs';

export interface CanvasContainerProps {
    drawingType: ShapeTypes;
    className?: string;
}

interface CanvasContainerState {
    shapes: CanvasShapes;
    viewPort: Array<number>;
    mousePos: Array<number>;
    mouseClickPos: Array<number>;
}

export class CanvasContainer extends React.Component<CanvasContainerProps, CanvasContainerState> {
    state: CanvasContainerState;
    clickSubj: rxjs.Subject<CanvasPosition>;
    onclick: rxjs.Observable<CanvasPosition>;
    moveSubj: rxjs.Subject<CanvasPosition>;
    onMove: rxjs.Observable<CanvasPosition>;

    constructor(props: CanvasContainerProps) {
        super(props);
        this.clickSubj = new rxjs.Subject();
        this.moveSubj = new rxjs.Subject();
        this.state = {
            viewPort: [0, 0],
            mousePos: [0, 0],
            mouseClickPos: [0, 0],
            shapes: createInitCanvasShapes()
        };
    }

    componentDidMount() {
        this.onMove = this.moveSubj.asObservable();
    }

    onCanvasResize = (re: ResizeEvent) => {
        this.setState({
            viewPort: [re.elemSize[0], re.elemSize[1]]
        });
    }

    _onMouseMove = (pos: Array<number>) => {
        this.setState({
            mousePos: pos
        });
    }

    _onMouseClick = (pos: Array<number>) => {
        const p = createPointShape(pos);
        const shapes = this.state.shapes;
        shapes.points.push(p);
        this.setState({
            shapes: shapes,
            mouseClickPos: pos
        });
    }

    render() {
        return (
        <ResizeController className={this.props.className} onResize={this.onCanvasResize}>
            {this.state.viewPort[0] !== 0 && this.state.viewPort[1] !== 0 ?
                <React.Fragment>
                    <Canvas
                        width={this.state.viewPort[0]}
                        height={this.state.viewPort[1]}
                        shapes={this.state.shapes}
                        onMouseClick={this._onMouseClick}
                        onMouseMove={this._onMouseMove}
                        mousePos={this.state.mousePos}
                    />
                    <CanvasLogger mouseCoords={this.state.mousePos} mouseClickPos={this.state.mouseClickPos}/>
                </React.Fragment> : <h3>Preparing ...</h3>
            }
            </ResizeController>
        );
    }
}
/*
        const line = new ExpLine(new Point(100, 100), new Point(300, 500), 10);
        // const pol = new Polyline(new Point(10,10), new Point(150,110));
        // pol.addPoint(new Point(100, 100), 1);
        // const point = new Point(200, 200);

        const pol = new Polygon();
        pol.pushVertex([350, 50]);
        pol.pushVertex([650, 100]);
        pol.pushVertex([785, 150]);
        pol.pushVertex([450, 120]);
        pol.pushVertex([350, 140]);*/