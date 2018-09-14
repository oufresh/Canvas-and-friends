//@flow
import React from 'react';
import TileRender from './TileRender';
import { getMercatorProjection } from '../../../modules/maps/utils/geoRenderUtils';
import { type RenderTileArg } from './types';

export type GeoRenderPropsType = {
    uuid: string,
    width: number,
    height: number,
    top: number,
    left: number,
    center: Array<number>,
    zoomExtent: Array<number>,
    initZoom: number,
    defaultZoom: number,
    renderTile: (RenderTileArg) => React.Component,
    onZoomed:(string,number,number,number)=>void,
    tiles: Array<Object>
};

class GeoTileRender extends React.Component<GeoRenderPropsType>
{
    scaledCenter: Array<number>;

    constructor(props:GeoRenderPropsType)
    {
        super(props);
    }
      
    onZoomed = (uuid: string, x: number, y: number, k: number) =>
    {
        if (this.props.onZoomed)
            this.props.onZoomed(uuid, x, y, k);
    }

    calculateCenter()
    {
        const projection = getMercatorProjection();
        const p = projection(this.props.center);
        return [-p[0], -p[1]];
    }

    componentDidMount()
    {
        console.log("didiMount GeoTileRender");
    }

    componentDidUpdate(prevProps: GeoRenderPropsType)
    {
        //console.log("componentDidUpdate");

        //portare qui la roba di set del centro e prima scala
    }

    render()
    {
        if (!this.renderInfo && this.props.zoomExtent && this.props.initZoom)
        {
            this.renderInfo = {
                expScaleExtent: this.props.zoomExtent,
                initExpScale: this.props.initZoom,
                expScaleDefault: this.props.defaultZoom
            };
            this.scaledCenter = this.calculateCenter();
        }
        return (
            <TileRender
                uuid={this.props.uuid}
                width={this.props.width}
                height={this.props.height}
                top={this.props.top}
                left={this.props.left}
                renderInfo={this.renderInfo}
                scaledCenter={this.scaledCenter}
                tiles={this.props.tiles}
                onZoomed={this.onZoomed}
                renderTile={this.props.renderTile}
        />);
    }
}

export default GeoTileRender;