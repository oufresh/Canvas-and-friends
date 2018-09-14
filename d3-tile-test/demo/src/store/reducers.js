import { combineReducersAndSelector, type ReducersMap } from 'stweb-redux-helper';
import { maps,
    setRootMaps,
    layoutMaps,
    NAMESPACE_LIST,
    NAMESPACE_POPUP,
    NAMESPACE_TAB,
    selectorFactory,
    getRootByNameDeclaration } 
from '../../../src/modules';

const reducersMap:ReducersMap = {
    layoutMapsList: layoutMaps(NAMESPACE_LIST),
    layoutMapsPopup: layoutMaps(NAMESPACE_POPUP),
    layoutMapsTab: layoutMaps(NAMESPACE_TAB),
    maps: [maps, setRootMaps]
};

export const selectorLayoutMapsList = selectorFactory(getRootByNameDeclaration('layoutMapsList'));
export const selectorLayoutMapsPopup = selectorFactory(getRootByNameDeclaration('layoutMapsPopup'));
export const selectorLayoutMapsTab = selectorFactory(getRootByNameDeclaration('layoutMapsTab'));

export default combineReducersAndSelector(reducersMap);