//@flow
import {type Action, createAction} from 'stweb-redux-helper';
import { INIT_LAYOUT_MAPS, ADD_MAP_TO_LAYOUT, ADD_SELECTED_MAP, INIT_SELECTED_MAP} from './actionDefinitions';

/*----- Types -----*/

export type InitLayoutMapT = {
    namespace:string,
    uuids:Array<string>
};

export type AddMapToLayoutT = {
    namespace:string,
    uuid:string
};

export type AddSelectedMapT = {
    namespace:string,
    uuid:string
};

export type InitSelectedMapT = {
    namespace:string,
    uuids:Array<string>
};


/*----- Actions ----- */

export const initLayoutMap = (namespace:string, uuids:Array<string>):Action<InitLayoutMapT> =>{
    return createAction(INIT_LAYOUT_MAPS, { namespace,uuids });
}

export const addMapToLayout = (namespace:string, uuid:string):Action<AddMapToLayoutT> =>{
    return createAction(ADD_MAP_TO_LAYOUT, { namespace,uuid });
}

export const addSelectedMap = (namespace:string, uuid:string):Action<AddSelectedMapT> =>{
    return createAction(ADD_SELECTED_MAP, { namespace,uuid });
}

export const initSelectedMap = (namespace:string, uuids:Array<string>):Action<InitSelectedMapT> =>{
    return createAction(INIT_SELECTED_MAP, { namespace,uuids });
}