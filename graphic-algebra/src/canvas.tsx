import * as React from 'react';
import * as matrix from './matrix';
//import * as glMatrix from 'gl-matrix';
import { Fragment } from 'react';

export type CanvasProps = {
    width: number;
    height: number;
};

declare type CanvasState = {
    translate: boolean;
    rotate: boolean;
};

class Canvas extends React.Component<CanvasProps, CanvasState>
{
    cRef: any;
    cContext: CanvasRenderingContext2D;
    state: CanvasState;

    constructor(props: CanvasProps)
    {
        super(props);
        this.cRef = React.createRef();
        this.state = {
            translate: false,
            rotate: false
        }
    }

    componentDidMount()
    {
        this.cContext = this.cRef.current.getContext('2d');
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
                rotate: prevState.rotate,
                translate: translate
            };
        });
    }

    onRotate = () => {

    }

    render()
    {
        return (
            <Fragment>
                <div>
                    <button onClick={this.onTranslate}>Translate</button>
                    <button>Rotate</button>
                </div>
                <canvas ref={this.cRef} width={640} height={480} />
            </Fragment>
        );
    }
}

export default Canvas;