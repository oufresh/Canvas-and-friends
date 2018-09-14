//@flow
import { List, Record, Set } from 'immutable';

export const LayoutMapsRecord = Record({
    namespace: '',
    mapUuids: List(),
    selectedMaps: Set()
}:{
    namespace:string,
    mapUuids:Array<string>,
    selectedMaps:Set<string>
});

export const initialState = LayoutMapsRecord();
export type LayoutMapsT = typeof initialState;
