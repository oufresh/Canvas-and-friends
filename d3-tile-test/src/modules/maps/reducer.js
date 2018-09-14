//@flow
import { List } from 'immutable';
import { createLeaf, createReducer } from 'stweb-redux-helper';
import { INIT_TILE, MOVE_TILE } from './actionDefinitions';
import { type InitTileT, type MoveTileT } from './actionCreators';
import { initialState, type MapsTileT, TileRecord } from './types';
import { MOVE_TILE_ERROR }  from './constants';
import { uuidGenerator, now } from './utils';

const initTileHandler = (state: MapsTileT, payload: InitTileT): MapsTileT => {
    const {viewPortWidth, viewPortHeight,initScale, defaultScale, width, height, scales, renderModality} = payload;
    let { uuid } = payload;

    //creao l'uuid se non esiste
    if(!uuid)
        uuid = uuidGenerator();
    
    const existUuid = state.maps.has(uuid);
    //sovrascrivo il tile esistente
    if(existUuid) {
        return state.updateIn(['maps',uuid], tile =>  tile.merge({
                                                                    viewPortWidth,
                                                                    viewPortHeight, 
                                                                    minScale:scales[0], 
                                                                    maxScale:scales[scales.length-1], 
                                                                    defaultScale, 
                                                                    initScale, 
                                                                    width, 
                                                                    height, 
                                                                    scales: List(scales),
                                                                    renderModality
                                                                }))
    }
    //creao un nuovo tile
    else{
        const creationDate = now();
        const tile = TileRecord({
            uuid, 
            viewPortWidth, 
            viewPortHeight, 
            creationDate, 
            minScale:scales[0], 
            maxScale:scales[scales.length-1], 
            defaultScale, 
            initScale, 
            width, 
            height, 
            scales: List(scales),
            renderModality
        });
        return state.setIn(['maps',uuid],tile);
    }  
};

const moveTileHandler = (state: MapsTileT, payload: MoveTileT): MapsTileT => {
    const {uuid, x, y, currentExpScale} = payload;
    const existUuid = state.maps.has(uuid);
    if(existUuid){
        return state.updateIn(['maps',uuid], tile =>  tile.merge({
            transformX: x,
            transformY: y,
            currentExpScale: currentExpScale
        }))
    }
    else{
        throw new Error(MOVE_TILE_ERROR);
    } 

};

export const maps = createReducer(initialState, [
    createLeaf(INIT_TILE, initTileHandler),
    createLeaf(MOVE_TILE, moveTileHandler)
]);