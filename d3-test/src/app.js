import React from 'react';
import SvgZoom from './zoom/SvgZoom';

const drawings = '<rect width="100" height="200" x="50" y="110" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" /><rect width="50" height="60" x="100" y="150" style="fill:rgb(255,0,255);stroke-width:3;stroke:rgb(0,0,0)" />';

class App extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            pos: {
                x: 0, y: 0
            },
            target: null
        };

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
    }

    onMouseMove(pos)
    {
        this.setState(ps => {
            return {
                pos: pos,
                target: ps.target
            };
        });
    }

    onDoubleClick(target)
    {
        this.setState(ps => {
            return {
                pos: ps.pos,
                target: target
            };
        });
    }

    render()
    {
        return (
            <div>
                <h3>D3 zoom test</h3>
                <SvgZoom onMouseMove={this.onMouseMove} drawings={drawings} onDoubleClick={this.onDoubleClick}/>
                <div>
                    <table>
                        <tbody>
                            <tr><td><strong>Mouse coord X</strong></td><td>{this.state.pos.x}</td></tr>
                            <tr><td><strong>Mouse coord Y</strong></td><td>{this.state.pos.y}</td></tr>
                            <tr><td><strong>Double click target</strong></td><td>{this.state.target ? (this.state.target.nodeName + ", " + this.state.target.getAttribute("style")) : ""}</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default App;