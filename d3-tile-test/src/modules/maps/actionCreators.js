//@flow
import {type Action, createAction} from 'stweb-redux-helper';
import { INIT_TILE, MOVE_TILE } from './actionDefinitions';
import { type RenderModalityT} from './constants';

/*----- Types -----*/

export type InitTileT = {
    viewPortWidth:number,
    uuid:?string,
    viewPortHeight:number,
    initScale: number,
    defaultScale: number,
    width: number,
    height: number,
    scales: Array<number>,
    renderModality:RenderModalityT
};

export type MoveTileT = {
    currentExpScale:number,
    uuid:string,
    x:number,
    y:number,
};

/*----- Actions ----- */

export const initTile = (uuid:?string, viewPortWidth:number, viewPortHeight:number, defaultScale: number, initScale: number, width: number, height: number, scales:Array<number>, renderModality:RenderModalityT):Action<InitTileT> =>{
    return createAction(INIT_TILE, { uuid, viewPortWidth, viewPortHeight,defaultScale, initScale, width, height,scales,renderModality });
}

export const moveTile = (uuid:string, x:number, y:number, currentExpScale:number):Action<MoveTileT> => {
    return createAction(MOVE_TILE, {uuid, x, y, currentExpScale});
}