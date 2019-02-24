import * as React from 'react';
import { getMousePos } from './canvasUtils';
import { Polyline } from '../shapes/polyline';
import { Line } from '../shapes/line';
import { PCPoint } from './shapes/PPoint';
import { circleInLine } from '../collisions/circleOnLine';
import { pointInCircle } from '../collisions/pointInCircle';
import { Point } from '../shapes/point';
import { pointInPolygon } from '../collisions/pointInPolygon';
import * as Shape2Draw from './shape2Draw';
import { CanvasShapes, DrawTypes } from './canvasShapes';
import { CanvasPosition } from './types';
import { MouseHits } from './canvasCollisions';

export interface OnMouseFunc {
    (pos: CanvasPosition): any;
}

export interface CanvasProps {
    width: number;
    height: number;
    onMouseMove?: OnMouseFunc;
    onMouseClick?: OnMouseFunc;
    shapes: CanvasShapes;
    // mousePos: CanvasPosition;
    mouseHits: MouseHits;
}

declare type CanvasState = {
    translate: boolean;
    rotate: boolean;
    ready: boolean;
};

export interface CanvasContextType {
    ctx: CanvasRenderingContext2D | null;
}

export const CanvasContext: React.Context<any> =  React.createContext({ ctx: null});

export function withContext<C extends React.ComponentClass>(Component: C): C {
    return ((props: any) => (
        <CanvasContext.Consumer>
            {context => <Component {...props} context={context} />}
        </CanvasContext.Consumer>
      )) as any as C;
}

class Canvas extends React.PureComponent<CanvasProps, CanvasState> {
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

    /*shouldComponentUpdate(nextProps: CanvasProps, nextState: CanvasState, context: any): boolean {
        // if (this.props.)
        this.clear();
        return true;
    }*/

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
        if (this.cContext) {
            this.clear();

            // const ep = new ExpPoint(200, 200, 10);
            // const strokeStyle = p.hit(this.state.mousePos.x, this.state.mousePos.y) === true ? "red" : 'black';
            // console.log(strokeStyle);
            // this.cContext.strokeStyle = strokeStyle;

            this.props.shapes.lines.forEach((line: Line) => {
                if (this.cContext) {
                    const hitLines = this.props.mouseHits.hits.get(DrawTypes.LINE);
                    const hit = hitLines !== undefined ? hitLines.has(line.id) : false;
                    Shape2Draw.drawLine(this.cContext, line, hit);
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

            this.props.shapes.points.forEach((point: Point) => {
                if (this.cContext) {
                    // const hit = pointInCircle(point.x, point.y, this.props.mousePos[0], this.props.mousePos[1], 3);
                    const hitPoints = this.props.mouseHits.hits.get(DrawTypes.POINT);
                    const hit = hitPoints !== undefined ? hitPoints.has(point.id) : false;
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
        }

            /*this.props.shapes.polygons.forEach((pol: Polygon) => {
                if (this.cContext) {
                    const hit = pointInPolygon(pol.vertices, this.props.mousePos[0], this.props.mousePos[1]);
                    Shape2Draw.drawPolygon(this.cContext, pol, hit);
                }
            });*/
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
        /*const shapes = [];
        if (this.state.ready === true) {
            for (let point of this.props.shapes.points.values()) {
                const hitPoints = this.props.mouseHits.hits.get(DrawTypes.POINT);
                const hit = hitPoints !== undefined ? hitPoints.has(point.id) : false;
                shapes.push(<PCPoint key={'RPoint-' + point.id} point={point} hit={hit} />);
            }
        }*/

        return (
            <CanvasContext.Provider value={{ctx: this.cContext}}>
                <canvas className={'appCanvas'} ref={this.cRef} width={this.props.width} height={this.props.height} onMouseMove={this.onMouseMove} onClick={this.onMouseclick} />
            </CanvasContext.Provider>
        );
    }
}

export { Canvas };