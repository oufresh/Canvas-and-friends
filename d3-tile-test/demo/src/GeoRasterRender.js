import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import GeoTileRender from '../../src/views/tile/components/GeoTileRender';
import { moveTile, initTile } from '../../src/modules/maps';
import { getMapsTilesByUuid, getViewPortSizeByUuid, getMapScaleByUuid /*, getMapSizeByUuid*/ } from '../../src/modules/maps';
import RasterTile from '../../src/views/tile/components/RasterTile';
import { type RenderTileArg } from '../../src/views/tile/components/types';
import { getOSMUrl } from '../../src/modules/maps/utils/geoRenderUtils';


const MapContainer = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
`;

const viewPortWidth = 1280;
const viewPortHeight = 600;

const defaultCenter:Array<number> = [9, 45];
const defaultScaleExtent:Array<number> = [1 << 8, 1 << 18];
const defaultInitScale:number = 1 << 14;

type GeoRasterRenderPropsType = {
    width?: number,
    height?: number,
    moveTile: Function,
    scale: number,
    translate: Array,
    tiles: Array,
    initTile: Function,
    viewPortSize: Map,
    scales: Map
};

const renderTile = (t: RenderTileArg) => <RasterTile 
    x={t.x}
    y={t.y}
    url={getOSMUrl(t.z, t.x, t.y)}
    key={`${t.z}${t.x}${t.y}`}
/>;

class GeoRasterRender extends React.Component<GeoRasterRenderPropsType>
{
    constructor(props:GeoRasterRenderPropsType)
    {
        super(props);
        //if (this.props.initTile)
        //    this.props.initTile("Prova", width, height);
    }

    onZoomed = (uuid: string, x: number, y: number, k: number) => {
        if (this.props.moveTile)
            this.props.moveTile(uuid,x,y,k);
    }

    componentDidMount()
    {
        this.props.initTile("Prova", viewPortWidth, viewPortHeight,
            defaultScaleExtent[0], defaultScaleExtent[1], defaultInitScale, defaultInitScale);
    }

    render()
    {
        const tiles = this.props.tiles.get("Prova");
        const viewPortSize = this.props.viewPortSize.get("Prova");
        const scales = this.props.scales.get("Prova");
        //const size = this.props.size.get("Prova");

        return(
            <MapContainer>
                <GeoTileRender
                    uuid={"Prova"}
                    width={viewPortSize?viewPortSize.viewPortWidth:0}
                    height={viewPortSize?viewPortSize.viewPortHeight:0}
                    zoomExtent={scales?[scales.minScale, scales.maxScale]:null}
                    initZoom={scales?scales.initScale:null}
                    defaultZoom={scales?scales.defaultScale:null}
                    center={defaultCenter}
                    tiles={tiles}
                    onZoomed={this.onZoomed}
                    renderTile={renderTile}
                />
            </MapContainer>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        tiles: getMapsTilesByUuid(state),
        viewPortSize: getViewPortSizeByUuid(state),
        scales: getMapScaleByUuid(state)/*,
        size: getMapSizeByUuid(state)*/
    };
}

export { GeoRasterRender };
export default connect(mapStateToProps, { moveTile, initTile })(GeoRasterRender);