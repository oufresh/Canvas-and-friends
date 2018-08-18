import * as React from 'react';
import * as matrix from './matrix';

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

        matrix.Test((vec: Array<number>)=>{
            this.cContext.clearRect(0, 0, 640, 480);
            this.cContext.fillStyle = "rgb(200,0,0)";  
            this.cContext.beginPath();
            this.cContext.moveTo(vec[0], vec[1]);
            this.cContext.lineTo(100, 75);
            this.cContext.lineTo(100, 25);
            this.cContext.fill();
            //
            //this.cContext.fillRect(vec[0], vec[1], 55, 50);
        });
    }

    render()
    {
        return <canvas ref={this.cRef} width={640} height={480} />;
    }
}

export default Canvas;