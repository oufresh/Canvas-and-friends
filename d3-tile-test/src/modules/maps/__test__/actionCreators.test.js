// @flow
/*eslint no-magic-numbers:*/
import {
    initTile,
    moveTile,
    type InitTileT,
    type MoveTileT
} from '../actionCreators';
import { INIT_TILE, MOVE_TILE } from '../actionDefinitions';
import {type Action} from 'stweb-redux-helper';
import { EXP_RENDER_MODALITY } from '../constants';


describe('actionCreator module maps', () => {
    
    it('check action initTile', () => {
        const uuid= 'uuidTile1';
        const viewPortWidth = 300;
        const viewPortHeight = 200;
        const actionActual = initTile(uuid,viewPortWidth,viewPortHeight,1,1,1,1,[0,1],EXP_RENDER_MODALITY);

        const actionExpected:Action<InitTileT> = {
            type:INIT_TILE,
            payload:{
                uuid,
                height:1,
                width:1,
                defaultScale:1,
                initScale:1,
                viewPortHeight,
                viewPortWidth,
                scales:[0,1],
                renderModality:EXP_RENDER_MODALITY
            }
        }

        expect(actionActual).toEqual(actionExpected);
    });

    it('check action moveTile', () => {
        const uuidTile = 'uuidTile1';
        const x = 5;
        const y = 7;
        const currentExpScale = 7;
        const actionActual = moveTile(uuidTile,x,y,currentExpScale);

        const actionExpected:Action<MoveTileT> = {
            type:MOVE_TILE,
            payload:{
                uuid: uuidTile,
                x,
                y,
                currentExpScale
            }
        }
        expect(actionActual).toEqual(actionExpected);
    });

});