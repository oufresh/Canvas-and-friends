// @flow
/*eslint no-magic-numbers:*/
import { 
    selectorFactory
} 
from '../selectors';
import { LayoutMapsRecord, type LayoutMapsT } from '../types';
import { NAMESPACE_LIST } from '../constants';
import { Set, List } from 'immutable';
import * as matchers from 'jest-immutable-matchers';

describe('LayoutMaps selectors', () => {

    beforeEach(() => {
        // $FlowFixMe
        jest.addMatchers(matchers);
    });

    //recupero i selettori dal factory
    const { getLayoutMapNamespace, getLayoutMapUuids, getSelectedMaps} = selectorFactory();

    it('retrieves selected map uuids , selector: getSelectedMaps', () => {
        const uuid1= 'uuidTile1';
        const STATE:LayoutMapsT = LayoutMapsRecord({
            selectedMaps: Set([uuid1])
        });
        const uuids = getSelectedMaps(STATE);
        const expected =  Set([uuid1]);
        // $FlowFixMe
        expect(uuids).toEqualImmutable(expected);
    });

    it('retrieves layout map uuids , selector: getLayoutMapUuids', () => {
        const uuid1= 'uuidTile1';
        const STATE:LayoutMapsT = LayoutMapsRecord({
            mapUuids: List([uuid1])
        });
        const uuids = getLayoutMapUuids(STATE);
        const expected =  List([uuid1]);
        // $FlowFixMe
        expect(uuids).toEqualImmutable(expected);
    });

    it('retrieves namespace of state , selector: getLayoutMapNamespace', () => {
        const STATE:LayoutMapsT = LayoutMapsRecord({
            namespace: NAMESPACE_LIST
        });
        const uuids = getLayoutMapNamespace(STATE);
        // $FlowFixMe
        expect(uuids).toEqualImmutable(NAMESPACE_LIST);
    });

});