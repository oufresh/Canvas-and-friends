import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import SingleTile from '../../src/views/singleTile/SingleTile';
import { 
    moveTile,
    initTile,
    SINGLE_RENDER_MODALITY
} from '../../src/modules';
import { getViewPortSizeByUuid, 
    getMapScaleByUuid, 
    getMapSizeByUuid, 
    getMapTransform,
    getRenderInfoByUuid
} from '../../src/modules/maps/selectors';

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
    viewPortSize?: Map,
    moveTile: Function,
    scale: number,
    translate: Array,
    tiles: Array,
    initTile: Function,
    scales: Map,
    transforms: Map,
    renderInfo: Map
};

type MapRenderState = {
    gotoX: number,
    gotoY: number
};

const schema = {
    width: 2000,
    height: 1000,
    top: 0,
    left: 0,
    initZoom: 1,
    defaultZoom: 1,
    minZoom: 0.25,
    maxZoom: 4,
    svgContent: '<g>'+
        '<rect x="0" y="0" width="2000" height="1000" style="fill:rgb(200,200,200);"/>' +
        '<rect data-id="2" x="50" y="110" width="100" height="200" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)"/>' +
        '<rect x="999" y="499" width="2" height="2" style="fill:rgb(255,0,0);stroke-width:1;stroke:rgb(255,0,0)"/>'
        +'</g>'
};

const viewPortWidth: number = 1280;
const viewPortHeight: number = 600;
const defaultViewportPosition = [0, 0];
const defaultObjectPosition = [0, 0];

class SingleTileRender extends React.Component<MapRenderPropsType, MapRenderState>
{
    constructor(props:MapRenderPropsType)
    {
        super(props);
    }

    onZoomed = (uuid: string, x: number, y: number, k: number) => {
        if (this.props.moveTile)
            this.props.moveTile(uuid, x,y,k);
    }

    componentDidMount()
    {
        this.props.initTile("Prova", viewPortWidth, viewPortHeight, 
            schema.defaultZoom, schema.initZoom, schema.width,
            schema.height, [schema.minZoom, schema.maxZoom], SINGLE_RENDER_MODALITY);
    }

    render()
    {
        const viewPortSize = this.props.viewPortSize.get("Prova");
        const transform = this.props.transforms.get("Prova");
        const renderInfo = this.props.renderInfo.get("Prova");

        return(
            <Container>
                <MapContainer>
                    <SingleTile 
                        uuid="Prova"
                        width={viewPortSize?viewPortSize.viewPortWidth:0} 
                        height={viewPortSize?viewPortSize.viewPortHeight:0} 
                        top={schema.top}
                        left={schema.left}
                        renderInfo={renderInfo}
                        scale={transform?transform.currentExpScale:null}
                        translate={transform?[transform.transformX, transform.transformY]:null}
                        svgContent={schema.svgContent}
                        onZoomed={this.onZoomed} 
                        objectPosition={defaultObjectPosition}
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
        viewPortSize: getViewPortSizeByUuid(state),
        scales: getMapScaleByUuid(state),
        size: getMapSizeByUuid(state),
        transforms: getMapTransform(state),
        renderInfo: getRenderInfoByUuid(state)
    };
}

export { SingleTileRender };
export default connect(mapStateToProps, { moveTile, initTile })(SingleTileRender);
