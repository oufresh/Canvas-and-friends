//@flow
/* eslint react/prop-types: 0 */
/*eslint no-magic-numbers:*/
import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { debounce } from "lodash";

import { PlainTileRender } from "../../src/views";
import { getBrowser } from "./brwoser";
import {
  EXP_RENDER_MODALITY,
  getScalesByUuid,
  getMapSizeByUuid,
  getMapsTilesByUuid,
  getRenderModalityByUuid,
  getViewPortSizeByUuid,
  initMap,
  zoomMap,
  resizeMap,
  calObjExpScale,
  getMapIntegerScalesArrayByUuid,
  getReferenceSystemScalesByUuid,
  moveMap,
  getViewportObjectPositionByUuid,
  calcCoordsforTiles,
  convertCoordsForTiles,
  calcObjectTranslation,
  isSchemaEndByUuid,
  getSchemaBoundaryByUuid,
  getMapsTilesCacheByUuid,
  MapTileCache
} from "../../src/modules";

import { getStTilePromise } from "./getTilePromise";

import { ScaleSelector, ZoomScaleInfo } from "../../src/views/scaleSelector";

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
`;

const MapContainerStyle = {
  position: "relative",
  flexGrow: 1
};

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 300px;
`;

const ZoomScaleInfoContainer = styled.div`
  position: absolute;
  bottom: 1px;
  right: 1px;
`;

const ScaleSelectorContainer = styled.div`
  position: absolute;
  bottom: 0px;
`;

const WIDTH = 52572;
const HEIGHT = 44016;
const UUID_PROVA = "Prova";

const baseUrl =
  "http://localhost:3000/schematica/rest/schematica/schemi/tile/ST/ST/REALE/TOPOLOGICO_MT/none/none/Monocromatico";

const tileUrlBuilder = ({ baseUrl, width, height, x, y, zoomIndex }) => {
  return `${baseUrl}/${width}/${height}/${zoomIndex}/${x}/${y}?id=none&infoDAL=none&codApp=none`;
};

