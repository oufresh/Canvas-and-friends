//@flow
import * as React from "react";
import { select, event } from "d3-selection";
import { zoom as d3Zoom } from "d3-zoom";
import {
  getMousePos,
  calcCoordsforTiles,
  convertCoordsForTiles,
  type Tiles,
  type RenderModality,
  ZoomMap,
  //type IsSchemaEnd,
  type SchemaBoundary,
  MapTileCache
} from "../../../modules";
import { SvgDiv } from "../../commons";
import {
  type ViewportObjectPosition,
  type MapSize,
  type Scales,
  type ReferenceSystemScales
} from "../../../types";
import { stringify } from "../../transforms";
import { moveRenderTo } from "../../schemaMovements";
import { doubleClickFilter, clickFilter } from "../../events";
import {
  calcObjectTranslation,
  EXP_RENDER_MODALITY,
  DEFAULT_SCHEMA_SHIFT
} from "../../../modules/maps";
import { TileCollectionRender } from "./TileCollectionRender";

const svgCanvasStyle = {
  position: "absolute",
  top: "0px",
  left: "0px",
  width: "100%",
  height: "100%",
  userSelect: "none"
};

export type TileRenderPropsType = {
  uuid: string,
  width: number,
  height: number,
  top?: number,
  left?: number,
  viewportObjectPosition: ViewportObjectPosition, //posizionamento
  renderModality: RenderModality,
  scales: Scales,
  objectSize: MapSize,
  translateExtent?: ?Array<Array<number>>, //per ora sappiamo che dovremo affrontarlo
  onZoomed: ZoomMap => any,
  tiles: Tiles,
  onMouseMove?: (Array<number>) => any,
  onDoubleClickFilter?: (Array<HTMLElement>) => boolean,
  onMouseDownFilter?: (Array<HTMLElement>) => boolean,
  onClickFilter?: (Array<HTMLElement>) => boolean,
  referenceSystemScales: ReferenceSystemScales,
  //schemaEnd: IsSchemaEnd,
  schemaBoundary?: SchemaBoundary,
  debugGrid?: boolean,
  tileCache: MapTileCache
};

export class TileRender extends React.Component<TileRenderPropsType> {
  svgRef: any;
  svg: Object;
  zoom: Object;
  zoomed: () => void;
  onMouseMove: (SyntheticMouseEvent<HTMLElement>) => any;
  moveSchema: string => any;

  constructor(props: TileRenderPropsType) {
    super(props);
    this.svgRef = React.createRef();

    this.zoomed = this.zoomed.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.moveSchema = this.moveSchema.bind(this);
  }

  /**
   *
   */
  /*:: zoomed: () => void */
  zoomed() {
    const transform = event.transform;
    //console.log(transform);
    const { onZoomed, uuid } = this.props;
    //non mi conviene calcolarlo qui, lo fa direttamente il selettore prendendolo dai dati di d3-tile
    //const z = calcZ(transform.k);
    const zoom = {
      currentExpScale: transform.k,
      uuid,
      x: transform.x,
      y: transform.y
    };
    onZoomed(zoom);

    //cerchiamo di capire se ci spostiamo
    //fuori dall'area della viewport
    //se si non azionaimo lo zoom così non si fa nulla ....
    /*let x = Math.min([transform.x, 0]);
        let y = Math.min([transform.y, 0]);
        const k = transform.k;
        let xx = Math.max([transform.x, (1-transform.k) * this.props.width]);
        let yy = Math.max([transform.y, (1-transform.k) * this.props.height]);*/

    //TODO bisogna calcolare la expScaleCurrent per poter muovere dove si vuole serve quella corrente che è data da transform.k
    //console.log('currentExpScale: ' + transform.k);
  }

  /*:: onMouseMove: (SyntheticMouseEvent<HTMLElement>) => any; */
  onMouseMove(e: SyntheticMouseEvent<HTMLElement>) {
    const pos = getMousePos(e, this.svgRef.current);
    //console.log(pos);
    if (this.props.onMouseMove) this.props.onMouseMove(pos);
  }

  initZoomTile() {
    const { scales } = this.props;
    const { onDoubleClickFilter, onClickFilter } = this.props;
    //const { schemaEnd } = this.props;

    let expScaleExtent: Array<number> = [
      scales.minExpScale,
      scales.maxExpScale
    ];
    this.svg = select(this.svgRef.current);

    const filter = () => {
      // per inibire il down e azione di pan di conseguenza se sono alla fine dello schema
      //console.log(event);
      /*if (event.type === "mousedown") {
        //console.log("mousedown");
        const path = mouseDownFilter(event);
        if (onMouseDownFilter && path.length > 0)
          return onMouseDownFilter(path);
        else return !event.button;
      }*/
      if (event.type === "dblclick") {
        const path = doubleClickFilter(event);
        if (onDoubleClickFilter && path.length > 0)
          return onDoubleClickFilter(path);
        else return !event.button;
      } else {
        //console.log(!event.button);
        return !event.button;
      }
    };

    this.zoom = d3Zoom()
      //.translateExtent([[-1,-1], [1,1]])
      .scaleExtent(expScaleExtent)
      .filter(filter)
      .on("zoom", this.zoomed);

    this.svg.on("click", () => {
      //console.log("d3-select click");
      //console.log(event);
      const path = clickFilter(event);
      //console.log(path);
      if (onClickFilter && path.length > 0) return onClickFilter(path);
      event.preventDefault();
    });

    // per ora lo teniamo commentato però è un modo per
    // andare a evidenziare oggetti svg selezionandoli
    /*
    this.svg.on("click", function() {
      d3.select(this).style("color", "red");
    });
    */

    this.svg.call(this.zoom);
  }

