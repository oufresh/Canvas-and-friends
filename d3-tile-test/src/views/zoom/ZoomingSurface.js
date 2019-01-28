//@flow
import * as React from "react";
import { select, event } from "d3-selection";
import { zoom as d3Zoom, zoomIdentity } from "d3-zoom";
import { ReactVisible } from "../commons";
import { transformToString } from "../transforms";
import { calcCoords } from "../../modules/maps/utils/coordinates";
import { getMousePos } from "../../modules/maps/utils/mouse";
import { type ZoomBehaviourTransform } from "../../types";
import { ArrowUp, ArrowRight, ArrowBottom, ArrowLeft } from "../arrows";
import { DEFAULT_SINGLE_SCHEMA_SHIFT } from "../../modules/maps/utils/constants";

const ZOOMBEHAVIOUR_MIN_SCALE: number = 0.25;
const ZOOMBEHAVIOUR_MAX_SCALE: number = 4;
const ZOOMBEHAVIOUR_DEFAULT_SCALE: number = 1;

export type ZoomingSurfaceProps = {
  onZoomed: (x: number, y: number, k: number) => any,
  width: number,
  height: number,
  transform: ZoomBehaviourTransform,
  enableZoom: boolean,
  onMouseMove: (SyntheticMouseEvent<HTMLElement>, Array<number>) => any,
  onMouseDown: (SyntheticMouseEvent<HTMLElement>, Array<number>) => any,
  onMouseUp: (SyntheticMouseEvent<HTMLElement>, Array<number>) => any,
  id?: string,
  children: any,
  deafultZoom?: number,
  minZoom?: number,
  maxZoom?: number,
  enableButtonMovement?: boolean
};

class ZoomingSurface extends React.Component<ZoomingSurfaceProps> {
  svgRef: any;
  svg: any;
  zoom: any;
  /* PROVVISORIO */
  schemaBoundary: Object;
  
  constructor(props: ZoomingSurfaceProps) {
    super(props);
    this.svgRef = React.createRef();
  }

  zoomed = () => {
    const transform = event.transform;
    const { onZoomed } = this.props;
    if (onZoomed) onZoomed(transform.x, transform.y, transform.k);
  };

  getCoords(e: SyntheticMouseEvent<HTMLElement>) {
    const p = getMousePos(e, this.svgRef.current);
    const { transform } = this.props;
    return calcCoords(p[0], p[1], transform.x, transform.y, transform.k);
  }

  onMouseMove = (e: SyntheticMouseEvent<HTMLElement>) => {
    if (this.props.onMouseMove != null) {
      const coords = this.getCoords(e);
      this.props.onMouseMove(e, coords);
    }
  };

  onMouseDown = (e: SyntheticMouseEvent<HTMLElement>) => {
    if (this.props.onMouseDown != null) {
      const coords = this.getCoords(e);
      this.props.onMouseDown(e, coords);
    }
  };

  onMouseUp = (e: SyntheticMouseEvent<HTMLElement>) => {
    if (this.props.onMouseUp != null) {
      const coords = this.getCoords(e);
      this.props.onMouseUp(e, coords);
    }
  };

  initZoom(scale: number, x: number, y: number) {
    let scaleExtent: Array<number> = [
      this.props.minZoom ? this.props.minZoom : ZOOMBEHAVIOUR_MIN_SCALE,
      this.props.maxZoom ? this.props.maxZoom : ZOOMBEHAVIOUR_MAX_SCALE
    ];
    this.zoom = d3Zoom().scaleExtent(scaleExtent);
    this.svg.call(this.zoom);
    this.zoom.on("zoom", this.zoomed);
    this.svg.call(
      this.zoom.transform,
      zoomIdentity.translate(x, y).scale(scale)
    );
  }

  componentDidMount() {
    this.svg = select(this.svgRef.current);
    if (this.props.enableZoom === true)
      this.initZoom(
        this.props.deafultZoom
          ? this.props.deafultZoom
          : ZOOMBEHAVIOUR_DEFAULT_SCALE,
        0,
        0
      );
  }

