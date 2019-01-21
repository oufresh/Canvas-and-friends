//@flow
/* eslint-disable no-alert, no-console */
import React from "react";
import { select, event } from "d3-selection";
import { zoom as d3Zoom } from "d3-zoom";
import { SvgDiv, LayerGroup, ReactVisible } from "../commons";
import { moveRenderTo, moveTo } from "../schemaMovements";
import { doubleClickFilter } from "../events";
import { getMousePos } from "../../modules/maps/utils/mouse";
import { type ZoomMap, type ZoomTransform } from "../../modules/maps";
import {
  type Scales,
  type ViewportObjectPosition,
  type RefObject,
  type MapSize
} from "../../types";
import { ArrowUp, ArrowRight, ArrowBottom, ArrowLeft } from "../arrows";
import { type SchemaBoundary } from "../../modules";
import { DEFAULT_SINGLE_SCHEMA_SHIFT } from "../../modules/maps/utils/constants";

const svgCanvasStyle = {
  position: "absolute",
  top: "0px",
  left: "0px",
  width: "100%",
  height: "100%",
  userSelect: "none"
};

export type SvgRenderPropsType = {
  uuid: string,
  width: number,
  height: number,
  top?: number,
  left?: number,
  transform: ZoomTransform,
  translateExtent?: Array<Array<number>>,
  onZoomed: ZoomMap => any,
  scales: Scales,
  viewportObjectPosition: ViewportObjectPosition, //posizionamento
  svgContent: string,
  onDoubleClickFilter?: (Array<HTMLElement>) => boolean,
  onMouseMove: (Array<number>) => any,
  objectSize: MapSize,
  schemaBoundary: SchemaBoundary,
  enableButtonMovement?: boolean
};

export class SvgRender extends React.Component<SvgRenderPropsType> {
  svgRef: RefObject;
  svg: Object;
  zoom: Object;

  constructor(props: SvgRenderPropsType) {
    super(props);
    this.svgRef = React.createRef();
  }

  /**
   *
   */
  zoomed = () => {
    const transform = event.transform;
    const { onZoomed, uuid } = this.props;
    onZoomed({
      uuid,
      x: transform.x,
      y: transform.y,
      currentExpScale: transform.k
    });
  };

  initZoom() {
    const { scales, objectSize } = this.props;
    let scaleExtent: Array<number> = [scales.minExpScale, scales.maxExpScale];
    this.svg = select(this.svgRef.current);
    const { onDoubleClickFilter } = this.props;

    const filter = () => {
      if (event.type === "dblclick") {
        //console.log("filter");
        const path = doubleClickFilter(event);
        if (onDoubleClickFilter && path.length > 0) onDoubleClickFilter(path);
      } else return !event.button;
    };

    this.zoom = d3Zoom()
      .translateExtent([[0, 0], [objectSize.width, objectSize.height]])
      .scaleExtent(scaleExtent)
      .filter(filter)
      .on("zoom", this.zoomed);

    this.svg.call(this.zoom);
  }

  setPosition() {
    //se voglio spostare il punto nella viewport teniamo conto che l'origine è
    //in alto a sinistra
    const { viewportObjectPosition } = this.props;

    /*console.log("-----TileRender positioning----");
    console.log(viewportObjectPosition);
    console.log("-------------------------------");*/

    moveRenderTo(
      this.svg,
      this.zoom,
      viewportObjectPosition.scaledObjectTranslation[0],
      viewportObjectPosition.scaledObjectTranslation[1],
      viewportObjectPosition.viewport[0],
      viewportObjectPosition.viewport[1],
      viewportObjectPosition.objectExpScale
    );
  }

  //per ora non li mettiamo, vediamo poi le esigenze, callback passata daSvgCanvas
  onMouseMove = (e: SyntheticMouseEvent<HTMLElement>) => {
    const pos = getMousePos(e, this.svgRef.current);
    if (this.props.onMouseMove) {
      this.props.onMouseMove(pos);
    }
  };

  componentDidMount() {
    this.initZoom();
    this.setPosition();
  }

  componentWillUnmount() {
    this.zoom.on("zoom", null);
    this.svg.on(".zoom", null);
  }

