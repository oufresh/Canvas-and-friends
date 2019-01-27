//@flow
import { type Action, createAction } from "@stweb-lib/redux-helper";
import {
  INIT_MAP,
  MOVE_MAP,
  ZOOM_MAP,
  RESIZE_MAP,
  REMOVE_MAP,
  STORE_TILE_MAP,
  STORE_METATILE_MAP,
  LOADING_TILES_MAP
} from "./actionDefinitions";
import { type RenderModality } from "./types";
import {
  SINGLE_LINEAR_RENDER_MODALITY,
  SINGLE_EXP_RENDER_MODALITY
} from "./renderModalities";

/*----- Types -----*/

export type InitMap = {|
  defaultExpScale: number,
  expScaleOffset: number,
  height: number,
  initExpScale: number,
  maxExpScale: number,
  minExpScale: number,
  objectExpScale?: number,
  renderModality: RenderModality,
  scaledObjectTranslationX?: number,
  scaledObjectTranslationY?: number,
  uuid: ?string,
  viewPortHeight?: number,
  viewPortTranslationX: number,
  viewPortTranslationY: number,
  viewPortWidth?: number,
  width: number,
  objectPosition?: Array<number>,
  baseTileServiceurl: string,
  tileExpiration: number
|};

export type MoveMap = {|
  uuid: string,
  objectExpScale: number,
  scaledObjectTranslationX: number,
  scaledObjectTranslationY: number,
  viewPortTranslationX: number,
  viewPortTranslationY: number,
  objectPosition: Array<number>
|};

export interface ZoomMap {
  currentExpScale: number;
  uuid: string;
  x: number;
  y: number;
}

export type ResizeMap = {|
  uuid: string,
  viewPortWidth: number,
  viewPortHeight: number
|};

export type RemoveMap = {|
  uuid: string
|};

/**
 * Tile con relativa tripletta di indicizzazione da mettere nella cache dello store.
 * zoomIndex sarebbe la z o la scala se siamo in exp.
 */
export interface StoreTileMap {
  uuid: string;
  z: number;
  x: number;
  y: number;
  tile: string;
  timestamp: number;
}

export interface MetaTileElement {
  z: number;
  x: number;
  y: number;
  tile: string;
}

export interface StoreMetaTileMap {
  uuid: string;
  tiles: Array<MetaTileElement>;
  timestamp: number;
}

export interface LoadingTilesMap {
  uuid: string;
  loading: boolean;
}

/*----- Actions ----- */

export const initMap = (initMap: InitMap): Action<InitMap> => {
  if (
    initMap.renderModality === SINGLE_LINEAR_RENDER_MODALITY ||
    initMap.renderModality === SINGLE_EXP_RENDER_MODALITY
  ) {
    if (!initMap.viewPortHeight && !initMap.viewPortWidth) {
      //non è settata la dimensione della viewport ...
      //la calcolo dalla scala iniziale se presente
      initMap.viewPortWidth = initMap.width * initMap.initExpScale;
      initMap.viewPortHeight = initMap.height * initMap.initExpScale;
    } else {
      //ho la viewport controllo se è più grande allora metto lo schema in mezzo ad essa
      //attenzione perché per ora potremmo avere uno schema non a scala naturale
      //questo fa si che devo controllare moltiplicando per la scala ma
      //soltanto se la dimensione naturale è più piccola della viewport
      //altrimenti va bene così
      //ci aspettiamo poi di avere l'svg a scala naturale corretta corriposndente alle dimensioni
      //allora il controllo è solo sulla dimensione (cabina primaria)
      if (initMap.viewPortWidth && initMap.viewPortHeight) {
        if (
          !(initMap.viewPortWidth < initMap.width) &&
          initMap.viewPortWidth > initMap.width * initMap.initExpScale
        ) {
          initMap.scaledObjectTranslationX =
            initMap.viewPortWidth / 2 - initMap.width / 2;
        }
        if (
          !(initMap.viewPortHeight < initMap.height) &&
          initMap.viewPortHeight > initMap.height * initMap.initExpScale
        ) {
          initMap.scaledObjectTranslationY =
            initMap.viewPortHeight / 2 - initMap.height / 2;
        }
      }
    }
    return createAction(INIT_MAP, initMap);
  } else return createAction(INIT_MAP, initMap);
};

export const moveMap = (moveMap: MoveMap): Action<MoveMap> => {
  return createAction(MOVE_MAP, moveMap);
};

export const zoomMap = (zoomMap: ZoomMap): Action<ZoomMap> => {
  return createAction(ZOOM_MAP, zoomMap);
};

export const resizeMap = (resizeMap: ResizeMap): Action<ResizeMap> => {
  return createAction(RESIZE_MAP, resizeMap);
};

export const removeMap = (removeMap: RemoveMap): Action<RemoveMap> => {
  return createAction(REMOVE_MAP, removeMap);
};

export const storeTileMap = (
  storeTileMap: StoreTileMap
): Action<StoreTileMap> => {
  return createAction(STORE_TILE_MAP, storeTileMap);
};

export const storeMetaTileMap = (
  metatile: StoreMetaTileMap
): Action<StoreMetaTileMap> => {
  return createAction(STORE_METATILE_MAP, metatile);
};

export const loadingTilesMap = (
  loading: LoadingTilesMap
): Action<LoadingTilesMap> => {
  return createAction(LOADING_TILES_MAP, loading);
};
