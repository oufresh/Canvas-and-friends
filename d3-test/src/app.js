import React from 'react';
import {initialTransform, calcCoords, SvgZoom } from './zoom/SvgZoom';

const drawings = '<rect width="100" height="200" x="50" y="110" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" /><rect width="50" height="60" x="100" y="150" style="fill:rgb(255,0,255);stroke-width:3;stroke:rgb(0,0,0)" /><polygon data-id="2" points="100,10 40,198 190,78 10,78 160,198"style="fill:lime;stroke:purple;stroke-width:5;fill-rule:evenodd;" />';

class App extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            pos: {
                x:0,
                y: 0
            },
            moveTo: {
                tx: 400,
                ty: 300,
                scale: 1,
                px: -200,
                py: -100
            },
            target: null,
            transform: initialTransform,
            viewPort: [800, 600]
        };

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onZoomed = this.onZoomed.bind(this);
        this.onDblClickZoom = this.onDblClickZoom.bind(this);
    }

    onMouseMove(pos)
    {
        this.setState(ps => {
            return {
                pos: pos,
                target: ps.target,
                transform: ps.transform,
                moveTo: ps.moveTo,
                viewPort: ps.viewPort
            };
        });
    }

    onDoubleClick(target)
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

    onZoomed(transform)
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

    onDblClickZoom(mousePos) {
        const coords =  calcCoords(this.state.transform, mousePos.x, mousePos.y);
        console.log(mousePos);
        console.log(coords);

        this.setState(ps => {
            const moveTo = {
                scale: this.state.transform.k + 0.5,
                tx: mousePos.x,
                ty: mousePos.y,
                px: -coords[0],
                py: -coords[1]
            };
            return {
                pos: ps.pos,
                target: ps.target,
                transform: ps.transform,
                moveTo: moveTo,
                viewPort: ps.viewPort
            };
        });
    }

    render()
    {
        const coords = calcCoords(this.state.transform, this.state.pos.x, this.state.pos.y);
        return (
            <div>
                <h3>D3 zoom test</h3>
                <SvgZoom 
                    viewPort={this.state.viewPort}
                    onMouseMove={this.onMouseMove}
                    drawings={drawings}
                    onDoubleClick={this.onDoubleClick}
                    onZoomed={this.onZoomed}
                    transform={this.state.transform}
                    moveTo={this.state.moveTo}
                    onDblClickZoom={this.onDblClickZoom}
                />
                <div>
                    <table>
                        <tbody>
                            <tr><td><strong>Mouse coord X</strong></td><td>{this.state.pos.x}</td></tr>
                            <tr><td><strong>Mouse coord Y</strong></td><td>{this.state.pos.y}</td></tr>
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

export default App;