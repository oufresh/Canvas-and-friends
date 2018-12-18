import * as React from 'react';
import './Navbar.css';

interface NavbarState {
    opened: boolean;
}

interface NavBarProps {
    children: any;
    collapsible: boolean;
}

export class Navbar extends React.Component<NavBarProps, NavbarState> {
    state: NavbarState;

    constructor(props: NavBarProps) {
        super(props);
        this.state = {
            opened: false
        };
    }

    onClickCollapse = (): any => {
        this.setState({
            opened: !this.state.opened
        });
    }

    render() {
        return (
            <div className={'navbarMain'}>
                <div className={'navbarButtons'}>{this.props.children}</div>
                {this.props.collapsible === true ? <div className={'navbarCollapse'}><button onClick={this.onClickCollapse}>{this.state.opened === true ? '<<' : '>>'}</button></div> : null}
            </div>
        );
    }
}