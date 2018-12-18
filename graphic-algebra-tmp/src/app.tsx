import * as React from 'react';
import './app.css';
import { CanvasContainer } from './canvas/CanvasContainer';
import { ShapeTypes } from './canvas/canvasShapes';
import { Navbar } from './lib/ui/navbar/Navbar';

interface AppState {
    drawingType: ShapeTypes;
}

export interface NavButtonsProps {
    drawingType: ShapeTypes;
    onClick?: (drawingType: ShapeTypes) => any;
}

class NavButtons extends React.Component<NavButtonsProps> {

    onClick = (e: React.SyntheticEvent<HTMLButtonElement>) => {
        const t = e.target as HTMLButtonElement;
        if (this.props.onClick && t.dataset.shape) {
            this.props.onClick(ShapeTypes[t.dataset.shape]);
        }
    }

    render() {
        const { drawingType } = this.props;
        return (
            <React.Fragment>
                <button data-shape={ShapeTypes.POINT} onClick={this.onClick} className={drawingType === ShapeTypes.POINT ? 'selected' : ''}>Pt</button>
                <button data-shape={ShapeTypes.LINE} onClick={this.onClick} className={drawingType === ShapeTypes.LINE ? 'selected' : ''}>Lyn</button>
                <button data-shape={ShapeTypes.POLYLINE} onClick={this.onClick} className={drawingType === ShapeTypes.POLYLINE ? 'selected' : ''}>PLyn</button>
                <button data-shape={ShapeTypes.POLYGON} onClick={this.onClick} className={drawingType === ShapeTypes.POLYGON ? 'selected' : ''}>Pol</button>
                <button data-shape={ShapeTypes.MOVEMENT} onClick={this.onClick} className={drawingType === ShapeTypes.MOVEMENT ? 'selected' : ''}>Mov</button>
            </React.Fragment>
        );
    }
}

class App extends React.Component<any, AppState> {
    state: AppState;

    constructor(props: any) {
        super(props);
        this.state = {
            drawingType: ShapeTypes.POINT
        };
    }

    onChangeShape = (drawingType: ShapeTypes) => {
        this.setState({
            drawingType
        });
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
                <div className={'appHeader'}>
                    <label>Canvas testing app</label>
                </div>
                <div className={'appMain'}>
                    <Navbar collapsible={true}>
                        <NavButtons drawingType={this.state.drawingType} onClick={this.onChangeShape} />
                    </Navbar>
                    <CanvasContainer className={'appCanvas'} drawingType={this.state.drawingType}/>
                </div>
            </div>
        );
    }
}

export { App };
