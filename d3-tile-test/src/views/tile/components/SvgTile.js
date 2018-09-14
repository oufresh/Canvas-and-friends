import React from 'react';
import { TILE_SIZE } from '../../../modules/maps/utils/constants';

type SvgTilePropsType = {
    key: string,
    x: number,
    y: number,
    z: number,
    svgContent?: string,
    urlSvgProvider?: Function,
    getTilePromise?: Promise,
    opts?: any,
    baseUrl?: string,
    width?: number,
    height?: number
};

export const defaultHeight: number = TILE_SIZE;
export const defaultWidth: number = TILE_SIZE;

const createSvgMarkup = (svg: string) => {
    return { __html: svg };
}

class SvgTile extends React.PureComponent<SvgTilePropsType>
{
    constructor(props: SvgTilePropsType) 
    {
        super(props);
        this.state = {
            svgString: this.props.svgContent ? this.props.svgContent : ''
        }
    }

    componentDidMount()
    {
        //console.log("SvgTile componentDidMount");
        if (this.props.urlSvgProvider) {
            const url = this.props.urlSvgProvider(this.props.z, this.props.x, this.props.y);
            fetch(url).then(r => {
                if (r.ok === true)
                    return r.text();
                else
                    throw new Error(r.statusText)
            }).then(svgString => {
                //console.log('Received tile: ' + svgString);
                this.setState({
                    svgString
                });
            }).catch(e => {
                console.error(e);
            });
        }
        else if (this.props.getTilePromise) {
            this.props.getTilePromise(this.props.baseUrl, this.props.z, this.props.x, this.props.y, this.props.renderInfo).then(svgString => {
                //console.log('Received tile: ' + svgString);
                this.setState({
                    svgString
                });
            }).catch(e => {
                console.error(e);
            });
        }
    }

    render()
    {
        const h = this.props.height ? this.props.height : defaultHeight;
        const w = this.props.width ? this.props.width : defaultWidth;
        const content = createSvgMarkup(this.state.svgString);
        const transform = 'translate('+ this.props.x*w+' '+ this.props.y*h+')';
    
        return <g transform={transform} width={w} height={h} dangerouslySetInnerHTML={content} />;
    }
}

export default SvgTile;