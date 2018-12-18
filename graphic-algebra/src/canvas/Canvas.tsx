import * as React from 'react';
import { getMousePos } from './canvasUtils';
import { Polyline } from '../shapes/polyline';
import { Line } from '../shapes/line';
import { Point, ExpPoint } from '../shapes/point';
import { circleInLine } from '../collisions/circleOnLine';
import { pointInCircle } from '../collisions/pointInCircle';
import { Polygon } from '../shapes/polygon';
import { pointInPolygon } from '../collisions/pointInPolygon';
import * as Shape2Draw from './shape2Draw';
import { CanvasShapes } from './canvasShapes';
import { CanvasPosition } from './types';

export interface OnMouseFunc {
    (pos: CanvasPosition): any;
}

export interface CanvasProps {
    width: number;
    height: number;
    onMouseMove?: OnMouseFunc;
    onMouseClick?: OnMouseFunc;
    shapes: CanvasShapes;
    mousePos: CanvasPosition;
}

declare type CanvasState = {
    translate: boolean;
    rotate: boolean;
    ready: boolean;
};

const CanvasContext: any =  React.createContext({ ctx: null});

interface PointProps {
    point?: Point;
    hit: boolean;
}

class RPoint extends React.Component<PointProps> {
    componentDidUpdate() {
        const ctx = this.context.ctx;
        if (this.props.point) {
            Shape2Draw.drawPoint(ctx, this.props.point, this.props.hit);
        }
    }
    render() {
        return (
            null
        );
    }
}
RPoint.contextType = CanvasContext;

class Canvas extends React.Component<CanvasProps, CanvasState> {
    cRef: React.RefObject<HTMLCanvasElement>;
    cContext: CanvasRenderingContext2D | null;
    state: CanvasState;

    constructor(props: CanvasProps) {
        super(props);
        this.cRef = React.createRef();
        this.state = {
            translate: false,
            rotate: false,
            ready: false
        };
        this.cContext = null;
    }

    private clear() {
        if (this.cContext) {
            this.cContext.clearRect(0, 0, this.props.width, this.props.height);
        }
    }

    shouldComponentUpdate(nextProps: CanvasProps, nextState: CanvasState, context: any): boolean {
        // if (this.props.)
        this.clear();
        return true;
    }

    componentDidMount() {
        this.cContext = this.cRef.current ? this.cRef.current.getContext('2d') : null;
        // CanvasContext = React.createContext({
        //    ctx: this.cContext
        // });
        this.clear();
        this.setState({
            ready: true
        });
    }

    componentDidUpdate(prevProps: CanvasProps) {
        /*if (this.cContext) {
            this.clear();

            // const ep = new ExpPoint(200, 200, 10);
            // const strokeStyle = p.hit(this.state.mousePos.x, this.state.mousePos.y) === true ? "red" : 'black';
            // console.log(strokeStyle);
            this.cContext.strokeStyle = strokeStyle;

            this.props.shapes.lines.forEach((line: Line) => {
                if (this.cContext) {
                    Shape2Draw.drawLine(this.cContext, line);
                }

                if (line instanceof ExpLine) {
                    const eLine = line as ExpLine;
                    eLine.expVertex.forEach((v: Point, i: number) => {
                        this.drawPoint(v);
                    });
                    // fill in the pixel at (10,10)  
                    // this.cContext.fillRect(eLine.expVertex[1].x, eLine.expVertex[1].y, 1, 1); // fill in the pixel at (10,10)  
                }
            // });

            this.props.shapes.points.forEach((point: Point) => {
                if (this.cContext) {
                    const hit = pointInCircle(point.x, point.y, this.props.mousePos[0], this.props.mousePos[1], 3);
                    Shape2Draw.drawPoint(this.cContext, point, hit);
                    // const line = this.props.shapes.lines[0];
                    // const collision = circleInLine(line.vertex[0].x, line.vertex[0].y, line.vertex[1].x, line.vertex[1].y, point.x, point.y, 10);
                    // console.log(collision);
                    // Shape2Draw.drawCircle(this.cContext, point, 10, collision.hit);
                    // if (collision.onSegment === true) {
                    //     Shape2Draw.drawPoint(this.cContext, new Point(collision.x, collision.y));
                    // }
                }
            });

            this.props.shapes.polygons.forEach((pol: Polygon) => {
                if (this.cContext) {
                    const hit = pointInPolygon(pol.vertices, this.props.mousePos[0], this.props.mousePos[1]);
                    Shape2Draw.drawPolygon(this.cContext, pol, hit);
                }
            });
        }*/
    }
    onMouseMove = (e: any) => {
        const pos = getMousePos(this.cRef.current, e);
        if (this.props.onMouseMove) {
            this.props.onMouseMove(pos);
        }
    }

    /**
     * Per ora fa solo click ma poi devo
     * capire se ho una collisione e come comportarmi
     */
    onMouseclick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const pos = getMousePos(this.cRef.current, e);
        if (this.props.onMouseClick) {
            this.props.onMouseClick(pos);
        }
    }

    render() {
        const shapes = [];
        for (let point of this.props.shapes.points.values()) {
            const hit = pointInCircle(point.x, point.y, this.props.mousePos[0], this.props.mousePos[1], 3);
            shapes.push(<RPoint key={'RPoint-' + point.id} point={point} hit={hit} />)
        }

        return (
            <CanvasContext.Provider value={{ctx: this.cContext}}>
                <canvas ref={this.cRef} width={this.props.width} height={this.props.height} onMouseMove={this.onMouseMove} onClick={this.onMouseclick}>{shapes}</canvas>
            </CanvasContext.Provider>
        );
    }
}

export { Canvas };