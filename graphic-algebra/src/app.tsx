import * as React from 'react';
import * as rxjs from 'rxjs';
import * as operators from 'rxjs/operators';
import './App.css';
import { CanvasContainer } from './canvas/CanvasContainer';
import { DrawTypes } from './canvas/canvasShapes';
import { Navbar } from './lib/ui/navbar/Navbar';

interface AppState {
    drawingType: DrawTypes;
    delete: boolean;
}

export interface NavButtonsProps {
    drawingType: DrawTypes;
    onClick?: (drawingType: DrawTypes) => any;
}

class NavButtons extends React.Component<NavButtonsProps> {

    onClick = (e: React.SyntheticEvent<HTMLButtonElement>) => {
        const t = e.target as HTMLButtonElement;
        if (this.props.onClick && t.dataset.shape) {
            const s = t.dataset.shape as keyof typeof DrawTypes;
            this.props.onClick(DrawTypes[s]);
        }
    }

    render() {
        const { drawingType } = this.props;
        return (
            <React.Fragment>
                <button data-shape={DrawTypes.POINT} onClick={this.onClick} className={drawingType === DrawTypes.POINT ? 'selected' : ''}>Pt</button>
                <button data-shape={DrawTypes.LINE} onClick={this.onClick} className={drawingType === DrawTypes.LINE ? 'selected' : ''}>Lyn</button>
                <button data-shape={DrawTypes.POLYLINE} onClick={this.onClick} className={drawingType === DrawTypes.POLYLINE ? 'selected' : ''}>PLyn</button>
                <button data-shape={DrawTypes.POLYGON} onClick={this.onClick} className={drawingType === DrawTypes.POLYGON ? 'selected' : ''}>Pol</button>
                <button data-shape={DrawTypes.MOVEMENT} onClick={this.onClick} className={drawingType === DrawTypes.MOVEMENT ? 'selected' : ''}>Mov</button>
            </React.Fragment>
        );
    }
}

interface AppHeaderProps {
    hoverActive: boolean;
    onClickHover: () => void;
}

const AppHeader = (props: AppHeaderProps) => {
    return (
        <div className={'appHeader'}>
            <label>Canvas testing app</label>
            <div><button onClick={props.onClickHover}>Hover</button></div>
        </div>
    );
};

class App extends React.Component<any, AppState> {
    state: AppState;
    onDeleteActive: rxjs.Observable<boolean> | null;

    constructor(props: any) {
        super(props);
        this.state = {
            drawingType: DrawTypes.POINT,
            delete: false
        };

        this.onDeleteActive = null;

        this._initDeleteEvent = this._initDeleteEvent.bind(this);
    }

    componentDidMount() {
        this._initDeleteEvent();
    }

    _initDeleteEvent() {
        const that = this;
        this.onDeleteActive = rxjs.merge(
            rxjs.fromEvent(document, 'keydown').pipe(operators.filter((e: Event) => {
                    const ke = e as KeyboardEvent;
                    if (ke) {
                        return (ke.keyCode === 16 && ke.type === 'keydown' && ke.location === 1 && that.state.delete === false);
                    } else {
                        return false;
                    }
                }),
                operators.map((e) => true)),
            rxjs.fromEvent(document, 'keyup').pipe(operators.map((e) => false))
        );

        this.onDeleteActive.subscribe((v: boolean) => {
            this.setState({
                delete: v
            });
        });
    }

    onChangeDrawing = (drawingType: DrawTypes) => {
        this.setState({
            drawingType
        });
    }

    render() {
        return (
            <div className={'appContainer'}>
                <div className={'appHeader'}>
                    <label>Canvas testing app</label>
                </div>
                <div className={'appMain'}>
                    <Navbar collapsible={true}>
                        <NavButtons drawingType={this.state.drawingType} onClick={this.onChangeDrawing} />
                    </Navbar>
                    <CanvasContainer className={'appResize'} drawingType={this.state.drawingType} hoverActive={true} delete={this.state.delete} />
                </div>
            </div>
        );
    }
}

export { App };
