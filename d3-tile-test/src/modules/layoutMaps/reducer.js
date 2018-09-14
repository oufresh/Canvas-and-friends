//@flow
import { createLeaf, createReducer } from 'stweb-redux-helper';
import { initialState } from './types';
import { INIT_LAYOUT_MAPS, ADD_MAP_TO_LAYOUT, ADD_SELECTED_MAP, INIT_SELECTED_MAP } from './actionDefinitions';
import { List, Set } from 'immutable';


const initLayoutMapHandler = (state, payload) => {
    const {namespace, uuids} = payload;
    if(namespace !== state.namespace)
        return state;
    else
        return state.set('mapUuids',List(uuids));
};

const addMapToLayoutHandler = (state, payload) =>{
    const {namespace, uuid} = payload;
    if(namespace !== state.namespace)
        return state;
    else
        return state.set('mapUuids',state.mapUuids.push(uuid));
}

const addSelectedMapHandler = (state, payload) =>{
    const {namespace, uuid} = payload;
    if(namespace !== state.namespace)
        return state;
    else
        return state.set('selectedMaps', state.selectedMaps.add(uuid));
}

const initSelectedMapsHandler = (state, payload) => {
    const {namespace, uuids} = payload;
    if(namespace !== state.namespace)
        return state;
    else
        return state.set('selectedMaps',Set(uuids));
};

export const layoutMaps = (namespace: string) => {
    let state = initialState;
    if(initialState.namespace.length === 0)
        state = initialState.set('namespace', namespace);
    
    return createReducer(state, [
        createLeaf(INIT_LAYOUT_MAPS, initLayoutMapHandler),
        createLeaf(INIT_SELECTED_MAP, initSelectedMapsHandler),
        createLeaf(ADD_MAP_TO_LAYOUT, addMapToLayoutHandler),
        createLeaf(ADD_SELECTED_MAP, addSelectedMapHandler)
    ]);
}