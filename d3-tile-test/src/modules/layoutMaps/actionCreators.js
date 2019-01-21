//@flow
import { type Action, createAction } from "@stweb-lib/redux-helper";
import {
  ADD_MAP_TO_LAYOUT,
  ADD_SELECTED_MAP,
  INIT_LAYOUT_MAPS,
  INIT_SELECTED_MAP,
  REMOVE_LAYOUT_MAP,
  REMOVE_SELECTED_MAP
} from "./actionDefinitions";

/*----- Types -----*/

export type InitLayoutMapT = {|
  namespace: string,
  uuids: Array<string>
|};

export type AddMapToLayoutT = {|
  namespace: string,
  uuid: string
|};

export type AddSelectedMapT = {|
  namespace: string,
  uuid: string
|};

export type InitSelectedMapT = {|
  namespace: string,
  uuids: Array<string>
|};

export type RemoveSelectedMap = {|
  namespace: string,
  uuid: string
|};

export type RemoveLayoutMap = {|
  namespace: string,
  uuid: string
|};

/*----- Actions ----- */

export const initLayoutMap = (
  initLayout: InitLayoutMapT
): Action<InitLayoutMapT> => {
  return createAction(INIT_LAYOUT_MAPS, initLayout);
};

export const addMapToLayout = (
  addMapLayout: AddMapToLayoutT
): Action<AddMapToLayoutT> => {
  return createAction(ADD_MAP_TO_LAYOUT, addMapLayout);
};

export const addSelectedMap = (
  addSelectedMap: AddSelectedMapT
): Action<AddSelectedMapT> => {
  return createAction(ADD_SELECTED_MAP, addSelectedMap);
};

export const initSelectedMap = (
  initSelectedMap: InitSelectedMapT
): Action<InitSelectedMapT> => {
  return createAction(INIT_SELECTED_MAP, initSelectedMap);
};

export const removeSelectedMap = (
  remove: RemoveSelectedMap
): Action<RemoveSelectedMap> => {
  return createAction(REMOVE_SELECTED_MAP, remove);
};

export const removeLayoutMap = (
  remove: RemoveLayoutMap
): Action<RemoveLayoutMap> => {
  return createAction(REMOVE_LAYOUT_MAP, remove);
};