//@flow
import { Map, Record, List } from 'immutable';
import { type RenderInfoT } from './utils/types';

export type ExpRenderModalityT = 'EXPONENTIAL_RENDER_MODALITY';
export type LinearRenderModalityT = 'LINEAR_RENDER_MODALITY';
export type SingleRenderModalityT = 'SINGLE_RENDER_MODALITY';
export type RenderModalityT = ExpRenderModalityT | LinearRenderModalityT;


/**
 * Store types
 */

export const TileRecord = Record({
    creationDate:0,
    currentExpScale: null,
    defaultPositionK: 1,
    defaultPositionX: 0,
    defaultPositionY: 0,
    defaultScale: 1,
    height: 0,
    initScale: 1,
    maxScale: 1,
    minScale: 1,
    projection: '',
    renderModality:null,
    scales: List(),
    transformX: null,
    transformY: null,
    uuid:'',
    viewPortHeight: 0,
    viewPortWidth: 0,
    width: 0,
}: {
    creationDate: number,
    currentExpScale:?number,
    defaultPositionK: number,
    defaultPositionX: number,
    defaultPositionY: number,
    defaultScale: number,
    height: number,
    initScale: number,
    maxScale: number,
    minScale: number,
    projection: string,
    renderModality:RenderModalityT,
    scales:Array<number>,
    transformX:?number,
    transformY:?number,
    uuid:string,
    viewPortHeight: number,
    viewPortWidth: number,
    width: number,
});

const initialTileRecord = TileRecord();
type TileRecordT = typeof initialTileRecord;

export type MapsT = Map<string, TileRecordT>;

export const MapsTileRecord = Record({
    maps: Map()
}:{
    maps:MapsT
});

export const initialState = MapsTileRecord();
export type MapsTileT = typeof initialState;

/**
 * Selector types
 */
type ParamTilesT = {
    x: number,
    y: number,
    z: number,
    tx: number,
    ty: number
};

export type TilesT = {
    0:ParamTilesT,
    scale:number,
    translate:Array<number>,
    z:number
}

export type TilesByUuidT = {
    tiles:Map<string,TilesT>
}

type ViewPortT = {|
    viewPortWidth:number,
    viewPortHeight:number,
|}

export type ViewPortByUuidT = {
    viewPorts:Map<string,ViewPortT>
}

type ScaleT = {
    initScale: number,
    minScale: number,
    maxScale: number,
    defaultScale: number,
    currentExpScale: number,
    scales:Array<number>
}

export type ScaleByUuidT = {
    scales:Map<string, ScaleT>
};

type MapSizeT = {
    width: number,
    height: number
}

export type MapSizeByUuidT = {
    mapSizes:Map<string, MapSizeT>
};

export type RenderModalityBuUuidT=Map<string,string>;

export type RenderInfoByUuidT = Map<string, RenderInfoT>;