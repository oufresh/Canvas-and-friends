import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import PlainTileRender from '../../src/views/tile/components/PlainTileRender';
import { 
    initTile,
    moveTile,
    getMapsTilesByUuid,
    getViewPortSizeByUuid, 
    getMapScaleByUuid, 
    getMapSizeByUuid,
    EXP_RENDER_MODALITY,
    getRenderInfoByUuid,
    getMaxScaleConvByUuid,
    type RenderInfoByUuidT,
    type RenderInfoT
 } from '../../src/modules';
import SvgTile from '../../src/views/tile/components/SvgTile';
import stSvgGetTile from './stSvgGetTile';
import { type RenderTileArg } from '../../src/views/tile/components/types';

import { calcScaledTranslation, calcStScaledTranslation } from './stRenderUtils';
import { calcCurrentStScale, getFactorForStScale } from './stSchemaUtils';
import StSchemaInfo from './StSchemaInfo';
import StValueView from './StValueView';

const Container = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: row;
`;

const MapSizer = styled.div`
    position: relative;
    flex: 1 0 auto;
`;

const MapContainer = (props) => {
    return <div ref={props.r} style={{position:'absolute', top:'0px', left:'0px', right:'0px', bottom: '0px'}}>
        {props.children}
    </div>
};

const Controls = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-grow: 0;
    width: 350px;
`;

type MapRenderPropsType = {
    size?: Object,
    viewPortSize?:Object,
    scales: Object,
    moveTile: Function,
    scale: number,
    translate: Array,
    tiles: Array,
    initTile: Function,
    renderInfo:RenderInfoByUuidT,
    maxScaleConvs: Map<string, number>
};

type MapRenderState = {
    viewPortPosition: Array<number>,
    schemaPoint: Array<number>,
    mouseCoords: Array<number>
};

const schema = {
    width: 52572,
    height: 44016,
    top: 0,
    left: 0,
    scales: [0, 1, 2, 3, 4],
    scaleCurrent: 4,
    scaleDefault: 2
};

const viewPortWidth: number = 1280;
const viewPortHeight: number = 600;
const defaultViewportPosition = [viewPortWidth/2, viewPortHeight/2];
const schemaCenter = [52572/2 - 1, 44016/2 - 1];
const schemaEnd = [0, 44016-1];
const defaultSchemaPoint = [0, 0];

const SvgGetTile = stSvgGetTile(SvgTile, 'http://localhost:3000/schematica/rest/schematica/schemi/tile/ST/ST/REALE/TOPOLOGICO_MT/none/none/Monocromatico');

const renderTile = (t: RenderTileArg, renderInfo: RenderInfoT) => <SvgGetTile 
    x={t.x}
    y={t.y}
    z={t.z}
    key={''+t.z+t.x+t.y}
    renderInfo={renderInfo}
/>;

const convertCoords = (stScale, coords) => {
    const factor = getFactorForStScale(stScale);
    return coords.map(c => Math.round(c*factor));
}

class StSchemaRender extends React.Component<MapRenderPropsType, MapRenderState>
{
    constructor(props:MapRenderPropsType)
    {
        super(props);
        this.state = {
            viewPortPosition: defaultViewportPosition,
            schemaPoint: schemaEnd,
            mouseCoords: [0,0]
        }

        this.sizeRef = React.createRef();
    }

    onZoomed = (uuid: string, x: number, y: number, k: number, maxScaleConv: number) => {
        if (this.props.moveTile) {
            this.props.moveTile(uuid, x,y,k);
        }

        this.maxScaleConv = maxScaleConv;
    }

    componentDidMount()
    {
        console.log("didiMount StSchemaRender");

        const viewPort = this.sizeRef.current.getBoundingClientRect();

        this.props.initTile("StSchemaRender", viewPort.width, viewPort.height, 
            schema.scaleDefault, schema.scaleCurrent, schema.width, schema.height,schema.scales,EXP_RENDER_MODALITY);
    }

    onMouseMove = (coords) => {
        this.setState(ps => {
            return {
                viewPortPosition: ps.viewPortPosition,
                schemaPoint: ps.schemaPoint,
                mouseCoords: coords
            };
        });
    }

    onDoubleClick = (el) => {
        console.log(el);
    }

    render()
    {
        const tiles = this.props.tiles.get("StSchemaRender");
        const viewPortSize = this.props.viewPortSize.get("StSchemaRender");
        const scales = this.props.scales.get("StSchemaRender");
        const size = this.props.size.get("StSchemaRender");
        const renderInfo = this.props.renderInfo.get("StSchemaRender");

        //if (scales)
        //    console.log(scales.currentExpScale);

        const currentStScale = scales ? calcCurrentStScale(scales.currentExpScale, tiles.z, scales.minScale, renderInfo.maxScaleConv).toString() : -1;

        //si può fare anche così ...
        /*if (tiles && tiles.z != NaN) {
            const f = Math.pow(2, (tiles.z - 8));
            const cc = this.state.mouseCoords.map(c => Math.round(c / f));
            console.log(cc);
        }*/

        const currentCoords = convertCoords(currentStScale, this.state.mouseCoords);

        return(
            <Container>
                <MapSizer>
                    <MapContainer r={this.sizeRef}>
                        <PlainTileRender 
                            uuid="StSchemaRender"
                            width={viewPortSize?viewPortSize.viewPortWidth:0} 
                            height={viewPortSize?viewPortSize.viewPortHeight:0} 
                            top={schema.top}
                            left={schema.left}
                            objectWidth={size?size.width:0}
                            objectHeight={size?size.height:0}
                            objectInitZoom={scales?scales.initScale:null}
                            objectZoomExtent={scales?[scales.minScale, scales.maxScale]:null}
                            objectDefaultZoom={scales?scales.defaultScale:null}
                            calcScaledTranslation={calcStScaledTranslation}
                            renderTile={renderTile}
                            tiles={tiles} 
                            onZoomed={this.onZoomed} 
                            objectPosition={this.state.schemaPoint}
                            viewportPosition={this.state.viewPortPosition}
                            renderInfo={renderInfo}
                            scales={scales}
                            onMouseMove={this.onMouseMove}
                            onDoubleClick={this.onDoubleClick}
                        />
                    </MapContainer>
                </MapSizer>
                <Controls>
                    <StSchemaInfo>
                        <StValueView label={'Schema size'} value={schema.width+'x'+schema.height} />
                        <StValueView label={'Viewport X'} value={this.state.viewPortPosition[0]} />
                        <StValueView label={'Viewport Y'} value={this.state.viewPortPosition[1]} />
                        <StValueView label={'Schema X'} value={this.state.schemaPoint[0]} />
                        <StValueView label={'Schema Y'} value={this.state.schemaPoint[1]} />
                        <StValueView label={'ST SCALE'} value={currentStScale} />
                        <br />
                        <StValueView label={'Schema mouse X'} value={currentCoords[0]} />
                        <StValueView label={'Schema mouse Y'} value={currentCoords[1]} />
                    </StSchemaInfo>
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
        renderInfo: getRenderInfoByUuid(state),
        maxScaleConvs: getMaxScaleConvByUuid(state)
    };
}

export { StSchemaRender };
export default connect(mapStateToProps, { moveTile, initTile })(StSchemaRender);