  setPosition() {
    //se voglio spostare il punto nella viewport teniamo conto che l'origine è
    //in alto a sinistra
    const { viewportObjectPosition } = this.props;

    //console.log("--------------------------------------------");
    //console.log("setPosition");
    //console.log(viewportObjectPosition);
    //console.log("--------------------------------------------");
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

  componentDidMount() {
    this.initZoomTile();
    this.setPosition();
  }

  componentWillUnmount() {
    this.zoom.on("zoom", null);
    this.svg.on(".zoom", null);
  }

  componentDidUpdate(prevProps: TileRenderPropsType) {
    if (
      this.props.width !== prevProps.width ||
      this.props.height !== prevProps.height
    ) {
      //dimensioni viewport cambiate ... carico tiles mancanti
      //per farlo dovrei fare una move nello stesso punto
      //oppure triggerare una zoom con l'ultimo evento che però potrebbe essere undefined adesso
      //non so se in mezzo ci sono stati altri eventi
      //oppure fare una action apposta che fa il ricalcolo delle tiles
      //console.log("Cambiate dimensioni canvas svg");
    }
    const { viewportObjectPosition } = this.props;
    if (
      viewportObjectPosition.scaledObjectTranslation[0] !==
        prevProps.viewportObjectPosition.scaledObjectTranslation[0] ||
      viewportObjectPosition.viewport[0] !==
        prevProps.viewportObjectPosition.viewport[0] ||
      viewportObjectPosition.scaledObjectTranslation[1] !==
        prevProps.viewportObjectPosition.scaledObjectTranslation[1] ||
      viewportObjectPosition.viewport[1] !==
        prevProps.viewportObjectPosition.viewport[1] ||
      viewportObjectPosition.objectExpScale !==
        prevProps.viewportObjectPosition.objectExpScale
    ) {
      this.setPosition();
    }
  }

  hideArrow(direction: string) {
    //console.log(this.props.schemaBoundary);
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

  /*:: moveSchema: (string) => any */
  moveSchema(direction: string) {
    const {
      renderModality,
      tiles,
      objectSize,
      scales,
      referenceSystemScales,
      schemaBoundary
    } = this.props;

    const origPos = calcCoordsforTiles(
      EXP_RENDER_MODALITY,
      [0, 0],
      tiles.scale,
      tiles.translate[0],
      tiles.translate[1]
    );

    if (schemaBoundary) {
      if (direction === "up") {
        //console.log(direction);
        origPos[1] -= Math.min(
          DEFAULT_SCHEMA_SHIFT,
          Math.abs(schemaBoundary.top)
        );
      } else if (direction === "right") {
        origPos[0] += Math.min(
          DEFAULT_SCHEMA_SHIFT,
          Math.abs(schemaBoundary.right)
        );
      } else if (direction === "bottom") {
        origPos[1] += Math.min(
          DEFAULT_SCHEMA_SHIFT,
          Math.abs(schemaBoundary.bottom)
        );
      } else if (direction === "left") {
        origPos[0] -= Math.min(
          DEFAULT_SCHEMA_SHIFT,
          Math.abs(schemaBoundary.left)
        );
      }

      const schemaPosition = convertCoordsForTiles(
        referenceSystemScales.currentScale,
        referenceSystemScales.defaultScale
          ? referenceSystemScales.defaultScale
          : 0,
        origPos
      );

      const scaledObjectTranslation = calcObjectTranslation(
        renderModality,
        schemaPosition,
        objectSize.width,
        objectSize.height,
        scales.defaultExpScale
      );

      if (scaledObjectTranslation)
        moveRenderTo(
          this.svg,
          this.zoom,
          scaledObjectTranslation[0],
          scaledObjectTranslation[1],
          0,
          0,
          scales.currentExpScale
            ? scales.currentExpScale
            : scales.defaultExpScale
        );
    }
  }

  render() {
    const { renderModality, tiles, debugGrid, tileCache } = this.props;
    let transform = null;

    if (tiles && tiles.length && tileCache && tileCache.tileCacheMap.size > 0) {
      //console.log(tiles);
      transform = stringify(this.props.tiles.scale, this.props.tiles.translate);
    }

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
          style={svgCanvasStyle}
          ref={this.svgRef}
          onMouseMove={this.onMouseMove}
        >
          <g transform={transform}>
            {transform !== null ? (
              <TileCollectionRender
                tiles={tiles}
                tileCache={tileCache}
                renderModality={renderModality}
              />
            ) : null}
          </g>
          {debugGrid == true ? (
            <g>
              <line
                x1="0"
                y1="0"
                x2={this.props.width}
                y2={this.props.height}
                style={{ stroke: "rgb(255,0,0)", strokeWidth: 2 }}
              />
              <line
                x1="0"
                y1={this.props.height}
                x2={this.props.width}
                y2={0}
                style={{ stroke: "rgb(255,0,0)", strokeWidth: 2 }}
              />
            </g>
          ) : null}
        </svg>
      </SvgDiv>
    );
  }
}
