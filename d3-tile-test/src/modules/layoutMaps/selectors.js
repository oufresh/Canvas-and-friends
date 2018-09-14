//@flow
import {createSelector} from 'reselect';
import { type State } from 'stweb-redux-helper';
import { type LayoutMapsT} from './types';


const getRootDefault = (state:State):?LayoutMapsT => state;

/** metodo di utily da chiamare nel mapStateToProps per settare l'istanza corretta */
export const getRootByNameDeclaration = (rootState:string ) => (state:( state:State )=>?LayoutMapsT) => state.get(rootState);


export function selectorFactory(getRoot:( state:State )=>?LayoutMapsT = getRootDefault){
    const getLayoutMapsRoot = state => getRoot(state);
    const getSelectedMaps = createSelector([getLayoutMapsRoot], (layoutMaps:(layoutMaps:LayoutMapsT)=>Set<string>) => layoutMaps.selectedMaps);
    const getLayoutMapUuids = createSelector([getLayoutMapsRoot], (layoutMaps:(layoutMaps:LayoutMapsT)=>Array<string>) => layoutMaps.mapUuids);
    const getLayoutMapNamespace = createSelector([getLayoutMapsRoot], (layoutMaps:(layoutMaps:LayoutMapsT)=>string) => layoutMaps.namespace);

    return { getLayoutMapsRoot, getSelectedMaps, getLayoutMapUuids, getLayoutMapNamespace };
}
