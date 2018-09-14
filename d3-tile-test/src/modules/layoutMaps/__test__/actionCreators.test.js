// @flow
/*eslint no-magic-numbers:*/
import {
    addMapToLayout,
    addSelectedMap,
    initLayoutMap,
    initSelectedMap,
    type AddMapToLayoutT,
    type AddSelectedMapT,
    type InitLayoutMapT,
    type InitSelectedMapT
} from '../actionCreators';
import { INIT_LAYOUT_MAPS, ADD_MAP_TO_LAYOUT, ADD_SELECTED_MAP, INIT_SELECTED_MAP } from '../actionDefinitions';
import { NAMESPACE_LIST, NAMESPACE_TAB} from '../constants';
import {type Action} from 'stweb-redux-helper';


describe('actionCreator module layoutMaps', () => {
    
    it('check action initLayoutMap', () => {
        const uuids=['uuid1,uuid2'];

        const actionActual = initLayoutMap(NAMESPACE_LIST,uuids);

        const actionExpected:Action<InitLayoutMapT> = {
            type:INIT_LAYOUT_MAPS,
            payload:{
                namespace:NAMESPACE_LIST,
                uuids
            }
        }
        expect(actionActual).toEqual(actionExpected);
    });

    it('check action addMapToLayout', () => {
        const uuid='uuid1';

        const actionActual = addMapToLayout(NAMESPACE_LIST,uuid);

        const actionExpected:Action<AddMapToLayoutT> = {
            type:ADD_MAP_TO_LAYOUT,
            payload:{
                namespace:NAMESPACE_LIST,
                uuid
            }
        }
        expect(actionActual).toEqual(actionExpected);
    });

    it('check action addSelectedMap', () => {
        const uuid='uuid1';

        const actionActual = addSelectedMap(NAMESPACE_LIST,uuid);

        const actionExpected:Action<AddSelectedMapT> = {
            type:ADD_SELECTED_MAP,
            payload:{
                namespace:NAMESPACE_LIST,
                uuid
            }
        }
        expect(actionActual).toEqual(actionExpected);
    });

    it('check action initSelectedMap', () => {
        const uuids=['uuid1,uuid2'];

        const actionActual = initSelectedMap(NAMESPACE_TAB,uuids);

        const actionExpected:Action<InitSelectedMapT> = {
            type:INIT_SELECTED_MAP,
            payload:{
                namespace:NAMESPACE_TAB,
                uuids
            }
        }
        expect(actionActual).toEqual(actionExpected);
    });

});