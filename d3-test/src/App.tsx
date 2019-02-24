import * as React from 'react';
import { Grid } from './view/layout/Grid';
//const drawings = '<rect width="100" height="200" x="50" y="110" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" /><rect width="50" height="60" x="100" y="150" style="fill:rgb(255,0,255);stroke-width:3;stroke:rgb(0,0,0)" /><polygon data-id="2" points="100,10 40,198 190,78 10,78 160,198"style="fill:lime;stroke:purple;stroke-width:5;fill-rule:evenodd;" />';

declare type MoveToType = {
    tx: number,
    ty: number,
    scale: number,
    px: number,
    py: number  
};

export type TransformType = {
    tx: number,
    ty: number,
    k: number
};

declare type AppState = {
    pos: Array<number>,
    moveTo: MoveToType,
    target: any,
    viewPort: Array<number>,
    transform: TransformType,
    elements: Map<number, boolean>;
};

interface ProvaProps {
    enabled: boolean;
}

const ProvaStyle = {
    width: "100%",
    height: "100%",
    color: "black",
    padding: "10px"
}

const Prova: React.SFC<ProvaProps> = (props: ProvaProps) => {
    return <div style={ProvaStyle}>{props.enabled ? "ENABLED" : "DISABLED"}</div>
}

export class App extends React.Component<{}, AppState>
{
    state: AppState;

    constructor(props: {})
    {
        super(props);

        this.state = {
            pos: [0, 0],
            moveTo: {
                tx: 400,
                ty: 300,
                scale: 1,
                px: -200,
                py: -100
            },
            target: null,
            transform: {
                tx: 0,
                ty: 0,
                k: 1
            },
            viewPort: [800, 600],
            elements: new Map([
                [0, true],
                [1, false],
                [2, false]
            ])
        };

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onDblClickZoom = this.onDblClickZoom.bind(this);
        this.onZoomed = this.onZoomed.bind(this);
    }

    onMouseMove(pos: Array<number>)
    {
        this.setState((ps: AppState) => {
            return {
                pos: pos,
                target: ps.target,
                //transform: ps.transform,
                moveTo: ps.moveTo,
                viewPort: ps.viewPort
            };
        });
    }

    onDoubleClick(target: any)
    {
        //console.log(target.dataset.id);
        this.setState(ps => {
            return {
                pos: ps.pos,
                target: target,
                transform: ps.transform,
                moveTo: ps.moveTo,
                viewPort: ps.viewPort
            };
        });
    }

    onZoomed(transform: TransformType)
    {
        this.setState(ps => {
            return {
                pos: ps.pos,
                target: ps.target,
                transform: transform,
                moveTo: ps.moveTo,
                viewPort: ps.viewPort
            };
        });
    }

    onDblClickZoom(mousePos: Array<number>) {
        const coords = [0,0];// calcCoords(this.state.transform, mousePos.x, mousePos.y);
        console.log(mousePos);
        console.log(coords);

        this.setState(ps => {
            const moveTo = {
                scale: this.state.transform.k + 0.5,
                tx: mousePos[0],
                ty: mousePos[1],
                px: -coords[0],
                py: -coords[1]
            };
            return {
                pos: ps.pos,
                target: ps.target,
                //transform: ps.transform,
                moveTo: moveTo,
                viewPort: ps.viewPort
            };
        });
    }

    render()
    {
        const coords = [0,0]; //calcCoords(this.state.transform, this.state.pos.x, this.state.pos.y);
        return (
            <div>
                <h3>D3 zoom test</h3>
                <div>
                    <Grid elements={this.state.elements} onElementClick={()=>{}} render={renderProva} />
                </div>
                <div>
                    <table>
                        <tbody>
                            <tr><td><strong>Mouse coord X</strong></td><td>{this.state.pos[0]}</td></tr>
                            <tr><td><strong>Mouse coord Y</strong></td><td>{this.state.pos[1]}</td></tr>
                            <tr><td><strong>Mouse coord model X</strong></td><td>{coords[0]}</td></tr>
                            <tr><td><strong>Mouse coord model Y</strong></td><td>{coords[1]}</td></tr>
                            <tr><td><strong>Double click target</strong></td><td>{this.state.target ? (this.state.target.nodeName + ", " + this.state.target.getAttribute("style")) : ""}</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
