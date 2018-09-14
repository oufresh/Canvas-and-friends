//@flow
import { createSelector } from 'reselect';
import { checkState, type State } from 'stweb-redux-helper';
import { 
    type MapsTileT, 
    type MapsT, 
    type TilesByUuidT, 
    type ViewPortByUuidT, 
    type ScaleByUuidT, 
    type MapSizeByUuidT, 
    type RenderModalityBuUuidT,
    type RenderInfoByUuidT
} from './types';
import { Set,Map } from 'immutable';
import { calcTiles, TILE_SIZE } from './utils';
import { EXP_RENDER_MODALITY, SINGLE_RENDER_MODALITY } from './constants';
import { initRenderInfo as linearInitRenderInfo } from './utils/linearRenderUtils';
import { initRenderInfo as sinlgeInitRenderInfo } from './utils/singleTileRenderInfo';
import { initRenderInfo as expInitRenderInfo, calcExpInt, log2int, calcExpScale } from './utils/expRenderUtils';

let getRoot = (state:State):?MapsTileT => state;

export const setRootMaps = (rootGetter:State=>?MapsTileT):void => getRoot = rootGetter;

export const getMapsRoot = (state:State):MapsTileT => checkState(getRoot(state));

export const getMapsUuids = createSelector([getMapsRoot],(maps:MapsT): Set<string> => {
    const m = maps.maps;
    if(m && !m.isEmpty()){
        return Set(m.keys());
    }
    return Set();
});

export const getMapsTilesByUuid = createSelector([getMapsRoot],(maps:MapsT): TilesByUuidT => {
    const m = maps.maps;
    if(m && !m.isEmpty()){
        return m.map(t =>{
            let tiles = [];
            const {viewPortWidth,viewPortHeight,transformX,transformY,currentExpScale} = t;
            if (viewPortWidth > 0 && viewPortHeight > 0 &&
                transformX !== null && transformY !== null && currentExpScale !== null) {
                tiles = calcTiles(viewPortWidth, viewPortHeight,
                    transformX,
                    transformY,
                    currentExpScale);
            }
        
            //aggiungo z per sapere indice tiles
            const z = tiles.length > 0 ? (tiles[0].z) : NaN;
            tiles.z = z;

            return tiles;
        });
    }
    return Map();
});

export const getViewPortSizeByUuid = createSelector([getMapsRoot],(maps:MapsT): ViewPortByUuidT => {
    const m = maps.maps;
    if(m && !m.isEmpty()){
        return m.map(t =>{
            return {
                viewPortWidth: t.viewPortWidth,
                viewPortHeight: t.viewPortHeight
            };
        } )
    }
    return Map();
});

export const getMapScaleByUuid = createSelector([getMapsRoot],(maps:MapsT): ScaleByUuidT => {
    const m = maps.maps;
    if(m && !m.isEmpty()){
        return m.map(t =>{
            return {
                initScale: t.initScale,
                minScale: t.minScale,
                maxScale: t.maxScale,
                currentExpScale: t.currentExpScale,
                defaultScale: t.defaultScale,
                scales: t.scales
            };
        } )
    }
    return Map();
});

export const getMapSizeByUuid = createSelector([getMapsRoot],(maps:MapsT): MapSizeByUuidT => {
    const m = maps.maps;
    if(m && !m.isEmpty()){
        return m.map(t =>{
            return {
                width: t.width,
                height: t.height
            };
        } )
    }
    return Map();
});

export const getRenderModalityByUuid = createSelector([getMapsRoot],(maps:MapsT):RenderModalityBuUuidT => {
    const m = maps.maps;
    if(m && !m.isEmpty()){
        return m.map(t =>t.renderModality)
    }
    return Map();
});

export const getRenderInfoByUuid =  createSelector([getMapsRoot],(maps:MapsT):RenderInfoByUuidT => {
    const m = maps.maps;
    if(m && !m.isEmpty()){
        return m.map((mappa) =>{
            const {width,height,scales,defaultScale,initScale} = mappa;
            const min = scales.first();
            const max = scales.last();
            if(EXP_RENDER_MODALITY === mappa.renderModality)
                return expInitRenderInfo(width,height,[min,max],defaultScale,initScale);
            else if (SINGLE_RENDER_MODALITY === mappa.renderModality)
                return sinlgeInitRenderInfo(width,height,[min,max],defaultScale,initScale);
            else
                return linearInitRenderInfo(width,height,[min,max],defaultScale,initScale);
        })
    }
    return Map();
});

export const getMaxScaleConvByUuid =  createSelector([getMapsRoot],(maps:MapsT):RenderInfoByUuidT => {
    const m = maps.maps;
    if(m && !m.isEmpty()){
        return m.map((mappa) => {
            const {width,height,scales,defaultScale} = mappa;
            const expInt = calcExpInt(width, height);
            const expScaleMax = calcExpScale(expInt, scales.first(), defaultScale, TILE_SIZE);
            const maxScaleConv = log2int(expScaleMax/TILE_SIZE);
            return maxScaleConv;
        })
    }
    return Map();
});

export const getMapTransform = createSelector([getMapsRoot],(maps:MapsT): MapSizeByUuidT => {
    const m = maps.maps;
    if(m && !m.isEmpty()){
        return m.map(t =>{
            return {
                transformX: t.transformX,
                transformY: t.transformY,
                currentExpScale: t.currentExpScale
            };
        } )
    }
    return Map();
});
