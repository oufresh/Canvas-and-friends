/*eslint no-magic-numbers:*/
/* eslint react/prop-types: 0 */
import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  LINEAR_RENDER_MODALITY,
  NAMESPACE_LIST,
  NAMESPACE_POPUP,
  addSelectedMap,
  getScalesByUuid,
  getMapSizeByUuid,
  getMapsTilesByUuid,
  getRenderModalityByUuid,
  getViewPortSizeByUuid,
  getReferenceSystemScalesByUuid,
  calObjExpScale,
  initLayoutMap,
  initMap,
  zoomMap
} from "../../src/modules";

import {
  selectorLayoutMapsList,
  selectorLayoutMapsPopup
} from "./store/reducers";
import { SelectedPlainMapsComponents } from "./components/SelectedPlainMapsComponents";

const ListContainer = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  display: flex;
  border: 2px solid green;
`;

const PopupContainer = styled.div`
  z-index: 1000;
  background-color: #f1f1f1;
  border: 2px solid red;
  position: absolute;
  top: 50px;
  left: 300px;
  display: block;
  width: 705px;
  height: 605px;
`;

const schema = {
  width: 200000,
  height: 100000,
  initZoom: 1,
  defaultZoom: 1,
  minZoom: 0.25,
  maxZoom: 4
};

const viewPortWidth = 700;
const viewPortHeight = 600;

class MapsContainer extends Component {
  componentDidMount() {
    const mappa1 = "mappa1";
    const mappa2 = "mappa2";
    const mappa3 = "mappa3";

    const { defaultZoom, width, height } = schema;

    const defaultExpScale = calObjExpScale(
      LINEAR_RENDER_MODALITY,
      width,
      height,
      defaultZoom
    );
    const initExpScale = defaultExpScale;
    const minExpScale = calObjExpScale(
      LINEAR_RENDER_MODALITY,
      width,
      height,
      schema.minZoom
    );
    const maxExpScale = calObjExpScale(
      LINEAR_RENDER_MODALITY,
      width,
      height,
      schema.maxZoom
    );

    this.viewportObjectPosition = {
      scaledObjectTranslation: [0.5, 0.5],
      viewport: [0, 0],
      objectExpScale: initExpScale
    };

    const init1 = {
      uuid: mappa1,
      viewPortWidth,
      viewPortHeight,
      expScaleOffset: 0,
      defaultExpScale,
      initExpScale,
      minExpScale,
      maxExpScale,
      width,
      height,
      renderModality: LINEAR_RENDER_MODALITY
    };
    const init2 = { ...init1, uuid: mappa2 };
    const init3 = { ...init1, uuid: mappa3 };

    this.props.initMap(init1);
    this.props.initMap(init2);
    this.props.initMap(init3);
    this.props.initLayoutMap({
      namespace: NAMESPACE_LIST,
      uuids: [mappa1, mappa2]
    });
    this.props.initLayoutMap({
      namespace: NAMESPACE_POPUP,
      uuids: [mappa3]
    });
    this.props.addSelectedMap({ namespace: NAMESPACE_LIST, uuid: mappa1 });
    this.props.addSelectedMap({ namespace: NAMESPACE_LIST, uuid: mappa2 });
    this.props.addSelectedMap({ namespace: NAMESPACE_POPUP, uuid: mappa3 });
  }

  onZoomed = zoom => {
    this.props.zoomMap(zoom);
  };

  render() {
    const {
      tiles,
      viewPortSize,
      selectedMapsList,
      selectedMapsPopup,
      scales,
      renderModality,
      objectSizes,
      referenceSystem
    } = this.props;
    return (
      <div>
        <ListContainer>
          <SelectedPlainMapsComponents
            selectedMaps={selectedMapsList}
            viewPortByUuid={viewPortSize}
            tilesByUuid={tiles}
            scalesByUuid={scales}
            onZoomed={this.onZoomed}
            renderModalityByUuid={renderModality}
            viewportObjectPosition={this.viewportObjectPosition}
            objectSizes={objectSizes}
          />
        </ListContainer>
        <PopupContainer>
          <SelectedPlainMapsComponents
            selectedMaps={selectedMapsPopup}
            viewPortByUuid={viewPortSize}
            tilesByUuid={tiles}
            scalesByUuid={scales}
            onZoomed={this.onZoomed}
            renderModalityByUuid={renderModality}
            viewportObjectPosition={this.viewportObjectPosition}
            objectSizes={objectSizes}
          />
        </PopupContainer>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    tiles: getMapsTilesByUuid(state),
    viewPortSize: getViewPortSizeByUuid(state),
    scales: getScalesByUuid(state),
    referenceSystem: getReferenceSystemScalesByUuid(state),
    renderModality: getRenderModalityByUuid(state),
    objectSizes: getMapSizeByUuid(state),
    selectedMapsList: selectorLayoutMapsList.getSelectedMaps(state),
    selectedMapsPopup: selectorLayoutMapsPopup.getSelectedMaps(state)
  };
};
export { MapsContainer };
export default connect(
  mapStateToProps,
  { initMap, zoomMap, addSelectedMap, initLayoutMap }
)(MapsContainer);
