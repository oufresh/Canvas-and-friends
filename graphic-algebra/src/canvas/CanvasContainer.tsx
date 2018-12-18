import * as React from 'react';
import { CanvasShapes, createInitCanvasShapes, createPointShape, ShapeTypes } from './canvasShapes';
import { ResizeController, ResizeEvent } from '../lib/ui/resize/ResizeController';
import { Canvas } from './Canvas';
import { CanvasLogger } from '../lib/ui/canvasLogger/CanvasLogger';
import { CanvasPosition } from './types';
import { Drawing, manageOnClick } from './drawings';
import * as rxjs from 'rxjs';
import { Point } from '../shapes/point';

export interface CanvasContainerProps {
    drawingType: ShapeTypes;
    className?: string;
}

interface CanvasContainerState {
    shapes: CanvasShapes;
    viewPort: Array<number>;
    mousePos: Array<number>;
    mouseClickPos: Array<number>;
    currentShape: string;
}

export class CanvasContainer extends React.Component<CanvasContainerProps, CanvasContainerState> {
    state: CanvasContainerState;
    clickSubj: rxjs.Subject<CanvasPosition>;
    // onclick: rxjs.Observable<CanvasPosition>;
    moveSubj: rxjs.Subject<CanvasPosition>;
    onMove: rxjs.Observable<CanvasPosition>;
    onDrawShapeObs: rxjs.Observable<any> | null; // any perché da capire cosa saraà con la nuova shape
    onDrawShapeSub: rxjs.Subscription | null;

    constructor(props: CanvasContainerProps) {
        super(props);
        this.clickSubj = new rxjs.Subject();
        this.moveSubj = new rxjs.Subject();
        this.onMove = this.moveSubj.asObservable();
        this.state = {
            viewPort: [0, 0],
            mousePos: [0, 0],
            mouseClickPos: [0, 0],
            currentShape: "",
            shapes: createInitCanvasShapes()
        };
        this.onDrawShapeObs = null;
        this.onDrawShapeSub = null;
    }

    componentDidMount() {
        this.onDrawShapeObs = manageOnClick(this.props.drawingType, this.clickSubj);
        this.onDrawShapeSub = this.onDrawShapeObs.subscribe(this._onDrawing);
    }

    componentDidUpdate(prevProps: CanvasContainerProps) {
        if (prevProps.drawingType !== this.props.drawingType) {
            console.log('componentDidUpdate');
        }
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
        /*const p = createPointShape(new Date().getTime().toString, pos);
        const shapes = this.state.shapes;
        shapes.points.push(p);
        this.setState({
            shapes: shapes,
            mouseClickPos: pos
        });*/
        this.clickSubj.next(pos);
    }

    _onDrawing = (ds: Drawing) => {
        // qui dovrò fare la setState delle forme che
        // sono state create
        if (ds.type === ShapeTypes.POINT) {
            const shapes = this.state.shapes;
            shapes.points.set(ds.shape.id, ds.shape as Point);
            this.setState({
                shapes,
                currentShape: ds.shape.id
            });
        }
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