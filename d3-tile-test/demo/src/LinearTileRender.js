/* eslint react/prop-types: 0 */
/*eslint no-magic-numbers:*/
import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { PlainTileRender } from "../../src/views";
import {
  LINEAR_RENDER_MODALITY,
  getScalesByUuid,
  getMapSizeByUuid,
  getMapsTilesByUuid,
  getRenderModalityByUuid,
  getViewPortSizeByUuid,
  getReferenceSystemScalesByUuid,
  calObjExpScale,
  initMap,
  zoomMap
} from "../../src/modules";

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

const schema = {
  width: 200000,
  height: 100000,
  top: 0,
  left: 0,
  initZoom: 1,
  defaultZoom: 1,
  scales: [0.25, 1, 2, 3, 4]
};

const viewPortWidth = 1280;
const viewPortHeight = 600;
const defaultViewportPosition = [0, 0];
const baseTileUrl = "http://localhost:5000/tiles";
const UUID_PROVA = "Prova";
const renderModality = LINEAR_RENDER_MODALITY;

const urlBuilder = p => {
  return p.baseUrl + "/" + p.zoomIndex + "/" + p.x + "/" + p.y;
};

class LinearTileRender extends React.Component {
  constructor(props) {
    super(props);
    const initExpScale = calObjExpScale(
      renderModality,
      schema.width,
      schema.height,
      schema.defaultZoom
    );
    this.state = {
      viewportObjectPosition: {
        scaledObjectTranslation: [0.5, 0.5],
        viewport: [0, 0],
        objectExpScale: initExpScale
      }
    };
  }

  onZoomed = zoom => {
    if (this.props.zoomMap) {
      this.props.zoomMap(zoom);
    }
  };

  componentDidMount() {
    const defaultExpScale = calObjExpScale(
      renderModality,
      schema.width,
      schema.height,
      schema.defaultZoom
    );
    const initExpScale = defaultExpScale;
    const minExpScale = calObjExpScale(
      renderModality,
      schema.width,
      schema.height,
      schema.scales[0]
    );
    const maxExpScale = calObjExpScale(
      renderModality,
      schema.width,
      schema.height,
      schema.scales[4]
    );
    const init = {
      uuid: UUID_PROVA,
      viewPortWidth,
      viewPortHeight,
      defaultExpScale,
      expScaleOffset: 0,
      initExpScale,
      minExpScale,
      maxExpScale,
      width: schema.width,
      height: schema.height,
      renderModality: LINEAR_RENDER_MODALITY
    };
    this.props.initMap(init);
  }

  render() {
    const tiles = this.props.tiles.get(UUID_PROVA);
    const viewPortSize = this.props.viewPortSize.get(UUID_PROVA);
    const scales = this.props.scales.get(UUID_PROVA);
    const referenceSystem = this.props.referenceSystem.get(UUID_PROVA);
    const renderModality = this.props.renderModality.get(UUID_PROVA);
    const objectSize = this.props.objectSize.get(UUID_PROVA);
    return (
      <Container>
        <MapContainer>
          <PlainTileRender
            uuid={UUID_PROVA}
            width={viewPortSize ? viewPortSize.viewPortWidth : 0}
            height={viewPortSize ? viewPortSize.viewPortHeight : 0}
            top={schema.top}
            left={schema.left}
            viewportObjectPosition={this.state.viewportObjectPosition}
            renderModality={renderModality}
            scales={scales}
            objectSize={objectSize}
            baseTileUrl={baseTileUrl}
            tileUrlBuilder={urlBuilder}
            onZoomed={this.onZoomed}
            tiles={tiles}
          />
        </MapContainer>
        <Controls />
      </Container>
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
    objectSize: getMapSizeByUuid(state)
  };
};

export { LinearTileRender };
export default connect(
  mapStateToProps,
  { zoomMap, initMap }
)(LinearTileRender);
