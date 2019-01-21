/* eslint react/prop-types: 0 */
/* eslint-disable no-alert, no-console */
import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import { SingleSvg } from "../../src/views";
import {
  zoomMap,
  initMap,
  moveMap,
  SINGLE_LINEAR_RENDER_MODALITY,
  getViewPortSizeByUuid,
  getScalesByUuid,
  getMapSizeByUuid,
  getMapTransformByUuid,
  isReadyByUuid,
  calcCoords,
  getViewportObjectPositionByUuid,
  getSchemaBoundaryByUuid,
  calcSingleObjectTranslation,
  getRenderModalityByUuid
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
  flex-direction: column;
  justify-content: flex-start;
  flex-grow: 1;
`;

const schema = {
  width: 1000,
  height: 500,
  top: 0,
  left: 0,
  initZoom: 1,
  defaultZoom: 1,
  minZoom: 0.25,
  maxZoom: 4,
  svgContent:
    "<g>" +
    '<rect x="0" y="0" width="1000" height="500" style="fill:rgb(200,200,200);"/>' +
    '<rect x="50" y="110" width="100" height="200" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)"/>' +
    '<rect x="499" y="249" width="2" height="2" style="fill:rgb(255,0,0);stroke-width:1;stroke:rgb(255,0,0)"/>' +
    '<circle data-id="2" data-code="34GG55" cx="80" cy="130" r="40" stroke="black" stroke-width="3" fill="red" />' +
    "</g>"
};

const viewPortWidth = 1280;
const viewPortHeight = 600;
const defaultObjectPosition = [0, 0]; //non c'è bisogno di scalarlo come nell tiles!!
const defaultViewportPosition = [0, 0];
const defaultObjectScale = 1;
const expScaleBase = 2;
const UUID_PROVA = "Prova";

class SingleSvgRender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coords: [0, 0],
      x: 0,
      y: 0,
      objPos: [0, 0]
    };
  }

  onZoomed = zoom => {
    if (this.props.zoomMap) {
      this.props.zoomMap(zoom);
    }
  };

  onTestPos = () => {
    const transform = this.props.transforms.get("Prova");
    const viewPortSize = this.props.viewPortSize.get("Prova");

    /*const ot = calcObjectTranslation(
      renderModality,
      pos,
      size.width,
      size.height,
      transform.currentExpScale
    );*/

    //punto che sta sotto il centro della viewport
    //alla scala attuale, rappresenta la differenza rispetto al centro
    /*const p = calcCoords(
      viewPortSize.viewPortWidth / 2,
      viewPortSize.viewPortHeight / 2,
      0,
      0,
      transform.currentExpScale
    );*/

    const objPos = calcSingleObjectTranslation(
      SINGLE_LINEAR_RENDER_MODALITY,
      [this.state.x, this.state.y],
      viewPortSize.viewPortWidth,
      viewPortSize.viewPortHeight,
      transform.currentExpScale
    );

    const newViewportObjectPosition = {
      uuid: "Prova",
      scaledObjectTranslationX: objPos[0],
      scaledObjectTranslationY: objPos[1],
      viewPortTranslationX: 0,
      viewPortTranslationY: 0,
      objectExpScale: transform.currentExpScale,
      objectPosition: [this.state.x, this.state.y]
    };

    //const objPos = [p[0] + this.state.x, p[1] + this.state.y];
    //this.setState({ objPos });

    this.props.moveMap(newViewportObjectPosition);
  };

  onMouseMove = pos => {
    const transform = this.props.transforms.get("Prova");
    const coords = calcCoords(
      pos[0],
      pos[1],
      transform.transformX,
      transform.transformY,
      transform.currentExpScale
    );
    this.setState({ coords });
  };

  onDoubleClickFilter = target => {
    if (target.dataset && target.dataset.id === "2") {
      alert(target.dataset.code);
      return true;
    }

    return false;
  };

  onChangeX = e => {
    const x = parseInt(e.target.value);
    if (!isNaN(x)) {
      this.setState({ x });
    }
  };

  onChangeY = e => {
    const y = parseInt(e.target.value);
    if (!isNaN(y)) {
      this.setState({ y });
    }
  };

  componentDidMount() {
    this.props.initMap({
      uuid: UUID_PROVA,
      viewPortWidth,
      viewPortHeight,
      defaultExpScale: schema.defaultZoom,
      initExpScale: schema.initZoom,
      width: schema.width,
      height: schema.height,
      minExpScale: schema.minZoom,
      maxExpScale: schema.maxZoom,
      renderModality: SINGLE_LINEAR_RENDER_MODALITY
    });
  }

  render() {
    const viewPortSize = this.props.viewPortSize.get("Prova");
    const transform = this.props.transforms.get("Prova");
    const scale = this.props.scales.get("Prova");
    const size = this.props.sizes.get("Prova");
    const viewportObjectPosition = this.props.viewportObjectPositionMap.get(
      "Prova"
    );
    const schemaBoundary = this.props.schemaBoundary.get("Prova");

    return (
      <Container>
        <MapContainer>
          <SingleSvg
            uuid="Prova"
            width={viewPortSize ? viewPortSize.viewPortWidth : 0}
            height={viewPortSize ? viewPortSize.viewPortHeight : 0}
            top={schema.top}
            left={schema.left}
            transform={transform}
            svgContent={schema.svgContent}
            onZoomed={this.onZoomed}
            viewportObjectPosition={viewportObjectPosition}
            scales={scale}
            onMouseMove={this.onMouseMove}
            onDoubleClickFilter={this.onDoubleClickFilter}
            objectSize={size}
            enableButtonMovement={true}
            schemaBoundary={schemaBoundary}
          />
        </MapContainer>
        <Controls>
          <div>
            <label>Fattore:</label>
            <label>{scale ? expScaleBase / scale.currentExpScale : 0}</label>
          </div>
          <div>
            <label>MouseX</label>
            <label>{this.state.coords[0]}</label>
          </div>
          <div>
            <label>MouseY</label>
            <label>{this.state.coords[1]}</label>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid black",
              padding: "2px"
            }}
          >
            <label style={{ textAlign: "center" }}>Test posizionamento</label>
            <div>
              <label>ObjX</label>
              <input onChange={this.onChangeX} value={this.state.x} />
            </div>
            <div>
              <label>ObjY</label>
              <input onChange={this.onChangeY} value={this.state.y} />
            </div>
            <button onClick={this.onTestPos}>Go</button>
          </div>
        </Controls>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    viewPortSize: getViewPortSizeByUuid(state),
    scales: getScalesByUuid(state),
    sizes: getMapSizeByUuid(state),
    transforms: getMapTransformByUuid(state),
    isReady: isReadyByUuid(state),
    viewportObjectPositionMap: getViewportObjectPositionByUuid(state),
    schemaBoundary: getSchemaBoundaryByUuid(state),
    renderModalityMap: getRenderModalityByUuid(state)
  };
};

export { SingleSvgRender };
export default connect(
  mapStateToProps,
  { zoomMap, initMap, moveMap }
)(SingleSvgRender);