  componentWillUnmount() {
    this.zoom.on("zoom", null);
    this.svg.on(".zoom", null);
    this.zoom = null;
  }

  componentDidUpdate(/*prevProps: ZoomingSurfaceProps*/) {
    const enableZoom =
      this.props.enableZoom !== undefined ? this.props.enableZoom : false;
    if (enableZoom == true && this.zoom == null) {
      this.initZoom(
        this.props.transform.k,
        this.props.transform.x,
        this.props.transform.y
      );
    }
    if (enableZoom == false && this.zoom != null) {
      this.zoom.on("zoom", null);
      this.svg.on(".zoom", null);
      this.zoom = null;
    }
  }
  
  hideArrow(direction: string) {
    //console.log(this.schemaBoundary);
    /*
    if (
      direction === "up" &&
      this.schemaBoundary !== undefined &&
      this.schemaBoundary.top >= 0
    ) {
      return false;
    } else if (
      direction === "right" &&
      this.schemaBoundary !== undefined &&
      this.schemaBoundary.right <= 0
    ) {
      return false;
    } else if (
      direction === "bottom" &&
      this.schemaBoundary !== undefined &&
      this.schemaBoundary.bottom <= 0
    ) {
      return false;
    } else if (
      direction === "left" &&
      this.schemaBoundary !== undefined &&
      this.schemaBoundary.left >= 0
    ) {
      return false;
    }*/
    return true;
  }

  moveSchema = (direction: string) => {
    const translation = [0, 0];
    if (direction === "up") {
      translation[1] = Math.min(
        DEFAULT_SINGLE_SCHEMA_SHIFT,
        Math.abs(this.schemaBoundary.top)
      );
    } else if (direction === "right") {
      translation[0] -= Math.min(
        DEFAULT_SINGLE_SCHEMA_SHIFT,
        Math.abs(this.schemaBoundary.right)
      );
      
    } else if (direction === "bottom") {
      translation[1] -= Math.min(
        DEFAULT_SINGLE_SCHEMA_SHIFT,
        Math.abs(this.schemaBoundary.bottom)
      );
    } else if (direction === "left") {
      translation[0] = Math.min(
        DEFAULT_SINGLE_SCHEMA_SHIFT,
        Math.abs(this.schemaBoundary.left)
      );
    }

    this.zoom.translateBy(this.svg, translation[0], translation[1]);
  };



  render() {
    const { width, height, children, transform } = this.props;
    const enableZoom =
      this.props.enableZoom !== undefined ? this.props.enableZoom : false;    
    return (
      <React.Fragment>
        <svg
          width={width}
          height={height}
          ref={this.svgRef}
          data-id={this.props.id}
          onMouseMove={this.onMouseMove}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
        >
          <g transform={transformToString(transform.x, transform.y, transform.k)}>
            {children}
          </g>
        </svg>
        <ReactVisible visible={enableZoom && this.hideArrow("up")}>
            <ArrowUp
              top={0}
              left={this.props.width}
              onClick={() => this.moveSchema("up")}
            />
          </ReactVisible>
          <ReactVisible visible={enableZoom && this.hideArrow("right")}>
            <ArrowRight
              top={this.props.height}
              left={this.props.width}
              onClick={() => this.moveSchema("right")}
            />
          </ReactVisible>
          <ReactVisible
            visible={enableZoom && this.hideArrow("bottom")}
          >
            <ArrowBottom
              top={this.props.height}
              left={this.props.width}
              onClick={() => this.moveSchema("bottom")}
            />
          </ReactVisible>
          <ReactVisible visible={enableZoom && this.hideArrow("left")}>
            <ArrowLeft
              top={this.props.height}
              left={0}
              onClick={() => this.moveSchema("left")}
            />
          </ReactVisible>
        </React.Fragment>  
    );
  }
}

export { ZoomingSurface };
