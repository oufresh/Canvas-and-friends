//@flow
/*eslint no-magic-numbers:*/
import React, {Component} from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { 
    addSelectedMap,
    initLayoutMap,
    NAMESPACE_LIST,
    NAMESPACE_POPUP,
    initTile,
    moveTile,
    getMapsTilesByUuid,
    getViewPortSizeByUuid,
    getMapScaleByUuid,
    getMapSizeByUuid,
    EXP_RENDER_MODALITY,
    getRenderInfoByUuid,
    type TilesByUuidT,
    type ScaleByUuidT,
    type ViewPortByUuidT,
    type MapSizeByUuidT,
    type RenderInfoByUuidT,
    type RenderInfoT
} from '../../src/modules';

import PlainTileRender from '../../src/views/tile/components/PlainTileRender';
import stSvgGetTile from './stSvgGetTile';
import { type RenderTileArg } from '../../src/views/tile/components/types';
import SvgTile from '../../src/views/tile/components/SvgTile';
import { selectorLayoutMapsList, selectorLayoutMapsPopup } from './store/reducers';

import { calcScaledTranslation } from './stRenderUtils';

const defaultViewPortWidth: number = 700;
const defaultViewPortHeight: number = 600;

const ListContainer = styled.div`
    position: absolute;
    top:0px;
    bottom: 0px;
    left: 0px;
    right:0px;
    display: flex;
`;


const PopupContainer =styled.div`
    z-index: 1000;
    background-color: #f1f1f1;
    border: 2px solid red;
    position:absolute;
    top: 50px;
    left: 300px;
    display: block;
    width: ${(defaultViewPortWidth+5)+'px'};
    height: ${(defaultViewPortHeight+5)+'px'};
`;

type State = {|
    tilesByUuid:TilesByUuidT,
    viewPortByUuid:ViewPortByUuidT,
    scalesByUuid: ScaleByUuidT,
    getMapSizeByUuid: MapSizeByUuidT,
    selectedMapsList:Set<string>,
    selectedMapsPopup:Set<string>,
    renderInfo:RenderInfoByUuidT,
|};

type Action = {|
    addSelectedMap:(string,string)=>void,
    initLayoutMap:(string,Array<string>)=>void,
    initTile:(?string,number,number,number,number,number,number,number,number,Array<number>)=>void,
    moveTile:(string,number,number,number)=>void
|};

type Props = Action & State;

const schema = {
    width: 52572,
    height: 44016,
    top: 0,
    left: 0,
    scales: [0, 1, 2, 3, 4],
    scaleCurrent: 2,
    scaleDefault: 2
};


const defaultViewportPosition = [0, 0];
const schemaCenter = [52572/2, 44016/2];
const schemaEnd = [52572-1, 44016-1];
const defaultSchemaPoint = [0, 0];

const SvgGetTile = stSvgGetTile(SvgTile, 'http://localhost:3000/schematica/rest/schematica/schemi/tile/ST/ST/REALE/TOPOLOGICO_MT/none/none/Monocromatico');

const renderTile = (t: RenderTileArg, renderInfo: RenderInfoT) => <SvgGetTile 
    x={t.x}
    y={t.y}
    z={t.z}
    key={''+t.z+t.x+t.y}
    renderInfo={renderInfo}
/>;

const getSelectedMapsComponents = (selectedMaps,viewPortByUuid: Map, tilesByUuid: Map, scalesByUuid: Map, sizeByUuid: Map, onZoomed: Function,renderInfoByUuid) =>{
    return selectedMaps.toJS().map((v,i) => {
        const {viewPortWidth,viewPortHeight} = viewPortByUuid.get(v);
        const tiles = tilesByUuid.get(v);
        const scales = scalesByUuid.get(v);
        const size = sizeByUuid.get(v);
        const renderInfo = renderInfoByUuid.get(v);

        return ( 
                <PlainTileRender 
                    key={v}
                    uuid={v}
                    width={viewPortWidth} 
                    height={viewPortHeight} 
                    left={ 0 + i* 700}
                    top={0}
                    objectWidth={size?size.width:0}
                    objectHeight={size?size.height:0}
                    objectInitZoom={scales?scales.initScale:null}
                    objectZoomExtent={scales?[scales.minScale, scales.maxScale]:null}
                    objectDefaultZoom={scales?scales.defaultScale:null}
                    calcScaledTranslation={calcScaledTranslation}
                    renderTile={renderTile}
                    tiles={tiles} 
                    onZoomed={onZoomed} 
                    objectPosition={defaultSchemaPoint}
                    viewportPosition={defaultViewportPosition}
                    renderInfo={renderInfo}
                />
            )
        }
    );
}


class MultiStSchemaRender extends Component<Props>{

    componentDidMount(){
        const mappa1 = 'mappa1';
        const mappa2 = 'mappa2';
        const mappa3 = 'mappa3';
        
        this.props.initTile(mappa1,defaultViewPortWidth,defaultViewPortHeight, schema.scaleDefault, schema.scaleCurrent, schema.width, schema.height,schema.scales,EXP_RENDER_MODALITY);
        this.props.initTile(mappa2,defaultViewPortWidth,defaultViewPortHeight, schema.scaleDefault, schema.scaleCurrent, schema.width, schema.height,schema.scales,EXP_RENDER_MODALITY);
        this.props.initTile(mappa3,defaultViewPortWidth,defaultViewPortHeight, schema.scaleDefault, schema.scaleCurrent, schema.width, schema.height,schema.scales,EXP_RENDER_MODALITY);

        this.props.initLayoutMap(NAMESPACE_LIST,[mappa1,mappa2]);
        this.props.initLayoutMap(NAMESPACE_POPUP,[mappa3]);
        this.props.addSelectedMap(NAMESPACE_LIST,mappa1);
        this.props.addSelectedMap(NAMESPACE_LIST,mappa2);
        this.props.addSelectedMap(NAMESPACE_POPUP,mappa3);
    }

    onZoomed = (uuid:string, x:number, y:number, k:number, currentExpScale: number) => {
        this.props.moveTile(uuid,x,y,k);
    }

    render(){
        const {tilesByUuid,viewPortByUuid, scalesByUuid, sizeByUuid, selectedMapsList, selectedMapsPopup,renderInfoByUuid} = this.props;
        return <div>
            <ListContainer>
            {
                getSelectedMapsComponents(selectedMapsList,viewPortByUuid,tilesByUuid, scalesByUuid, sizeByUuid, this.onZoomed,renderInfoByUuid)

            }
            </ListContainer>
            <PopupContainer>
            {
                getSelectedMapsComponents(selectedMapsPopup,viewPortByUuid,tilesByUuid, scalesByUuid, sizeByUuid, this.onZoomed,renderInfoByUuid)
            }
            </PopupContainer>
        </div>
    }
}

const mapStateToProps = (state:State) =>{
    return {
        tilesByUuid: getMapsTilesByUuid(state),
        viewPortByUuid: getViewPortSizeByUuid(state),
        scalesByUuid: getMapScaleByUuid(state),
        sizeByUuid: getMapSizeByUuid(state),
        selectedMapsList: selectorLayoutMapsList.getSelectedMaps(state),
        selectedMapsPopup: selectorLayoutMapsPopup.getSelectedMaps(state),
        renderInfoByUuid: getRenderInfoByUuid(state)
    }
}
export {MultiStSchemaRender};
export default connect(mapStateToProps,{initTile,moveTile,addSelectedMap,initLayoutMap})(MultiStSchemaRender);