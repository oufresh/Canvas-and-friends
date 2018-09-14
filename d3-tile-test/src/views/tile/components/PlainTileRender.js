import React from 'react';
import { type RenderInfoT} from '../../../modules/maps';
import { type RenderTileArg } from './types';
import TileRender from './TileRender';

export type PlainTileRenderPropsType = {
    uuid: string,
    width: number,
    height: number,
    top: number,
    left: number,
    objectWidth: number,
    objectHeight: number,
    objectZoomExtent?: Array<number>,
    objectInitZoom?: number,
    objectDefaultZoom?: number,
    objectPosition?: Array<number>, //punto dell'oggetto che va scalata nella viewport da posizionare in viewPrtPosition
    viewportPosition?: Array<number>, //posizione nella viewport in cui va messo objectPosition
    renderTile: (RenderTileArg) => React.Component<Object, Object>,
    onZoomed:(string,number,number,number, number)=>void,
    scale: number,
    translate: Array<number>,
    tiles: Array<Object>,
    renderInfo:RenderInfoT,
    scales: Object,
    onDoubleClick: Function
};

class PlainTileRender extends React.Component<PlainTileRenderPropsType>
{
    constructor(props:PlainTileRenderPropsType)
    {
        super(props);
    }

    onZoomed = (uuid: string, x: number, y: number, k: number) =>
    {
        if (this.props.onZoomed)
            this.props.onZoomed(uuid, x, y, k);
    }

    onMouseMove = (e) => {
        //console.log(this.props.scales.currentExpScale);
        //console.log(this.props.tiles);
        //console.log(this.props.tiles.translate[0]);

        //const r = this.props.tiles.scale % 1 ? Number : Math.round;
        const k = this.props.tiles.scale / 256;

        const tx = Math.round(this.props.tiles.translate[0] * this.props.tiles.scale);
        const ty = Math.round(this.props.tiles.translate[1] * this.props.tiles.scale);

        const x = (e[0] - tx) / k;
        const y = (e[1] - ty) / k;

        //console.log([x, y]);
        //scala attuale della viewport 
        //this.this.props.tile.scale

        if (this.props.onMouseMove)
            this.props.onMouseMove([x,y]);
    }
    
    componentDidMount()
    {
        console.log("PlaintileRender componentDidMount");
    }

    componentDidUpdate(prevProps: PlainTileRenderPropsType)
    {

    }

    render()
    {
        if (this.props.tiles) {
            //console.log("--- Received tiles ---");
            //console.log(this.props.tiles);
            //console.log("----------------------");
        }
        
        //da capire come passarla
        const sc = this.props.calcScaledTranslation ? this.props.calcScaledTranslation : c => c;
        const scaledObjectTranslation = (this.props.renderInfo && this.props.renderInfo.initExpScale) ? (this.props.objectPosition ? sc(this.props.objectPosition, this.props.objectWidth, this.props.objectHeight, this.props.renderInfo.expScaleDefault) : [0.5, 0.5]) : [0.5,0.5];

        console.log(scaledObjectTranslation);

        return (
            <TileRender
                uuid={this.props.uuid}
                width={this.props.width}
                height={this.props.height}
                top={this.props.top}
                left={this.props.left}
                renderInfo={this.props.renderInfo}
                tiles={this.props.tiles}
                onZoomed={this.onZoomed} 
                renderTile={this.props.renderTile}
                viewportPosition={this.props.viewportPosition}
                scaledObjectTranslation={scaledObjectTranslation}
                onMouseMove={this.onMouseMove}
                onDoubleClick={this.props.onDoubleClick}
                scales={this.props.scales}
        />);
    }
}

export default PlainTileRender;