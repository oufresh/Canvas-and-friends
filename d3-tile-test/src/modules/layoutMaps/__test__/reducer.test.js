// @flow
/*eslint no-magic-numbers:*/
import * as matchers from 'jest-immutable-matchers';
import { List, Set } from 'immutable';
import { LayoutMapsRecord, initialState } from '../types';
import { layoutMaps } from '../reducer';
import { initLayoutMap, addMapToLayout, addSelectedMap, initSelectedMap } from '../actionCreators';
import { NAMESPACE_POPUP , NAMESPACE_LIST} from '../constants';

describe('reducer layoutMaps', () => {
    
    beforeEach(() => {
        // $FlowFixMe
        jest.addMatchers(matchers);
    });

    it('checks initial state', () => {
        const state = LayoutMapsRecord();
        // $FlowFixMe
        expect(state).toEqualImmutable(initialState);
    });

    it('check initLayoutMap handler different namespace', () => {
        const namespace = NAMESPACE_LIST;
        const uuids = ['uuid1','uuid2'];
        const state = LayoutMapsRecord({namespace});
        const stateAfter = layoutMaps(namespace)(state, initLayoutMap(NAMESPACE_POPUP,uuids));
        const stateExpected = LayoutMapsRecord({namespace});
        // $FlowFixMe
        expect(stateExpected).toEqualImmutable(stateAfter);
    });

    it('check initLayoutMap handler exact namespace', () => {
        const namespace = NAMESPACE_LIST;
        const uuids = ['uuid1','uuid2'];
        const state = LayoutMapsRecord({namespace});
        const stateAfter = layoutMaps(namespace)(state, initLayoutMap(namespace,uuids));
        const stateExpected = LayoutMapsRecord({namespace, mapUuids: List(uuids)});
        // $FlowFixMe
        expect(stateExpected).toEqualImmutable(stateAfter);
    });

    it('check initLayoutMap handler exact namespace and override previus list', () => {
        const namespace = NAMESPACE_LIST;
        const state = LayoutMapsRecord({namespace, mapUuids:List(['uuid1','uuidd2'])});
        const uuids = ['uuid3','uuid4'];
        const stateAfter = layoutMaps(namespace)(state, initLayoutMap(namespace,uuids));
        const stateExpected = LayoutMapsRecord({namespace, mapUuids: List(uuids)});
        // $FlowFixMe
        expect(stateExpected).toEqualImmutable(stateAfter);
    });

    it('check addMapToLayout handler different namespace', () => {
        const namespace = NAMESPACE_LIST;
        const uuid ='uuid1';
        const state = LayoutMapsRecord({namespace});
        const stateAfter = layoutMaps(namespace)(state, addMapToLayout(NAMESPACE_POPUP,uuid));
        const stateExpected = LayoutMapsRecord({namespace});
        // $FlowFixMe
        expect(stateExpected).toEqualImmutable(stateAfter);
    });

    it('check addMapToLayout handler exact namespace', () => {
        const namespace = NAMESPACE_LIST;
        const uuid ='uuid1';
        const state = LayoutMapsRecord({namespace});
        const stateAfter = layoutMaps(namespace)(state, addMapToLayout(namespace,uuid));
        const stateExpected = LayoutMapsRecord({namespace, mapUuids: List([uuid])});
        // $FlowFixMe
        expect(stateExpected).toEqualImmutable(stateAfter);
    });

    it('check addSelectedMap handler different namespace', () => {
        const namespace = NAMESPACE_LIST;
        const uuid ='uuid1';
        const state = LayoutMapsRecord({namespace});
        const stateAfter = layoutMaps(namespace)(state, addSelectedMap(NAMESPACE_POPUP,uuid));
        const stateExpected = LayoutMapsRecord({namespace});
        // $FlowFixMe
        expect(stateExpected).toEqualImmutable(stateAfter);
    });

    it('check addSelectedMap handler exact namespace', () => {
        const namespace = NAMESPACE_LIST;
        const uuid ='uuid1';
        const state = LayoutMapsRecord({namespace});
        const stateAfter = layoutMaps(namespace)(state, addSelectedMap(namespace,uuid));
        const stateExpected = LayoutMapsRecord({namespace, selectedMaps: Set([uuid])});
        // $FlowFixMe
        expect(stateExpected).toEqualImmutable(stateAfter);
    });

    it('check initSelectedMap handler different namespace', () => {
        const namespace = NAMESPACE_LIST;
        const uuids = ['uuid1','uuid2'];
        const state = LayoutMapsRecord({namespace});
        const stateAfter = layoutMaps(namespace)(state, initSelectedMap(NAMESPACE_POPUP,uuids));
        const stateExpected = LayoutMapsRecord({namespace});
        // $FlowFixMe
        expect(stateExpected).toEqualImmutable(stateAfter);
    });

    it('check initSelectedMap handler exact namespace', () => {
        const namespace = NAMESPACE_LIST;
        const uuids = ['uuid1','uuid2'];
        const state = LayoutMapsRecord({namespace});
        const stateAfter = layoutMaps(namespace)(state, initSelectedMap(namespace,uuids));
        const stateExpected = LayoutMapsRecord({namespace, selectedMaps: Set(uuids)});
        // $FlowFixMe
        expect(stateExpected).toEqualImmutable(stateAfter);
    });

});