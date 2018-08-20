import * as React from 'react';
import * as matrix from './matrix';
import * as glMatrix from 'gl-matrix';

export type CanvasProps = {
    width: number;
    height: number;
};

class Canvas extends React.Component
{
    cRef: any;
    cContext: CanvasRenderingContext2D ;

    constructor(props: any)
    {
        super(props);
        this.cRef = React.createRef();
    }

    componentDidMount()
    {
        this.cContext = this.cRef.current.getContext('2d');

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

    render()
    {
        return <canvas ref={this.cRef} width={640} height={480} />;
    }
}

export default Canvas;