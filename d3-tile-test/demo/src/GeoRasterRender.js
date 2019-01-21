/*eslint no-magic-numbers:*/
/* eslint react/prop-types: 0 */
import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import { GeoTileRender } from "../../src/views";
import {
  getMapsTilesByUuid,
  getViewPortSizeByUuid,
  getScalesByUuid,
  getMercatorProjection,
  getRenderModalityByUuid,
  zoomMap,
  initMap,
  getReferenceSystemScalesByUuid,
  GEO_RENDER_MODALITY
} from "../../src/modules";

const MapContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

const viewPortWidth = 1280;
const viewPortHeight = 600;

const defaultCenter = [9, 45];
const defaultScaleExtent = [1 << 8, 1 << 18];
const defaultInitScale = 1 << 14;

function calculateCenter(center) {
  const projection = getMercatorProjection();
  const p = projection(center);
  return [-p[0], -p[1]];
}

function urlBuilder(p) {
  return "http://" + "abc"[p.x % 3] + ".tile.openstreetmap.org/" + p.zoomIndex + "/" + p.x + "/" + p.y + ".png";
}

class GeoRasterRender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewportObjectPosition: {
        scaledObjectTranslation: calculateCenter(defaultCenter),
        viewport: [0, 0],
        objectExpScale: defaultInitScale
      }
    };
  }

  onZoomed = zoom => {
    if (this.props.zoomMap) {
      this.props.zoomMap(zoom);
    }
  };

  componentDidMount() {
    this.props.initMap({
      uuid: "Prova",
      viewPortWidth,
      viewPortHeight,
      defaultExpScale: defaultInitScale,
      expScaleOffset: 0,
      initExpScale: defaultInitScale,
      minExpScale: defaultScaleExtent[0],
      maxExpScale: defaultScaleExtent[1],
      renderModality: GEO_RENDER_MODALITY
    });
  }

  render() {
    const tiles = this.props.tiles.get("Prova");
    const viewPortSize = this.props.viewPortSize.get("Prova");
    const renderModality = this.props.renderModality.get("Prova");
    const scales = this.props.scales.get("Prova");
    return (
      <MapContainer>
        <GeoTileRender
          height={viewPortSize ? viewPortSize.viewPortHeight : 0}
          viewportObjectPosition={this.state.viewportObjectPosition}
          onZoomed={this.onZoomed}
          renderModality={renderModality}
          baseTileUrl={""}
          tileUrlBuilder={urlBuilder}
          scales={scales}
          tiles={tiles}
          uuid={"Prova"}
          width={viewPortSize ? viewPortSize.viewPortWidth : 0}
        />
      </MapContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    tiles: getMapsTilesByUuid(state),
    viewPortSize: getViewPortSizeByUuid(state),
    scales: getScalesByUuid(state),
    referenceSystem: getReferenceSystemScalesByUuid(state),
    renderModality: getRenderModalityByUuid(state)
  };
};

export { GeoRasterRender };
export default connect(
  mapStateToProps,
  { zoomMap, initMap }
)(GeoRasterRender);
