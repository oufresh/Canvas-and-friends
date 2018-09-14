import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import PlainTileRender from '../../src/views/tile/components/PlainTileRender';
import {
    moveTile, 
    initTile,
    getMapsTilesByUuid, 
    getViewPortSizeByUuid, 
    getMapScaleByUuid, 
    getMapSizeByUuid, 
    LINEAR_RENDER_MODALITY,
    getRenderInfoByUuid,
    type RenderInfoByUuidT,
} from '../../src/modules';
import SvgTile from '../../src/views/tile/components/SvgTile';
import svgGetTile from './svgGetTile';
import { type RenderTileArg } from '../../src/views/tile/components/types';

const Container = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: row;
`;

const MapContainer = styled.div`
    position: relative;
    border: 1px solid black;
    width: 1280px;
    height: 600px;
`;

const Controls = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-grow: 1;
`;

type MapRenderPropsType = {
    size?: Object,
    viewPortSize?:Object,
    moveTile: Function,
    scale: number,
    translate: Array,
    tiles: Array,
    initTile: Function,
    scales: Function,
    renderInfo:RenderInfoByUuidT,
};

type MapRenderState = {
    gotoX: number,
    gotoY: number
};

const schema = {
    width: 200000,
    height: 100000,
    top: 0,
    left: 0,
    initZoom: 1,
    defaultZoom: 1,
    scales: [0.25,1,2,3,4]
};

const viewPortWidth: number = 1280;
const viewPortHeight: number = 600;
const defaultViewportPosition = [0, 0];
const defaultObjectPosition = [0, 0];

const SvgGetTile = svgGetTile(SvgTile, 'http://localhost:5000/tiles');

const renderTile = (t: RenderTileArg) => <SvgGetTile 
    x={t.x}
    y={t.y}
    z={t.z}
    key={''+t.z+t.x+t.y}
/>;

class PlainSvgRender extends React.Component<MapRenderPropsType, MapRenderState>
{
    constructor(props:MapRenderPropsType)
    {
        super(props);
        //this.props.initTile("Prova", viewPortWidth, viewPortHeight);
    }

    onZoomed = (uuid: string, x: number, y: number, k: number) => {
        if (this.props.moveTile)
            this.props.moveTile(uuid, x,y,k);
    }

    componentDidMount()
    {
        console.log("didiMount PlainSvgRender");
        this.props.initTile("Prova", viewPortWidth, viewPortHeight, 
        schema.defaultZoom, schema.initZoom, schema.width, schema.height,schema.scales,LINEAR_RENDER_MODALITY);
    }

    render()
    {
        const tiles = this.props.tiles.get("Prova");
        const viewPortSize = this.props.viewPortSize.get("Prova");
        const scales = this.props.scales.get("Prova");
        const size = this.props.size.get("Prova");
        const renderInfo = this.props.renderInfo.get("Prova");
        return(
            <Container>
                <MapContainer>
                    <PlainTileRender 
                        uuid="Prova"
                        width={viewPortSize?viewPortSize.viewPortWidth:0} 
                        height={viewPortSize?viewPortSize.viewPortHeight:0} 
                        top={schema.top}
                        left={schema.left}
                        objectWidth={size?size.width:0}
                        objectHeight={size?size.height:0}
                        objectInitZoom={scales?scales.initScale:null}
                        objectZoomExtent={scales?[scales.minScale, scales.maxScale]:null}
                        objectDefaultZoom={scales?scales.defaultScale:null}
                        renderTile={renderTile}
                        tiles={tiles} 
                        onZoomed={this.onZoomed} 
                        objectPosition={defaultObjectPosition}
                        viewportPosition={defaultViewportPosition}
                        renderInfo={renderInfo}
                    />
                </MapContainer>
                <Controls>
                </Controls>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        tiles: getMapsTilesByUuid(state),
        viewPortSize: getViewPortSizeByUuid(state),
        scales: getMapScaleByUuid(state),
        size: getMapSizeByUuid(state),
        renderInfo:getRenderInfoByUuid(state)
    };
}

export { PlainSvgRender };
export default connect(mapStateToProps, { moveTile, initTile })(PlainSvgRender);