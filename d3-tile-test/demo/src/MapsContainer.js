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
    getRenderInfoByUuid,
    LINEAR_RENDER_MODALITY,
    type TilesByUuidT,
    type ViewPortByUuidT,
    type MapSizeByUuidT,
    type ScaleByUuidT,
    type RenderInfoByUuidT
} from '../../src/modules';

import { selectorLayoutMapsList, selectorLayoutMapsPopup } from './store/reducers';
import {SelectedPlainMapsComponents} from './components/SelectedPlainMapsComponents';

const ListContainer = styled.div`
    position: absolute;
    top:0px;
    bottom: 0px;
    left: 0px;
    right:0px;
    display: flex;
    border: 2px solid green;
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
    tilesByUuid:TilesByUuidT,
    viewPortByUuid:ViewPortByUuidT,
    scalesByUuid:ScaleByUuidT,
    sizeByUuid:MapSizeByUuidT,
    selectedMapsList:Set<string>,
    selectedMapsPopup:Set<string>,
    renderInfoByUuid:RenderInfoByUuidT,
|};

type Action = {|
    addSelectedMap:(string,string)=>void,
    initLayoutMap:(string,Array<string>)=>void,
    initTile:(?string,number,number,number,number,number,number,number,number,Array<number>)=>void,
    moveTile:(string,number,number,number)=>void
|};

type Props = Action & State;

const schema = {
    width: 200000,
    height: 100000,
    initZoom: 1,
    defaultZoom: 1,
    minZoom: 0.25,
    maxZoom: 4
};

const viewPortWidth: number = 700;
const viewPortHeight: number = 600;

class MapsContainer extends Component<Props>{

    componentDidMount(){
        const mappa1 = 'mappa1';
        const mappa2 = 'mappa2';
        const mappa3 = 'mappa3';

        const {defaultZoom,initZoom,width,height} = schema;
        this.props.initTile(mappa1,viewPortWidth,viewPortHeight,defaultZoom,initZoom,width,height,[0.25,1,2,3,4],LINEAR_RENDER_MODALITY);
        this.props.initTile(mappa2,viewPortWidth,viewPortHeight,defaultZoom,initZoom,width,height,[0.25,1,2,3,4],LINEAR_RENDER_MODALITY);
        this.props.initTile(mappa3,viewPortWidth,viewPortHeight,defaultZoom,initZoom,width,height,[0.25,1,2,3,4],LINEAR_RENDER_MODALITY);
        this.props.initLayoutMap(NAMESPACE_LIST,[mappa1,mappa2]);
        this.props.initLayoutMap(NAMESPACE_POPUP,[mappa3]);
        this.props.addSelectedMap(NAMESPACE_LIST,mappa1);
        this.props.addSelectedMap(NAMESPACE_LIST,mappa2);
        this.props.addSelectedMap(NAMESPACE_POPUP,mappa3);
    }

    onZoomed = (uuid:string, x:number, y:number, k:number) => {
        /*console.log(x);
        console.log(x);
        console.log(k);*/
        this.props.moveTile(uuid,x,y,k);
    }

    render(){
        const {tilesByUuid,viewPortByUuid,selectedMapsList,selectedMapsPopup,sizeByUuid,scalesByUuid,renderInfoByUuid} = this.props;
        return <div>
            <ListContainer>
                <SelectedPlainMapsComponents 
                    selectedMaps={selectedMapsList}
                    viewPortByUuid={viewPortByUuid}
                    tilesByUuid={tilesByUuid}
                    sizeByUuid={sizeByUuid}
                    scalesByUuid={scalesByUuid}
                    onZoomed={this.onZoomed}
                    renderInfoByUuid={renderInfoByUuid}
                />
            </ListContainer>
            <PopupContainer>
                <SelectedPlainMapsComponents 
                    selectedMaps={selectedMapsPopup}
                    viewPortByUuid={viewPortByUuid}
                    tilesByUuid={tilesByUuid}
                    sizeByUuid={sizeByUuid}
                    scalesByUuid={scalesByUuid}
                    onZoomed={this.onZoomed}
                    renderInfoByUuid={renderInfoByUuid}
                />
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
export {MapsContainer};
export default connect(mapStateToProps,{initTile,moveTile,addSelectedMap,initLayoutMap})(MapsContainer);