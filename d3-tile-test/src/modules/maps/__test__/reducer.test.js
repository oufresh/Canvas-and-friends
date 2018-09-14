// @flow
/*eslint no-magic-numbers:*/
import * as matchers from 'jest-immutable-matchers';
import { Map,List } from 'immutable';
import {
    initialState,
    MapsTileRecord,
    TileRecord,
    type MapsTileT
} from '../types';
import { initTile, moveTile } from '../actionCreators';
import { maps } from '../reducer';
import { MOVE_TILE_ERROR, EXP_RENDER_MODALITY } from '../constants';

jest.mock('../utils');
import { uuidGenerator, now } from '../utils';

describe('maps reducer', () => {

    beforeEach(() => {
        // $FlowFixMe
        jest.addMatchers(matchers);
    });
    
    
    it('checks initial state', () => {
        const state = MapsTileRecord();
        // $FlowFixMe
        expect(state).toEqualImmutable(initialState);
    });
    

    it('change initialState after an initTile Action', () => {
        const uuid= 'uuidTile1';
        const creationDate = 1000;
        const viewPortWidth = 300;
        const viewPortHeight = 200;

        // $FlowFixMe
        now.mockImplementation(() => creationDate);

        const stateAfter = maps(initialState, initTile(uuid,viewPortWidth,viewPortHeight,1,1,1,1,[0,1],EXP_RENDER_MODALITY));
        const mapsTile = Map({
            [uuid]: TileRecord({
                creationDate,
                uuid,
                viewPortHeight,
                viewPortWidth,
                defaultScale: 1,
                height: 1,
                initScale: 1,
                maxScale: 1,
                minScale: 0,
                scales: List([0,1]),
                width: 1,
                renderModality:EXP_RENDER_MODALITY
            })
        });
        const stateExpected:MapsTileT = MapsTileRecord({
            maps: mapsTile
        });
        // $FlowFixMe
        expect(stateAfter).toEqualImmutable(stateExpected);
    });

    it('change initialState after an initTile Action with undefined uuid', () => {
        const width = 300;
        const height = 200;

        const UUID_GENERATED = 'ba1ec1f0-9171-11e8-8530-234da3c95c9a';
         // $FlowFixMe
        uuidGenerator.mockImplementation(() => UUID_GENERATED);
        const creationDate = 1000;
        // $FlowFixMe
        now.mockImplementation(() => creationDate);
        const stateAfter = maps(initialState, initTile(null,width,height,1,1,1,1,[0,1],EXP_RENDER_MODALITY));
        const mapsTile = Map({
            [UUID_GENERATED]: TileRecord({
                creationDate,
                defaultScale: 1,
                height: 1,
                initScale: 1,
                maxScale: 1,
                minScale: 0,
                scales: List([0,1]),
                uuid:UUID_GENERATED,
                viewPortHeight: height,
                viewPortWidth: width,
                width: 1,
                renderModality:EXP_RENDER_MODALITY
            })
        });
        const stateExpected:MapsTileT = MapsTileRecord({
            maps: mapsTile
        });
        // $FlowFixMe
        expect(stateAfter).toEqualImmutable(stateExpected);

    });

   it('change statebefore after an initTile Action', () => {
        const uuid= 'uuidTile1';
        const mapsTileBefore = Map({
            [uuid]: TileRecord({
                uuid,
                viewPortWidth: 100,
                viewPortHeight: 150,
                defaultPositionX: 10,
                defaultPositionY: 10,
            })
        });
        const stateBefore:MapsTileT = MapsTileRecord({
            maps: mapsTileBefore
        });

        const width = 300;
        const height = 200;
        const stateAfter = maps(stateBefore, initTile(uuid,width,height,1,1,1,1,[0,1],EXP_RENDER_MODALITY));
        const mapsTile = Map({
            [uuid]: TileRecord({
                uuid,
                viewPortWidth: width,
                viewPortHeight: height,
                defaultPositionX: 10,
                defaultPositionY: 10,
                defaultScale: 1,
                height: 1,
                initScale: 1,
                maxScale: 1,
                minScale: 0,
                scales: List([0,1]),
                width: 1,
                renderModality:EXP_RENDER_MODALITY
            })
        });
        const stateExpected:MapsTileT = MapsTileRecord({
            maps: mapsTile
        });
        // $FlowFixMe
        expect(stateAfter).toEqualImmutable(stateExpected);
    });


    it('change stateBefore after a moveTile Action', () => {
        const uuid= 'uuidTile1';
        const mapsTileBefore = Map({
            [uuid]: TileRecord({
                uuid,
                transformX: 2,
                transformY: 2,
                transformK: 2
            })
        });
        const stateBefore:MapsTileT = MapsTileRecord({
            maps: mapsTileBefore
        });

        const x = 5;
        const y = 7;
        const currentExpScale = 4;
        const stateAfter = maps(stateBefore, moveTile(uuid,x,y,currentExpScale));
        const mapsTile = Map({
            [uuid]: TileRecord({
                uuid,
                transformX: x,
                transformY: y,
                currentExpScale
            })
        });
        const stateExpected:MapsTileT = MapsTileRecord({
            maps: mapsTile
        });
        // $FlowFixMe
        expect(stateAfter).toEqualImmutable(stateExpected);
    });

    it('moveTile Action with uuid not into the state throw Error', () => {
        const t = () =>{
            const uuid1= 'uuidTile1';
            const mapsTileBefore = Map({
                [uuid1]: TileRecord({uuid:uuid1})
            });
            const stateBefore:MapsTileT = MapsTileRecord({
                maps: mapsTileBefore
            });
            const uuid2= 'uuidTile2';
            const x = 5;
            const y = 7;
            const currentExpScale = 4;
            maps(stateBefore, moveTile(uuid2,x,y,currentExpScale));
        }
 
        expect(t).toThrowError(MOVE_TILE_ERROR);
    });

});