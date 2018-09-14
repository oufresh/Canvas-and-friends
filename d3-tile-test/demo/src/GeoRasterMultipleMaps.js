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
    type ScaleByUuidT,
    type TilesByUuidT,
    type ViewPortByUuidT 
} from '../../src/modules';

import GeoTileRender from '../../src/views/tile/components/GeoTileRender';
import { getOSMUrl } from '../../src/modules/maps/utils/geoRenderUtils';
import { type RenderTileArg } from '../../src/views/tile/components/types';
import RasterTile from '../../src/views/tile/components/RasterTile';
import { selectorLayoutMapsList, selectorLayoutMapsPopup } from './store/reducers';

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
    width: 705px;
    height: 605px;
`;

type State = {|
    scalesByUuid: ScaleByUuidT,
    tilesByUuid:TilesByUuidT,
    viewPortByUuid:ViewPortByUuidT,
    selectedMapsList:Set<string>,
    selectedMapsPopup:Set<string>
|};

type Action = {|
    addSelectedMap:(string,string)=>void,
    initLayoutMap:(string,Array<string>)=>void,
    initTile:(?string,number,number)=>void,
    moveTile:(string,number,number,number)=>void
|};

type Props = Action & State;

const renderTile = (t: RenderTileArg) => <RasterTile 
    x={t.x}
    y={t.y}
    url={getOSMUrl(t.z, t.x, t.y)}
    key={''+t.z+t.x+t.y}
/>;

const defaultCenter:Array<number> = [9, 45];
const defaultScaleExtent:Array<number> = [1 << 8, 1 << 18];
const defaultInitScale:number = 1 << 14;


const getSelectedMapsComponents = (selectedMaps,viewPortByUuid,tilesByUuid,scalesByUuid,onZoomed) =>{
    return selectedMaps.toJS().map((v,i) => {
        const {viewPortWidth,viewPortHeight} = viewPortByUuid.get(v);
        const scales = scalesByUuid.get(v);

        return ( 
                <GeoTileRender 
                    key={v}
                    uuid={v}
                    width={viewPortWidth} 
                    height={viewPortHeight} 
                    tiles={tilesByUuid.get(v)} 
                    onZoomed={onZoomed} 
                    left={ 0 + i* 700}
                    top={0}
                    center={defaultCenter}
                    renderTile={renderTile}
                    zoomExtent={scales?[scales.minScale, scales.maxScale]:null}
                    initZoom={scales?scales.initScale:null}
                    defaultZoom={scales?scales.defaultScale:null}
                />
            )
        }
    
    )
}


class GeoRasterMultipleMaps extends Component<Props>{

    componentDidMount(){
        const mappa1 = 'mappa1';
        const mappa2 = 'mappa2';
        const mappa3 = 'mappa3';

        this.props.initTile(mappa1,700,600, defaultScaleExtent[0], defaultScaleExtent[1], defaultInitScale, defaultInitScale);
        this.props.initTile(mappa2,700,600, defaultScaleExtent[0], defaultScaleExtent[1], defaultInitScale, defaultInitScale);
        this.props.initTile(mappa3,700,600, defaultScaleExtent[0], defaultScaleExtent[1], defaultInitScale, defaultInitScale);

        this.props.initLayoutMap(NAMESPACE_LIST,[mappa1,mappa2]);
        this.props.initLayoutMap(NAMESPACE_POPUP,[mappa3]);
        this.props.addSelectedMap(NAMESPACE_LIST,mappa1);
        this.props.addSelectedMap(NAMESPACE_LIST,mappa2);
        this.props.addSelectedMap(NAMESPACE_POPUP,mappa3);
    }

    onZoomed = (uuid:string, x:number, y:number, k:number) => {
        this.props.moveTile(uuid,x,y,k);
    }

    render(){
        const {tilesByUuid,viewPortByUuid, scalesByUuid, selectedMapsList, selectedMapsPopup} = this.props;
        return <div>
            <ListContainer>
            {
                getSelectedMapsComponents(selectedMapsList,viewPortByUuid,tilesByUuid,scalesByUuid,this.onZoomed)

            }
            </ListContainer>
            <PopupContainer>
            {
                getSelectedMapsComponents(selectedMapsPopup,viewPortByUuid,tilesByUuid,scalesByUuid,this.onZoomed)
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
        selectedMapsList: selectorLayoutMapsList.getSelectedMaps(state),
        selectedMapsPopup: selectorLayoutMapsPopup.getSelectedMaps(state)
    }
}
export {GeoRasterMultipleMaps};
export default connect(mapStateToProps,{initTile,moveTile,addSelectedMap,initLayoutMap})(GeoRasterMultipleMaps);