import * as React from 'react';
import './app.css';
import { Canvas } from './canvas/Canvas';
import { CPos } from './canvas/canvasUtils';
import { Navbar } from './lib/ui/navbar/Navbar';

interface AppState {
    w: number;
    h: number;
    mousePos: CPos;
}

class App extends React.Component<any, AppState> {
    state: AppState;
    dimRef: React.RefObject<HTMLDivElement>;

    constructor(props: any) {
        super(props);
        this.state = {
            w: 800,
            h: 500,
            mousePos: {
                x: 0,
                y: 0
            }
        };
        this.dimRef = React.createRef();
    }

    componentDidMount() {
        if (this.dimRef.current) {
            const w = this.dimRef.current.clientWidth;
            const h = this.dimRef.current.clientHeight;
            this.setState({w, h});
        }
    }

    onMouseMove = (pos: CPos) => {
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
        return (
            <div className={'appContainer'}>
                <div>
                    <span>X:</span><span>{this.state.mousePos.x}</span>
                    <span>Y:</span><span>{this.state.mousePos.y}</span>
                    <button onClick={this.onAddPoint}>Add</button>
                </div>
                <div ref={this.dimRef} className={'appMain'}>
                    <Navbar collapsible={true}>
                        <button>Pol</button>
                        <button>Lyn</button>
                    </Navbar>
                    <Canvas width={this.state.w} height={this.state.h} onMouseMove={this.onMouseMove} />
                </div>
            </div>
        );
    }
}

export { App };
