//@flow
import React from 'react';
import NavMenu from './NavMenu';

const inside = (x, y, area) => (x >= area[0] && x < area[2] && y > area[1] && y < area[3]);

/**
 * Con rxjs figata creo un subject per onmousemove,
 * poi con la switchMap o flatMap lancio un timer
 * e controllo se sono ancora dentro.
 * Se si dico a chi si sottoscrive di aprire il menu altrimenti
 * di tenerlo chiuso..
 * 
 * move = subject(onmouseMove);
 * 
 * move.pipe(flatMap(()=>{
    return from(timer).takeUntil(1);
 * }).map("dentro o fuori").subscribe(....) 
 * 
 * Si potrebbero anche mergiare gli eventi ...
 */

class LateralMenu extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            shown: false
        };
    }

    componentDidMount()
    {
        const areaIn = [0, 0, 1, window.innerHeight];
        const areaOut = [0, 0, 200, window.innerHeight];
        window.onmousemove = (e: MouseEvent) => {
            //console.log(e.clientX + ' ' + e.clientY);
            if (inside(e.clientX, e.clientY, areaIn) === true) {
                //inside
                if (this.state.shown === false) {
                    this.setState({
                        shown: true
                    });
                }
            }
            else if (inside(e.clientX, e.clientY, areaOut) === false) {
                if (this.state.shown === true) {
                    this.setState({
                        shown: false
                    });
                }
            }
        }
    }

    render() {
        console.log('lateral menu shown: ' + this.state.shown);
        return(
            <NavMenu show={this.state.shown} />
        );
    }
}

export default LateralMenu;