import * as React from 'react';
import { CanvasShapes, createInitCanvasShapes, ShapeTypes } from './canvasShapes';
import { ResizeController, ResizeEvent } from '../lib/ui/resize/ResizeController';
import { Canvas } from './Canvas';
import { CanvasLogger } from '../lib/ui/canvasLogger/CanvasLogger';
import { CanvasPosition } from './types';
import { Drawing, deleteShapeProcessor } from './drawings';
import * as rxjs from 'rxjs';
import * as operators from 'rxjs/operators';
import { Point } from '../shapes/point';
import { MouseHits, collisionProcessor } from './canvasCollisions';
import { Line } from '../shapes/line';

export interface CanvasContainerProps {
    drawingType: ShapeTypes;
    className?: string;
    hoverActive?: boolean;
    delete: boolean;
}

// mouse hit ora è un unico campo poi diventerà lo style che cambia

interface CanvasContainerState {
    shapes: CanvasShapes;
    viewPort: Array<number>;
    mousePos: Array<number>;
    mouseClickPos: Array<number>;
    currentShape: string;
    mouseHits: MouseHits;
    drawingShape: boolean;
}

const mouseHoverFilter = (hoverActive?: boolean) => (hoverActive !== undefined && hoverActive === true);

export class CanvasContainer extends React.Component<CanvasContainerProps, CanvasContainerState> {
    state: CanvasContainerState;
    clickSubj: rxjs.Subject<CanvasPosition>;
    // onclick: rxjs.Observable<CanvasPosition>;
    moveSubj: rxjs.Subject<CanvasPosition>;
    onMove: rxjs.Observable<CanvasPosition> | null;
    onMoveSub: rxjs.Subscription | null;
    onDrawShapeObs: rxjs.Observable<Drawing> | null; // any perché da capire cosa saraà con la nuova shape
    onDrawShapeSub: rxjs.Subscription | null;
    onDeleteShapeObs: rxjs.Observable<MouseHits> | null;
    onDeleteShapeSub: rxjs.Subscription | null;
    onMouseHitObs: rxjs.Observable<MouseHits> | null;
    onMouseHitSub: rxjs.Subscription | null;

    constructor(props: CanvasContainerProps) {
        super(props);
        this.clickSubj = new rxjs.Subject();
        this.moveSubj = new rxjs.Subject();
        this.state = {
            viewPort: [0, 0],
            mousePos: [0, 0],
            mouseClickPos: [0, 0],
            currentShape: '',
            shapes: createInitCanvasShapes(),
            mouseHits: {
                hits: new Map()
            },
            drawingShape: false
        };
        this.onMove = null;
        this.onMoveSub = null;

        this.onDrawShapeObs = null;
        this.onDrawShapeSub = null;

        this.onDeleteShapeObs = null;
        this.onDeleteShapeSub = null;

        this.onMouseHitObs = null;
        this.onMouseHitSub = null;

        this._onDeleting = this._onDeleting.bind(this);
    }

    componentDidMount() {
        this.onMove = this.moveSubj.asObservable().pipe(operators.filter(() => mouseHoverFilter(this.props.hoverActive)));
        this.onMoveSub = this.onMove.subscribe((pos: CanvasPosition) => {
            this.setState({
                mousePos: pos
            });
        });

        this.onMouseHitObs = this.moveSubj.pipe(operators.filter((pos: CanvasPosition) => {
            return (this.props.hoverActive !== undefined && this.props.hoverActive === true);
        }), operators.map((pos: CanvasPosition) => {
            return collisionProcessor(pos, this.state.shapes);
        }));
        this.onMouseHitSub = this.onMouseHitObs.subscribe((mouseHits: MouseHits) => {
            this.setState({ mouseHits });
        });

        this._setDrawingInteraction();
    }

    createDrawingEventProcessor(clickSubj: rxjs.Subject<CanvasPosition>, moveSubj: rxjs.Subject<CanvasPosition>): rxjs.Observable<Drawing> | null {
        /*if (drawingType === ShapeTypes.POINT) {
            return drawPointProcessor(clickSubj);
        } else if 
        return null;*/
        return clickSubj.pipe(operators.switchMap((pos: CanvasPosition) => {
            if (this.state.drawingShape === false) {
                return moveSubj.pipe(operators.map((mPos: CanvasPosition) => {
                    const p1: Point = new Point('L1', pos[0], pos[1]);
                    const p2: Point = new Point('L2', mPos[0], mPos[1]);
                    return {
                        type: ShapeTypes.LINE,
                        shape: new Line('L', p1, p2),
                        end: false
                    };
                }));
            } else {
                const p1e: Point = this.state.shapes.lines.get('L').vertex[0];
                const p2e: Point = new Point('L2', pos[0], pos[1]);
                return {
                    type: ShapeTypes.LINE,
                    shape: new Line('L', p1e, p2e),
                    end: false
                };
            }
        }));
    }

    _setDrawingInteraction() {
        if (this.props.delete === true) {
            if (this.onDeleteShapeObs === null) {
                this.onDeleteShapeObs = deleteShapeProcessor(this.clickSubj, this.moveSubj, this.onMouseHitObs);
            }
            if (this.onDeleteShapeObs) {
                this.onDeleteShapeSub = this.onDeleteShapeObs.subscribe(this._onDeleting);
            }
            if (this.onDrawShapeSub) {
                this.onDrawShapeSub.unsubscribe();
            }
        } else {
            if (this.onDrawShapeObs === null) {
                this.onDrawShapeObs = this.createDrawingEventProcessor(this.clickSubj, this.moveSubj);
            }
            if (this.onDrawShapeObs) {
                this.onDrawShapeSub = this.onDrawShapeObs.subscribe(this._onDrawing);
            }
            if (this.onDeleteShapeSub) {
                this.onDeleteShapeSub.unsubscribe();
            }
        }
    }

    componentWillUnmount() {
        // togliere tutte le subscribe
    }

    componentDidUpdate(prevProps: CanvasContainerProps) {
        if (prevProps.delete !== this.props.delete) {
            this._setDrawingInteraction();
        }
        /*if (prevProps.drawingType !== this.props.drawingType) {
            console.log('componentDidUpdate');
        }*/
    }

    onCanvasResize = (re: ResizeEvent) => {
        this.setState({
            viewPort: [re.elemSize[0], re.elemSize[1]]
        });
    }

    _onMouseMove = (pos: Array<number>) => {
        this.moveSubj.next(pos);
    }

    _onMouseClick = (pos: Array<number>) => {
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
        } else if (ds.type === ShapeTypes.LINE) {
            const shapes = this.state.shapes;
            shapes.lines.set(ds.shape.id, ds.shape as Line);
            this.setState({
                shapes,
                currentShape: ds.shape.id,
                drawingShape: !ds.end
            });
        } else {
            console.log('No shape');
        }
    }

    _onDeleting(mouseHits: MouseHits) {
        // console.log('Delete detected');
        // console.log(mouseHits);
        const points: Set<string> | undefined = mouseHits.hits.get(ShapeTypes.POINT);
        if (points && points.size) {
            const shapes = this.state.shapes;
            let currentShape = this.state.currentShape;
            points.forEach((pId: string) => {
                shapes.points.delete(pId);
                if (currentShape === pId) {
                    currentShape = '';
                }
            });
            this.setState({
                shapes,
                currentShape
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
                        mouseHits={this.state.mouseHits}
                    />
                    <CanvasLogger mouseCoords={this.state.mousePos} mouseClickPos={this.state.mouseClickPos} delete={this.props.delete} />
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