  componentDidUpdate(prevProps: SvgRenderPropsType) {
    const { viewportObjectPosition /*, transform*/ } = this.props;
    //const { transform } = this.props;
    /*const currentObjectPosition = calcCoords(
      viewportObjectPosition.viewport[0],
      viewportObjectPosition.viewport[1],
      transform.transformX,
      transform.transformY,
      transform.currentExpScale
    );*/
    /*if (
      currentObjectPosition[0] !== viewportObjectPosition.objectPosition[0] ||
      currentObjectPosition[1] !== viewportObjectPosition.objectPosition[1]
    )
      this.setPosition();*/
    //console.log(viewportObjectPosition != prevProps.viewportObjectPosition);
    if (
      viewportObjectPosition &&
      viewportObjectPosition !== prevProps.viewportObjectPosition &&
      viewportObjectPosition.scaledObjectTranslation[0] !== prevProps.viewportObjectPosition.scaledObjectTranslation[0] &&
      viewportObjectPosition.scaledObjectTranslation[1] !== prevProps.viewportObjectPosition.scaledObjectTranslation[1]
    ) {
      moveTo(
        this.svg,
        this.zoom,
        viewportObjectPosition.scaledObjectTranslation[0],
        viewportObjectPosition.scaledObjectTranslation[1]
      );
    } /*else if (
      (viewportObjectPosition.scaledObjectTranslation[0] !==
        prevProps.viewportObjectPosition.scaledObjectTranslation[0] ||
        viewportObjectPosition.viewport[0] !==
          prevProps.viewportObjectPosition.viewport[0] ||
        viewportObjectPosition.scaledObjectTranslation[1] !==
          prevProps.viewportObjectPosition.scaledObjectTranslation[1] ||
        viewportObjectPosition.viewport[1] !==
          prevProps.viewportObjectPosition.viewport[1]) &&
      viewportObjectPosition.objectExpScale !==
        prevProps.viewportObjectPosition.objectExpScale
    ) {
      this.setPosition();
    }*/
  }

  hideArrow(direction: string) {
    if (
      direction === "up" &&
      this.props.schemaBoundary !== undefined &&
      this.props.schemaBoundary.top >= 0
    ) {
      return false;
    } else if (
      direction === "right" &&
      this.props.schemaBoundary !== undefined &&
      this.props.schemaBoundary.right <= 0
    ) {
      return false;
    } else if (
      direction === "bottom" &&
      this.props.schemaBoundary !== undefined &&
      this.props.schemaBoundary.bottom <= 0
    ) {
      return false;
    } else if (
      direction === "left" &&
      this.props.schemaBoundary !== undefined &&
      this.props.schemaBoundary.left >= 0
    ) {
      return false;
    }
    return true;
  }

  moveSchema = (direction: string) => {
    const { schemaBoundary } = this.props;

    const translation = [0, 0];
    if (direction === "up") {
      translation[1] = Math.min(
        DEFAULT_SINGLE_SCHEMA_SHIFT,
        Math.abs(schemaBoundary.top)
      );
    } else if (direction === "right") {
      translation[0] = -Math.min(
        DEFAULT_SINGLE_SCHEMA_SHIFT,
        Math.abs(schemaBoundary.right)
      );
    } else if (direction === "bottom") {
      translation[1] = -Math.min(
        DEFAULT_SINGLE_SCHEMA_SHIFT,
        Math.abs(schemaBoundary.bottom)
      );
    } else if (direction === "left") {
      translation[0] = Math.min(
        DEFAULT_SINGLE_SCHEMA_SHIFT,
        Math.abs(schemaBoundary.left)
      );
    }

    this.zoom.translateBy(this.svg, translation[0], translation[1]);
  };

  render() {
    const { transform } = this.props;
    const svgContent = transform ? this.props.svgContent : "";
    const enableButtonMovement =
      this.props.enableButtonMovement !== undefined
        ? this.props.enableButtonMovement
        : false;
    return (
      <SvgDiv
        width={this.props.width}
        height={this.props.height}
        top={this.props.top ? this.props.top : 0}
        left={this.props.left ? this.props.left : 0}
      >
        <svg
          width={this.props.width}
          height={this.props.height}
          ref={this.svgRef}
          style={svgCanvasStyle}
          onMouseMove={this.onMouseMove}
        >
          <LayerGroup transform={transform} svgContent={svgContent} />
        </svg>
        <ReactVisible visible={enableButtonMovement && this.hideArrow("up")}>
          <ArrowUp
            top={0}
            left={this.props.width}
            onClick={() => this.moveSchema("up")}
          />
        </ReactVisible>
        <ReactVisible visible={enableButtonMovement && this.hideArrow("right")}>
          <ArrowRight
            top={this.props.height}
            left={this.props.width}
            onClick={() => this.moveSchema("right")}
          />
        </ReactVisible>
        <ReactVisible
          visible={enableButtonMovement && this.hideArrow("bottom")}
        >
          <ArrowBottom
            top={this.props.height}
            left={this.props.width}
            onClick={() => this.moveSchema("bottom")}
          />
        </ReactVisible>
        <ReactVisible visible={enableButtonMovement && this.hideArrow("left")}>
          <ArrowLeft
            top={this.props.height}
            left={0}
            onClick={() => this.moveSchema("left")}
          />
        </ReactVisible>
      </SvgDiv>
    );
  }
}
