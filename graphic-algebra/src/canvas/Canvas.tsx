import * as React from 'react';
import { Fragment } from 'react';
import { CPos, getCanvasPos, getMousePos } from './canvasUtils';
import { Polyline } from '../polyline';
import { Line, ExpLine } from '../line';
import { Point, ExpPoint } from '../point';
import { circleInLine } from '../collisions/circleOnLine';

interface CanvasProps {
    width?: number;
    height?: number;
}

declare type ViewPort = {
    width: number;
    height: number;
};

declare type CanvasState = {
    translate: boolean;
    rotate: boolean;
    mousePos: CPos;
    polylines: Array<Polyline>;
    lines: Array<Line>;
    viewPort: ViewPort;
    points: Array<Point>;
};

const defaultViewPort: ViewPort = {
    width: 800,
    height: 600
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
            viewPort: {
                width: props.width ? props.width : defaultViewPort.width,
                height: props.height ? props.height : defaultViewPort.height
            },
            translate: false,
            rotate: false,
            mousePos: {
                x: 0, 
                y: 0
            },
            polylines: [],
            lines: [],
            points: []
        };

    }

    componentDidMount() {
        this.cContext = this.cRef.current ? this.cRef.current.getContext('2d') : null;
        this.canvasPos = getCanvasPos(this.cRef.current);
        if (this.cContext) {
            this.cContext.clearRect(0, 0, this.state.viewPort.width, this.state.viewPort.height);
        }
        
        const line = new ExpLine(new Point(100, 100), new Point(300, 500), 10);
        /*const pol = new Polyline(new Point(10,10), new Point(150,110));
        pol.addPoint(new Point(100, 100), 1);*/
        /// const point = new Point(200, 200);
        this.setState({
            lines: [line],
            points: []
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

    componentDidUpdate(prevProps: CanvasProps) {
        if (this.cContext) {
            this.cContext.clearRect(0, 0, this.state.viewPort.width, this.state.viewPort.height);

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
        }
    }

    onTranslate = () => {
        
        this.setState((prevState: CanvasState) => {
            const translate = !prevState.translate;
            return {
                mousePos: prevState.mousePos,
                rotate: prevState.rotate,
                translate: translate
            };
        });
    }

    onRotate = () => {
        console.log('rotate');
    }

    onMouseMove = (e: any) => {
        const pos = getMousePos(this.canvasPos, e);
        /*if (e.nativeEvent.region) {
            console.log(e.nativeEvent.region);
            alert(e.nativeEvent.region);
        }*/
        this.setState({ mousePos: pos});
    }

    onMouseclick = (e: any) => {
        console.log('click');
    }

    onAddPoint = () => {
        /*const p = this.state.polylines[0];
        p.addPoint(new Point(100, 100), 1);
        this.setState({
            polylines: [p]
        });*/
    }

    render() {
        const { mousePos } = this.state;
        return (
            <Fragment>
                <div>
                    <button onClick={this.onTranslate}>Translate</button>
                    <button>Rotate</button>
                    <span>X:</span><span>{mousePos.x}</span>
                    <span>Y:</span><span>{mousePos.y}</span>
                    <button onClick={this.onAddPoint}>Add</button>
                </div>
                <div style={{border: '1px solid grey'}}>
                    <canvas ref={this.cRef} width={this.state.viewPort.width} height={this.state.viewPort.height} onMouseMove={this.onMouseMove} onClick={this.onMouseclick}/>
                </div>
            </Fragment>
        );
    }
}

export { Canvas };