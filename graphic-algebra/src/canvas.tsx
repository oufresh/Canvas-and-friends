import * as React from 'react';

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
        this.cContext.fillStyle = "rgb(200,0,0)";  
        this.cContext.fillRect(10, 10, 55, 50);
    }

    render()
    {
        return <canvas ref={this.cRef} width={640} height={480} />;
    }
}

export default Canvas;