class ExpScaleMapRender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 2,
      coords: [0, 0],
      scaleTo: null
    };
    this.ref = React.createRef();
    this.onClickFilter = this.onClickFilter.bind(this);
    this.onSelectedScale = this.onSelectedScale.bind(this);
  }

  onZoomed = zoom => {
    if (this.props.zoomMap) {
      this.props.zoomMap(zoom);
    }
  };

  componentDidMount() {
    //console.log("didiMount ExpScaleMapRender");

    window.addEventListener(
      "resize",
      debounce(() => {
        //console.log("end resize");
        const rect = this.ref.current
          ? this.ref.current.getBoundingClientRect()
          : { width: 1280, height: 600 };
        this.props.resizeMap({
          uuid: UUID_PROVA,
          viewPortWidth: rect.width,
          viewPortHeight: rect.height
        });
      }, 500)
    );

    const defaultExpScale = calObjExpScale(
      EXP_RENDER_MODALITY,
      WIDTH,
      HEIGHT,
      2,
      2
    );
    const minExpScale = calObjExpScale(
      EXP_RENDER_MODALITY,
      WIDTH,
      HEIGHT,
      4.49,
      2
    );
    const maxExpScale = calObjExpScale(
      EXP_RENDER_MODALITY,
      WIDTH,
      HEIGHT,
      -0.49,
      2
    );
    const initExpScale = calObjExpScale(
      EXP_RENDER_MODALITY,
      WIDTH,
      HEIGHT,
      2,
      2
    );

    const rect = this.ref.current
      ? this.ref.current.getBoundingClientRect()
      : { width: 1280, height: 600 };

    /*const initObjectPosition = calcObjectTranslation(
      EXP_RENDER_MODALITY,
      [0, 0],
      WIDTH,
      HEIGHT,
      initExpScale
    );*/

    const initObjectPosition = calcObjectTranslation(
      EXP_RENDER_MODALITY,
      [WIDTH / 2, HEIGHT / 2],
      WIDTH,
      HEIGHT,
      initExpScale
    );

    //console.log(initObjectPosition);

    const init = {
      uuid: UUID_PROVA,
      defaultExpScale,
      expScaleOffset: 2,
      height: HEIGHT,
      initExpScale,
      maxExpScale,
      minExpScale,
      renderModality: EXP_RENDER_MODALITY,
      viewPortHeight: rect.height,
      viewPortWidth: rect.width,
      width: WIDTH,
      objectExpScale: initExpScale,
      scaledObjectTranslationX: initObjectPosition[0],
      scaledObjectTranslationY: initObjectPosition[1],
      viewPortTranslationX: 0,
      viewPortTranslationY: 0,
      objectPosition: [WIDTH / 2, HEIGHT / 2],
      baseTileServiceurl: baseUrl,
      tileExpiration: 60000
    };
    this.props.initMap(init);
  }

  onSelectedScale(uuid, stScale) {
    if (this.props.moveMap) {
      const tiles = this.props.tiles.get(uuid);
      const viewPortSize = this.props.viewPortSize.get(uuid);
      const scales = this.props.scales.get(uuid);
      const objectSize = this.props.objectSizeMap.get(uuid);
      const renderModality = this.props.renderModality.get(uuid);
      const refSystemScales = this.props.refSystemScalesMap.get(UUID_PROVA);

      const viewportPosition = [
        viewPortSize.viewPortWidth / 2,
        viewPortSize.viewPortHeight / 2
      ];

      const origCentr = calcCoordsforTiles(
        EXP_RENDER_MODALITY,
        viewportPosition,
        tiles.scale,
        tiles.translate[0],
        tiles.translate[1]
      );

      const schemaPosition = convertCoordsForTiles(
        refSystemScales.currentScaleInt,
        refSystemScales.defaultScale,
        origCentr
      );

      const newObjectPosition = calcObjectTranslation(
        renderModality,
        schemaPosition,
        objectSize.width,
        objectSize.height,
        scales.defaultExpScale
      );

      const objectExpScale = calObjExpScale(
        EXP_RENDER_MODALITY,
        objectSize.width,
        objectSize.height,
        stScale,
        refSystemScales.defaultScale
      );

      this.props.moveMap({
        uuid,
        objectExpScale,
        scaledObjectTranslationX: newObjectPosition[0],
        scaledObjectTranslationY: newObjectPosition[1],
        viewPortTranslationX: viewportPosition[0],
        viewPortTranslationY: viewportPosition[1],
        objectPosition: schemaPosition
      });

      //this.setState({ scaleTo: objectExpScale });
    }
  }

  //componentDidUpdate(prevProps) {}

  onMouseMove = mousePos => {
    const tiles = this.props.tiles.get(UUID_PROVA);
    const refSystemScales = this.props.refSystemScalesMap.get(UUID_PROVA);
    const sc = refSystemScales ? refSystemScales.currentScaleInt : 0;

    //console.log(refSystemScales);

    if (tiles && tiles.length > 0) {
      const origCoords = calcCoordsforTiles(
        EXP_RENDER_MODALITY,
        mousePos,
        tiles.scale,
        tiles.translate[0],
        tiles.translate[1]
      );

      const coords = convertCoordsForTiles(
        sc,
        refSystemScales.defaultScale,
        origCoords
      );

      this.setState({ coords });
    }
  };

  onDoubleClickFilter = path => {
    const element = path.reduce((pt, ct) => {
      if (ct.dataset && ct.dataset.element) {
        const dataElement = JSON.parse(ct.dataset.element);
        if (dataElement.tipo_elem == 2 && dataElement.codice_sg_valid == true)
          return ct;
      }
      return null;
    });
    if (element) {
      alert(element.dataset.element);
      return false;
    } else return true;
  };

  onClickFilter(path) {
    const element = path.reduce((pt, ct) => {
      if (ct.dataset && ct.dataset.element) {
        const dataElement = JSON.parse(ct.dataset.element);
        if (dataElement.tipo_elem == 0 && dataElement.codice_sg_valid == true)
          return ct;
      }
      return null;
    });
    if (element) {
      alert(element.dataset.element);
      return false;
    } else return true;
  }

  onGoToTop = () => {
    const objectSize = this.props.objectSizeMap.get(UUID_PROVA);
    const scales = this.props.scales.get(UUID_PROVA);
    const newObjectPosition = calcObjectTranslation(
      EXP_RENDER_MODALITY,
      [0, 0],
      objectSize.width,
      objectSize.height,
      scales.defaultExpScale
    );

    this.props.moveMap({
      uuid: UUID_PROVA,
      objectExpScale: scales.currentExpScale,
      scaledObjectTranslationX: newObjectPosition[0],
      scaledObjectTranslationY: newObjectPosition[1],
      viewPortTranslationX: 0,
      viewPortTranslationY: 0,
      objectPosition: [0, 0]
    });
  };

  onGoToMiddle = () => {
    const objectSize = this.props.objectSizeMap.get(UUID_PROVA);
    const scales = this.props.scales.get(UUID_PROVA);
    const newObjectPosition = calcObjectTranslation(
      EXP_RENDER_MODALITY,
      [objectSize.width / 2, objectSize.height / 2],
      objectSize.width,
      objectSize.height,
      scales.defaultExpScale
    );

    this.props.moveMap({
      uuid: UUID_PROVA,
      objectExpScale: scales.currentExpScale,
      scaledObjectTranslationX: newObjectPosition[0],
      scaledObjectTranslationY: newObjectPosition[1],
      viewPortTranslationX: 0,
      viewPortTranslationY: 0,
      objectPosition: [objectSize.width / 2, objectSize.height / 2]
    });
  };

  onGoToEnd = () => {
    const objectSize = this.props.objectSizeMap.get(UUID_PROVA);
    const scales = this.props.scales.get(UUID_PROVA);
    const viewPortSize = this.props.viewPortSize.get(UUID_PROVA);

    const newObjectPosition = calcObjectTranslation(
      EXP_RENDER_MODALITY,
      [objectSize.width - 1, objectSize.height - 1],
      objectSize.width,
      objectSize.height,
      scales.defaultExpScale
    );

    this.props.moveMap({
      uuid: UUID_PROVA,
      objectExpScale: scales.currentExpScale,
      scaledObjectTranslationX: newObjectPosition[0],
      scaledObjectTranslationY: newObjectPosition[1],
      viewPortTranslationX: viewPortSize.viewPortWidth - 1,
      viewPortTranslationY: viewPortSize.viewPortHeight,
      objectPosition: [objectSize.width - 1, objectSize.height]
    });
  };

  render() {
    const tiles = this.props.tiles.get(UUID_PROVA);
    const viewPortSize = this.props.viewPortSize.get(UUID_PROVA);
    const scales = this.props.scales.get(UUID_PROVA);
    const renderModality = this.props.renderModality.get(UUID_PROVA);
    const objectSize = this.props.objectSizeMap.get(UUID_PROVA);
    const integerScales = this.props.integerScalesMap.get(UUID_PROVA)
      ? this.props.integerScalesMap.get(UUID_PROVA)
      : [0];
    const refSystemScales = this.props.refSystemScalesMap.get(UUID_PROVA);
    const viewportObjectPosition = this.props.viewportObjectPositionMap.get(
      UUID_PROVA
    );

    const schemaEnd = this.props.schemaEndByUuid.get(UUID_PROVA);
    const schemaBoundary = this.props.schemaBoundary.get(UUID_PROVA);
    const tileCache: MapTileCache = this.props.tileCacheByUuid.get(UUID_PROVA);

    return (
      <Container>
        <div style={MapContainerStyle} ref={this.ref}>
          <PlainTileRender
            uuid={UUID_PROVA}
            width={viewPortSize ? viewPortSize.viewPortWidth : 0}
            height={viewPortSize ? viewPortSize.viewPortHeight : 0}
            tiles={tiles}
            scales={scales}
            onZoomed={this.onZoomed}
            viewportObjectPosition={viewportObjectPosition}
            renderModality={renderModality}
            objectSize={objectSize}
            onMouseMove={this.onMouseMove}
            baseTileUrl={baseUrl}
            tileUrlBuilder={tileUrlBuilder}
            tilePromise={getStTilePromise}
            onDoubleClickFilter={this.onDoubleClickFilter}
            onClickFilter={this.onClickFilter}
            referenceSystemScales={refSystemScales}
            schemaEnd={schemaEnd}
            schemaBoundary={schemaBoundary}
            tileCache={tileCache}
          />
          <ScaleSelectorContainer>
            <ScaleSelector
              uuid={UUID_PROVA}
              top={viewPortSize ? viewPortSize.viewPortHeight : 0}
              selectedScale={
                refSystemScales ? refSystemScales.currentScaleInt : 0
              }
              scales={integerScales}
              visible={true}
              onClick={this.onSelectedScale}
            />
          </ScaleSelectorContainer>
          <ZoomScaleInfoContainer>
            <ZoomScaleInfo
              left={viewPortSize ? viewPortSize.viewPortWidth : 0}
              top={viewPortSize ? viewPortSize.viewPortHeight : 0}
              scalesSize={integerScales.length}
              scaleMin={refSystemScales ? refSystemScales.minScale : 0}
              scaleCurrentDecimal={
                refSystemScales ? refSystemScales.currentScale : 0
              }
            />
          </ZoomScaleInfoContainer>
        </div>
        <Controls>
          <div>
            <label>Schema x: </label>
            <label>
              {isNaN(this.state.coords[0]) ? 0 : this.state.coords[0]}
            </label>
          </div>
          <div>
            <label>Schema y: </label>
            <label>
              {isNaN(this.state.coords[1]) ? 0 : this.state.coords[1]}
            </label>
          </div>
          <button onClick={this.onGoToTop}>GoTo top</button>
          <button onClick={this.onGoToMiddle}>GoTo middle</button>
          <button onClick={this.onGoToEnd}>GoTo end</button>
        </Controls>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    tiles: getMapsTilesByUuid(state),
    viewPortSize: getViewPortSizeByUuid(state),
    scales: getScalesByUuid(state),
    objectSizeMap: getMapSizeByUuid(state),
    renderModality: getRenderModalityByUuid(state),
    integerScalesMap: getMapIntegerScalesArrayByUuid(state),
    refSystemScalesMap: getReferenceSystemScalesByUuid(state),
    viewportObjectPositionMap: getViewportObjectPositionByUuid(state),
    browser: getBrowser(state),
    schemaEndByUuid: isSchemaEndByUuid(state),
    schemaBoundary: getSchemaBoundaryByUuid(state),
    tileCacheByUuid: getMapsTilesCacheByUuid(state)
  };
};

export { ExpScaleMapRender };
export default connect(
  mapStateToProps,
  { zoomMap, initMap, moveMap, resizeMap }
)(ExpScaleMapRender);
