//@flow
/*eslint no-magic-numbers:*/
import { 
    getMapsUuids,
    getMapsTilesByUuid,
    getViewPortSizeByUuid,
    getRenderModalityByUuid,
    getRenderInfoByUuid
} 
from '../selectors';
import { MapsTileRecord, TileRecord, type MapsTileT } from '../types';
import {EXP_RENDER_MODALITY, LINEAR_RENDER_MODALITY} from '../constants';
import { Map, Set,List } from 'immutable';
import * as matchers from 'jest-immutable-matchers';

describe('Maps selectors', () => {

    beforeEach(() => {
        // $FlowFixMe
        jest.addMatchers(matchers);
    });

    const uuid1= 'uuidTile1';
    const uuid2= 'uuidTile2';
    const uuid3= 'uuidTile3';
    const mapsTileBefore = Map({
        [uuid1]: TileRecord({ uuid1 }),
        [uuid2]: TileRecord({ uuid2 }),
        [uuid3]: TileRecord({ uuid3 })
    });

    const STATE_INITIALIZED:MapsTileT = MapsTileRecord({
        maps: mapsTileBefore
    });

    it('retrieves uuids from empty maps, selector: getMapsUuids', () => {
        const STATE_NOT_INITIALIZED:MapsTileT = MapsTileRecord();
        const uuids = getMapsUuids(STATE_NOT_INITIALIZED);
        const uuidsExpected = Set();
        // $FlowFixMe
        expect(uuids).toEqualImmutable(uuidsExpected);
    });

    
    it('retrieves uuids from maps, selector: getMapsUuids', () => {
        const uuids = getMapsUuids(STATE_INITIALIZED);
        const uuidsExpected = Set.of(uuid1,uuid2,uuid3);
        // $FlowFixMe
        expect(uuids).toEqualImmutable(uuidsExpected);
    });
    
    it('getMapsTilesByUuid, TileRecord with conditions to get tiles', () => {
        const mapsTile = Map({
            [uuid1]: TileRecord({ uuid1, viewPortWidth:1, viewPortHeight:2,transformX:1,transformY:1,currentExpScale:1}),
        });
    
        const STATE:MapsTileT = MapsTileRecord({
            maps: mapsTile
        });
        const tilesbyUuid = getMapsTilesByUuid(STATE);

        expect(Map.isMap(tilesbyUuid)).toBeTruthy();
        expect(tilesbyUuid.size).toBe(1);

        const t1_0 = { x: 0, y: 0, z: 0, tx: 0, ty: 0 };
        const t1_translate = [0.001953125, 0.001953125]
        const t1_scale = 256;
        expect(tilesbyUuid.get(uuid1)[0]).toEqual(t1_0);
        expect(tilesbyUuid.get(uuid1).translate).toEqual(t1_translate);
        expect(tilesbyUuid.get(uuid1).scale).toEqual(t1_scale);
    });


    it('getViewPortSizeByUuid, retrieves viewPort by uuid', () => {
        const mapsTile = Map({
            [uuid1]: TileRecord({ uuid1, viewPortWidth:5, viewPortHeight:10}),
            [uuid2]: TileRecord({ uuid1, viewPortWidth:54, viewPortHeight:14}),
        });
    
        const STATE:MapsTileT = MapsTileRecord({
            maps: mapsTile
        });
        const viewPortbyUuid = getViewPortSizeByUuid(STATE);

        expect(Map.isMap(viewPortbyUuid)).toBeTruthy();
        expect(viewPortbyUuid.size).toBe(2);
        expect(viewPortbyUuid.get(uuid1)).toEqual({viewPortWidth:5, viewPortHeight:10});
        expect(viewPortbyUuid.get(uuid2)).toEqual({viewPortWidth:54, viewPortHeight:14});
    });

    it('getRenderModalityByUuid, retrieves renderModality by uuid', () => {
        const mapsTile = Map({
            [uuid1]: TileRecord({ scales:List([0,1,2]),uuid:uuid1, renderModality:EXP_RENDER_MODALITY}),
            [uuid2]: TileRecord({ scales:List([0,1]), uuid:uuid2, renderModality:LINEAR_RENDER_MODALITY}),
        });
    
        const STATE:MapsTileT = MapsTileRecord({
            maps: mapsTile
        });
        const renderModalityByUuid = getRenderModalityByUuid(STATE);

        expect(Map.isMap(renderModalityByUuid)).toBeTruthy();
        expect(renderModalityByUuid.size).toBe(2);
        expect(renderModalityByUuid.get(uuid1)).toEqual(EXP_RENDER_MODALITY);
        expect(renderModalityByUuid.get(uuid2)).toEqual(LINEAR_RENDER_MODALITY);
    });

    it('getRenderInfoByUuid, retrieves renderInfo by uuid', () => {
        const mapsTile = Map({
            [uuid1]: TileRecord({ scales:List([0,1,2]), uuid:uuid1, renderModality:EXP_RENDER_MODALITY}),
            [uuid2]: TileRecord({ scales:List([0,1]), uuid:uuid2, renderModality:LINEAR_RENDER_MODALITY}),
        });
    
        const STATE:MapsTileT = MapsTileRecord({
            maps: mapsTile
        });
        const renderInfos = getRenderInfoByUuid(STATE);
        const expectedExpRender = {
            expScaleExtent:  [32768, 131072],
            initExpScale: 65536,
            maxScaleConv: 9,
            scaleExtent: [0, 2],
            schemaHeight: 0,
            schemaWidth: 0
        };
        const expectedLinRender = {
            expScaleExtent:  [0, 256],
            initExpScale:0,
        }
        expect(Map.isMap(renderInfos)).toBeTruthy();
        expect(renderInfos.size).toBe(2);
        expect(renderInfos.get(uuid1)).toEqual(expectedExpRender);
        expect(renderInfos.get(uuid2)).toEqual(expectedLinRender);
    });

});