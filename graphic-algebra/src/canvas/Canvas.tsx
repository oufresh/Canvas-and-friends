import * as React from 'react';
import { CPos, getCanvasPos, getMousePos } from './canvasUtils';
import { Polyline } from '../polyline';
import { Line, ExpLine } from '../line';
import { Point, ExpPoint } from '../point';
import { circleInLine } from '../collisions/circleOnLine';
import { Polygon } from '../shapes/polygon';
import { pointInPolygon } from '../collisions/pointInPolygon';
import * as Shape2Draw from './shape2Draw';

export interface OnMouseMoveFunc {
    (pos: CPos): any;
}

export interface CanvasProps {
    width: number;
    height: number;
    onMouseMove?: OnMouseMoveFunc;
}

declare type CanvasState = {
    translate: boolean;
    rotate: boolean;
    mousePos: CPos;
    polylines: Array<Polyline>;
    lines: Array<Line>;
    points: Array<Point>;
    polygons: Array<Polygon>;
    viewPort: Array<number>;
};

class Canvas extends React.Component<CanvasProps, CanvasState> {
    cRef: React.RefObject<HTMLCanvasElement>;
    cContext: CanvasRenderingContext2D | null;
    state: CanvasState;
    canvasPos: CPos;

    constructor(props: CanvasProps) {
        super(props);
        this.cRef = React.createRef();
        this.state = {
            translate: false,
            rotate: false,
            viewPort: [800, 600],
            mousePos: {
                x: 0, 
                y: 0
            },
            polylines: [],
            lines: [],
            points: [],
            polygons: []
        };

    }

    private clear() {
        this.cContext = this.cRef.current ? this.cRef.current.getContext('2d') : null;
        if (this.cContext) {
            this.cContext.clearRect(0, 0, this.state.viewPort[0], this.state.viewPort[1]);
        }
    }

    componentDidMount() {
        this.cContext = this.cRef.current ? this.cRef.current.getContext('2d') : null;
        const w = this.cRef.current ? this.cRef.current.clientWidth : 800;
        const h = this.cRef.current ? this.cRef.current.clientHeight : 600;
        this.canvasPos = getCanvasPos(this.cRef.current);
        this.clear();

        const line = new ExpLine(new Point(100, 100), new Point(300, 500), 10);
        /*const pol = new Polyline(new Point(10,10), new Point(150,110));
        pol.addPoint(new Point(100, 100), 1);*/
        // const point = new Point(200, 200);

        const pol = new Polygon();
        pol.pushVertex([350, 50]);
        pol.pushVertex([650, 100]);
        pol.pushVertex([785, 150]);
        pol.pushVertex([450, 120]);
        pol.pushVertex([350, 140]);

        this.setState({
            lines: [line],
            points: [],
            polygons: [pol],
            viewPort: [w, h]
        });
    }

    componentDidUpdate(prevProps: CanvasProps) {
        if (this.cContext) {
            this.clear();

            // const ep = new ExpPoint(200, 200, 10);
            const strokeStyle = /*p.hit(this.state.mousePos.x, this.state.mousePos.y) === true ? "red" : */'black';
            // console.log(strokeStyle);
            this.cContext.strokeStyle = strokeStyle;

            this.state.lines.forEach((line: Line) => {
                if (this.cContext) {
                    Shape2Draw.drawLine(this.cContext, line);
                }

                /*if (line instanceof ExpLine) {
                    const eLine = line as ExpLine;
                    eLine.expVertex.forEach((v: Point, i: number) => {
                        this.drawPoint(v);
                    });
                    // fill in the pixel at (10,10)  
                    // this.cContext.fillRect(eLine.expVertex[1].x, eLine.expVertex[1].y, 1, 1); // fill in the pixel at (10,10)  
                }*/
            });

            this.state.points.forEach((point: Point) => {
                if (this.cContext) {
                    Shape2Draw.drawPoint(this.cContext, point);
                    const line = this.state.lines[0];
                    const collision = circleInLine(line.vertex[0].x, line.vertex[0].y, line.vertex[1].x, line.vertex[1].y, point.x, point.y, 10);
                    // console.log(collision);
                    Shape2Draw.drawCircle(this.cContext, point, 10, collision.hit);
                    if (collision.onSegment === true) {
                        Shape2Draw.drawPoint(this.cContext, new Point(collision.x, collision.y));
                    }
                }
            });

            this.state.polygons.forEach((pol: Polygon) => {
                if (this.cContext) {
                    const hit = pointInPolygon(pol.vertices, this.state.mousePos.x, this.state.mousePos.y);
                    Shape2Draw.drawPolygon(this.cContext, pol, hit);
                }
            });
        }
    }
    onMouseMove = (e: any) => {
        const pos = getMousePos(this.canvasPos, e);
        this.setState({ mousePos: pos });
        if (this.props.onMouseMove) {
            this.props.onMouseMove(pos);
        }
    }

    onMouseclick = (e: any) => {
        const pos = getMousePos(this.canvasPos, e);
        this.setState({
            points: [new Point(pos.x, pos.y)]
        });
    }

    render() {
        return (
            <canvas style={{flexGrow: 1}} ref={this.cRef} width={this.state.viewPort[0]} height={this.state.viewPort[1]} onMouseMove={this.onMouseMove} onClick={this.onMouseclick}/>
        );
    }
}

export { Canvas };