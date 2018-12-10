import * as React from 'react';
import { CPos, getCanvasPos, getMousePos } from './canvasUtils';
import { Polyline } from '../polyline';
import { Line, ExpLine } from '../line';
import { Point, ExpPoint } from '../point';
import { circleInLine } from '../collisions/circleOnLine';
import { Polygon } from '../shapes/polygon';
import { pointInPolygon } from '../collisions/pointInPolygon';

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

    componentDidMount() {
        this.cContext = this.cRef.current ? this.cRef.current.getContext('2d') : null;
        this.canvasPos = getCanvasPos(this.cRef.current);
        if (this.cContext) {
            this.cContext.clearRect(0, 0, this.props.width, this.props.height);
        }
        
        const line = new ExpLine(new Point(100, 100), new Point(300, 500), 10);
        /*const pol = new Polyline(new Point(10,10), new Point(150,110));
        pol.addPoint(new Point(100, 100), 1);*/
        const point = new Point(200, 200);

        const pol = new Polygon();
        pol.pushVertex([50, 50]);
        pol.pushVertex([150, 100]);
        pol.pushVertex([185, 150]);
        pol.pushVertex([90, 140]);
        pol.pushVertex([50, 140]);

        this.setState({
            lines: [line],
            points: [point],
            polygons: [pol]
        });
    }

    drawPoint(p: Point) {
        if (this.cContext) {
            const oldStyle = this.cContext.strokeStyle;
            this.cContext.strokeStyle = 'red';
            this.cContext.beginPath();
            this.cContext.moveTo(p.x - 3, p.y);
            this.cContext.lineTo(p.x + 3, p.y);
            this.cContext.moveTo(p.x, p.y - 3);
            this.cContext.lineTo(p.x, p.y + 3);
            this.cContext.stroke();
            this.cContext.strokeStyle = oldStyle;
        }
    }

    drawCircle(c: Point, r: number) {
        if (this.cContext) {
            const oldStyle = this.cContext.strokeStyle;
            this.cContext.strokeStyle = 'blue';
            this.cContext.arc(c.x, c.y, r, 0, 2 * Math.PI, false);
            this.cContext.stroke();
            this.cContext.strokeStyle = oldStyle;
        }
    }
    
    drawPolygon = (ctx: CanvasRenderingContext2D, pol: Polygon, hit ?: boolean): void => {
        // fare unca calc style partendo dallo stato del polygon se ha over o
        // altri effetti
        const oldStrokeStyle = ctx.strokeStyle;
        const oldFillStyle = ctx.fillStyle;
        ctx.fillStyle = hit ? 'rgba(200,0,200,1)' : 'rgba(200,0,200,0.3)';
        ctx.strokeStyle = 'rgba(100,0,100,1)';
        ctx.beginPath();
        pol.vertices.forEach((p: Array<number>, index: number) => {
            if (index === 0) {
                ctx.moveTo(p[0], p[1]);
            } else if (index === pol.vertices.length - 1) {
                ctx.lineTo(p[0], p[1]);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            } else {
                ctx.lineTo(p[0], p[1]);
            }
        });
        ctx.fillStyle = oldFillStyle;
        ctx.strokeStyle = oldStrokeStyle;
    }

    componentDidUpdate(prevProps: CanvasProps) {
        if (this.cContext) {
            this.cContext.clearRect(0, 0, this.props.width, this.props.height);

            // const ep = new ExpPoint(200, 200, 10);
            const strokeStyle = /*p.hit(this.state.mousePos.x, this.state.mousePos.y) === true ? "red" : */'black';
            // console.log(strokeStyle);
            this.cContext.strokeStyle = strokeStyle;

            this.state.lines.forEach((line: Line) => {
                if (this.cContext) {
                    this.cContext.beginPath();
                    this.cContext.moveTo(line.vertex[0].x, line.vertex[0].y);
                    this.cContext.lineTo(line.vertex[1].x, line.vertex[1].y);
                    this.cContext.stroke();
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
                this.drawPoint(point);
                const line = this.state.lines[0];
                const collision = circleInLine(line.vertex[0].x, line.vertex[0].y, line.vertex[1].x, line.vertex[1].y, point.x, point.y, 10);
                console.log(collision);
                this.drawPoint(new Point(collision.x, collision.y));
                this.drawCircle(point, 10);
            });

            this.state.polygons.forEach((pol: Polygon) => {
                if (this.cContext) {
                    const hit = pointInPolygon(pol.vertices, this.state.mousePos.x, this.state.mousePos.y);
                    this.drawPolygon(this.cContext, pol, hit);
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
        console.log('click');
    }

    render() {
        return (
            <canvas ref={this.cRef} width={this.props.width} height={this.props.height} onMouseMove={this.onMouseMove} onClick={this.onMouseclick}/>
        );
    }
}

export { Canvas };