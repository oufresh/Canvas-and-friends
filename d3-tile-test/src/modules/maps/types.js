//@flow
import { type MapSize } from "../../types";

export type ExpRenderModalityT = "EXPONENTIAL_RENDER_MODALITY";
export type LinearRenderModalityT = "LINEAR_RENDER_MODALITY";
export type SingleLinearRenderModalityT = "SINGLE_LINEAR_RENDER_MODALITY";
export type SingleExpRenderModalityT = "SINGLE_EXPONENTIAL_RENDER_MODALITY";
export type GeoRenderModalityT = "GEO_RENDER_MODALITY";

export type RenderModality =
  | ExpRenderModalityT
  | LinearRenderModalityT
  | SingleLinearRenderModalityT
  | SingleExpRenderModalityT;

export interface TileIndex {
  z: number;
  x: number;
  y: number;
}

export interface TileValue {
  tile: string;
  timestamp: number;
}

//export type TileCacheMap

/**
 * Store types
 */
export interface MapRecord {
  creationDate: number;
  currentExpScale: ?number;
  defaultExpScale: number;
  expScaleOffset: ?number;
  height: number;
  initExpScale: number;
  maxExpScale: number;
  minExpScale: number;
  projection: string;
  renderModality: RenderModality;
  transformX: ?number;
  transformY: ?number;
  uuid: string;
  viewPortHeight: number;
  viewPortWidth: number;
  width: number;
  scaledObjectTranslationX: number;
  scaledObjectTranslationY: number;
  viewPortTranslationX: number;
  viewPortTranslationY: number;
  objectExpScale: number;
  objectPosition: Array<number>;
  tileCacheMap: Map<string, TileValue>;
  tileCacheUpdateTime: number;
  baseTileServiceurl: string;
  tileExpiration: number;
}

export const initialMapRecord = {
  creationDate: 0,
  currentExpScale: null,
  defaultExpScale: 1,
  expScaleOffset: null,
  height: 0,
  initExpScale: 1,
  maxExpScale: 1,
  minExpScale: 1,
  projection: "",
  renderModality: "",
  transformX: null,
  transformY: null,
  uuid: "",
  viewPortHeight: 0,
  viewPortWidth: 0,
  width: 0,
  scaledObjectTranslationX: 0,
  scaledObjectTranslationY: 0,
  viewPortTranslationX: 0,
  viewPortTranslationY: 0,
  objectExpScale: 1,
  objectPosition: [0, 0],
  //$FlowFixMe se metto la tipizzazione dove istanzio mi da errore di sintassi babel
  tileCacheMap: new Map(),
  tileCacheUpdateTime: 0,
  baseTileServiceurl: "",
  tileExpiration: NaN
};

export type Maps = Map<string, MapRecord>;
export type MapsRecord = {
  maps: Maps
};

export const initialMapsRecord: MapsRecord = {
  maps: new Map()
};

/**
 * Selector types
 */
export type ParamTiles = {
  x: number,
  y: number,
  z: number,
  tx: number,
  ty: number
};

export type Tiles = Array<ParamTiles> & {
  scale: number,
  translate: Array<number>,
  z: number
};

export type TilesByUuid = Map<string, Tiles>;

export type ViewPort = {|
  viewPortWidth: number,
  viewPortHeight: number
|};

export type ViewPortByUuid = Map<string, ViewPort>;

export type MapSizeByUuid = Map<string, MapSize>;

export type RenderModalityBuUuid = Map<string, RenderModality>;

export type ZoomTransform = {|
  transformX: ?number,
  transformY: ?number,
  currentExpScale: ?number
|};

export type MapTransformByUuid = Map<string, ZoomTransform>;

export type MapMaxScaleConvByUuid = Map<string, number>;

export type IsReadyByUuid = Map<string, boolean>;

export type IsMultipleScalesByUuid = Map<string, boolean>;

export type IsSchemaEnd = {|
  top: boolean,
  left: boolean,
  right: boolean,
  bottom: boolean
|};

export type IsSchemaEndByUuid = Map<string, IsSchemaEnd>;

export type SchemaBoundary = {|
  top: number,
  left: number,
  right: number,
  bottom: number
|};

export type SchemaBoundaryByUuid = Map<string, SchemaBoundary>;

export interface MapTileCache {
  tileCacheMap: Map<string, TileValue>;
  tileCacheUpdateTime: number;
}

export type MapsTileCacheByUuid = Map<string, MapTileCache>;
