import * as React from 'react';
import { fromEvent } from 'rxjs';
import * as Rxjs from 'rxjs';
import * as Operators from 'rxjs/operators';

const DEBOUNCE_TIME = 100;

export interface ResizeEvent {
    windowSize: Array<number>;
    elemSize: Array<number>;
}

export interface ResizeContrllerProps {
    children: any;
    className?: string;
    onResize?: (size: ResizeEvent) => any;
}

interface ReasizeContrllerState {
    width: number;
    height: number;
}

export class ResizeController extends React.PureComponent<ResizeContrllerProps, ReasizeContrllerState> {
    state: ReasizeContrllerState;
    divRef: React.RefObject<HTMLDivElement>;
    resizeO: Rxjs.Observable<Event>;
    resizSub: Rxjs.Subscription;

    constructor(props: ResizeContrllerProps) {
        super(props);
        this.state = {
            width: 0,
            height: 0
        };
        this.divRef = React.createRef();
    }

    componentDidMount() {
        if (this.divRef.current) {
            this.resizeO = fromEvent(window, 'resize');
            this.resizSub = this.resizeO.pipe(Operators.debounceTime(DEBOUNCE_TIME), Operators.map((e: Event): ResizeEvent => {
                return {
                    windowSize: [window.innerWidth, window.innerHeight],
                    elemSize: [this.divRef.current ? this.divRef.current.clientWidth : 0, this.divRef.current ? this.divRef.current.clientHeight : 0]
                };
            })).subscribe((re: ResizeEvent) => {
                if (this.props.onResize) {
                    this.props.onResize(re);
                }
            });

            if (this.props.onResize) {
                this.props.onResize({
                    windowSize: [window.innerWidth, window.innerHeight],
                    elemSize: [this.divRef.current ? this.divRef.current.clientWidth : 0, this.divRef.current ? this.divRef.current.clientHeight : 0]
                });
            }
        }
    }

    componentWillUnmount() {
        this.resizSub.unsubscribe();
    }

    render() {
        return(
            <div ref={this.divRef} className={this.props.className}>{this.props.children}</div>
        );
    }
}