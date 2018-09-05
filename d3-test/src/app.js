import React from 'react';
import SvgZoom from './zoom/SvgZoom';

const drawings = '<rect width="100" height="200" x="50" y="110" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />';

class App extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            pos: {
                x: 0, y: 0
            }
        };
        this.onMouseMove = this.onMouseMove.bind(this);
    }

    onMouseMove(pos)
    {
        this.setState(ps => {
            return {
                pos: pos
            };
        });
    }

    render()
    {
        return (
            <div>
                <h3>D3 zoom test</h3>
                <SvgZoom onMouseMove={this.onMouseMove} drawings={drawings} />
                <div>
                    <span>X:</span><span>{this.state.pos.x}</span>
                    <span>Y:</span><span>{this.state.pos.y}</span>
                </div>
            </div>
        );
    }
}

export default App;