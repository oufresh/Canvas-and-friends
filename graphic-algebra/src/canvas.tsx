import * as React from 'react';
import * as matrix from './matrix';
//import * as glMatrix from 'gl-matrix';
import { Fragment } from 'react';
import { CPos, getCanvasPos, getMousePos } from './canvasUtils';

export type CanvasProps = {
    width: number;
    height: number;
};

declare type CanvasState = {
    translate: boolean;
    rotate: boolean;
    mousePos: CPos;
};

class Canvas extends React.Component<CanvasProps, CanvasState>
{
    cRef: any;
    cContext: CanvasRenderingContext2D;
    state: CanvasState;
    canvasPos: CPos;

    constructor(props: CanvasProps)
    {
        super(props);
        this.cRef = React.createRef();
        this.state = {
            translate: false,
            rotate: false,
            mousePos: {
                x: 0, 
                y: 0
            }
        }
    }

    componentDidMount()
    {
        this.cContext = this.cRef.current.getContext('2d');
        this.canvasPos = getCanvasPos(this.cRef.current);
    }

    componentDidUpdate(prevProps: CanvasProps)
    {
        matrix.TestTranslate((av) => {
            this.cContext.clearRect(0, 0, 640, 480);
            this.cContext.fillStyle = "rgb(200,0,0)";  
            this.cContext.beginPath();
            this.cContext.moveTo(av[0][0], av[0][1]);
            this.cContext.lineTo(av[1][0], av[1][1]);
            this.cContext.lineTo(av[2][0], av[2][1]);
            this.cContext.fill();
        })
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

    }

    onMouseMove = (e: any) => {
        const pos = getMousePos(this.canvasPos, e);
        console.log(pos);
        this.setState((ps: CanvasState) => {
            return {
                mousePos: pos,
                rotate: ps.rotate,
                translate: ps.translate
            };
        })
    }

    render()
    {
        const { mousePos } = this.state;
        return (
            <Fragment>
                <div>
                    <button onClick={this.onTranslate}>Translate</button>
                    <button>Rotate</button>
                    <span>X:</span><span>{mousePos.x}</span>
                    <span>Y:</span><span>{mousePos.y}</span>
                </div>
                <div style={{border: '1px solid grey'}}>
                    <canvas ref={this.cRef} width={640} height={480} onMouseMove={this.onMouseMove}/>
                </div>
            </Fragment>
        );
    }
}

export default Canvas;