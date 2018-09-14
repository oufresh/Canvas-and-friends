//@flow
/*eslint no-magic-numbers:*/
import React, {Component} from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
    addSelectedMap,
    initLayoutMap,
    initSelectedMap,
    NAMESPACE_POPUP,
    NAMESPACE_TAB,
    initTile,
    moveTile,
    getMapsTilesByUuid,
    getViewPortSizeByUuid,
    getMapScaleByUuid,
    getMapSizeByUuid,
    type TilesByUuidT,
    type ViewPortByUuidT,
    type MapSizeByUuidT,
    type ScaleByUuidT
} from '../../src/modules';
import { selectorLayoutMapsTab, selectorLayoutMapsPopup } from './store/reducers';
import { TabsMapPanel } from '../../src/views';
import {SelectedPlainMapsComponents, renderTile} from './components/SelectedPlainMapsComponents';

const schema = {
    width: 200000,
    height: 100000,
    initZoom: 1,
    defaultZoom: 1,
    minZoom: 0.25,
    maxZoom: 4,
    scales:[0.25,1,2,3,4]
};

const PopupContainer =styled.div`
    z-index: 1000;
    background-color: #f1f1f1;
    border: 2px solid red;
    position:absolute;
    top: 80px;
    left: 500px;
    display: block;
    width: 705px;
    height: 605px;
`;

type State = {|
    tilesByUuid:TilesByUuidT,
    viewPortByUuid:ViewPortByUuidT,
    scalesByUuid:ScaleByUuidT,
    sizeByUuid:MapSizeByUuidT,
    selectedMapsTab:Set<string>,
    selectedMapsPopup:Set<string>
|};

type Action = {|
    addSelectedMap:(string,string)=>void,
    initLayoutMap:(string,Array<string>)=>void,
    initSelectedMap:(string,Array<string>)=>void,
    initTile:(?string,number,number,number,number,number,number,number,number,Array<number>)=>void,
    moveTile:(string,number,number,number)=>void
|};

type Props = Action & State;

class TabsMapContainer extends Component<Props>{

    componentDidMount(){
        const mappa1 = 'mappa1';
        const mappa2 = 'mappa2';
        const mappa3 = 'mappa3';
        const mappa4 = 'mappa4';
        const {minZoom,maxZoom,defaultZoom,initZoom,width,height,scales} = schema;
        this.props.initTile(mappa1,1500,650,minZoom, maxZoom,defaultZoom,initZoom,width,height,scales);
        this.props.initTile(mappa2,1500,650,minZoom, maxZoom,defaultZoom,initZoom,width,height,scales);
        this.props.initTile(mappa3,1500,650,minZoom, maxZoom,defaultZoom,initZoom,width,height,scales);
        this.props.initTile(mappa4,700,600, minZoom, maxZoom,defaultZoom,initZoom,width,height,scales);
        this.props.initLayoutMap(NAMESPACE_TAB,[mappa1,mappa2,mappa3]);
        this.props.initLayoutMap(NAMESPACE_POPUP,[mappa4]);
        this.props.initSelectedMap(NAMESPACE_TAB,[mappa1,mappa2,mappa3]);
        this.props.addSelectedMap(NAMESPACE_POPUP,mappa4);

    }

    onZoomed = (uuid:string, x:number, y:number, k:number) => {
        this.props.moveTile(uuid,x,y,k);
    }

    render(){
        const {tilesByUuid,viewPortByUuid, selectedMapsTab,selectedMapsPopup,sizeByUuid,scalesByUuid} = this.props;
        return <div>
                <TabsMapPanel 
                    uuids={selectedMapsTab} 
                    viewPortByUuid={viewPortByUuid} 
                    tilesByUuid={tilesByUuid} 
                    onZoomed={this.onZoomed}
                    renderTile={renderTile}
                    scalesByUuid={scalesByUuid}
                    sizeByUuid={sizeByUuid}
                />
                <PopupContainer>
                    <SelectedPlainMapsComponents 
                        selectedMaps={selectedMapsPopup}
                        viewPortByUuid={viewPortByUuid}
                        tilesByUuid={tilesByUuid}
                        sizeByUuid={sizeByUuid}
                        scalesByUuid={scalesByUuid}
                        onZoomed={this.onZoomed}
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
        selectedMapsTab: selectorLayoutMapsTab.getSelectedMaps(state),
        selectedMapsPopup: selectorLayoutMapsPopup.getSelectedMaps(state)
    }
}
export {TabsMapContainer};
export default connect(mapStateToProps,{addSelectedMap,initTile,moveTile,initSelectedMap,initLayoutMap})(TabsMapContainer);
