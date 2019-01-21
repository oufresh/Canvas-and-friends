//@flow
import { createLeaf, createReducer } from "@stweb-lib/redux-helper";
import { initialStateLayoutMaps, type LayoutMapsT } from "./types";
import {
  INIT_LAYOUT_MAPS,
  ADD_MAP_TO_LAYOUT,
  ADD_SELECTED_MAP,
  INIT_SELECTED_MAP,
  REMOVE_LAYOUT_MAP,
  REMOVE_SELECTED_MAP
} from "./actionDefinitions";
import {
  type InitLayoutMapT,
  type AddMapToLayoutT,
  type AddSelectedMapT,
  type InitSelectedMapT,
  type RemoveLayoutMap,
  type RemoveSelectedMap
} from "./actionCreators";
import update from "immutability-helper";
import { LAYOUT_MAP_ERROR } from "./constants";

const initLayoutMapHandler = (
  state: LayoutMapsT,
  payload: InitLayoutMapT
): LayoutMapsT => {
  const { namespace, uuids } = payload;
  if (namespace !== state.namespace) return state;
  else {
    return update(state, {
      mapUuids: {
        $set: uuids
      }
    });
  }
};

const addMapToLayoutHandler = (
  state: LayoutMapsT,
  payload: AddMapToLayoutT
): LayoutMapsT => {
  const { namespace, uuid } = payload;
  if (namespace !== state.namespace) return state;
  else {
    return update(state, {
      mapUuids: {
        $push: [uuid]
      }
    });
  }
};

const addSelectedMapHandler = (
  state: LayoutMapsT,
  payload: AddSelectedMapT
): LayoutMapsT => {
  const { namespace, uuid } = payload;
  if (namespace !== state.namespace) return state;
  else {
    return update(state, {
      selectedMaps: {
        $add: [uuid]
      }
    });
  }
};

const initSelectedMapsHandler = (
  state: LayoutMapsT,
  payload: InitSelectedMapT
): LayoutMapsT => {
  const { namespace, uuids } = payload;
  if (namespace !== state.namespace) {
    return state;
  } else {
    const s = new Set(uuids);
    return update(state, {
      selectedMaps: {
        $set: s
      },
      mapUuids: {
        $set: uuids
      }
    });
  }
};

const removeSelectedMapHandler = (
  state,
  payload: RemoveSelectedMap
): LayoutMapsT => {
  const { namespace, uuid } = payload;
  if (namespace !== state.namespace) {
    return state;
  } else {
    return update(state, {
      selectedMaps: {
        $remove: [uuid]
      }
    });
  }
};

const removeLayoutMapHandler = (
  state,
  payload: RemoveLayoutMap
): LayoutMapsT => {
  const { namespace, uuid } = payload;
  if (namespace !== state.namespace) {
    return state;
  } else {
    // $unset non funziona
    const indexMapUuids = state.mapUuids.indexOf(uuid);
    if (indexMapUuids < 0) throw new Error(LAYOUT_MAP_ERROR);

    return update(state, {
      mapUuids: {
        $splice: [[indexMapUuids, 1]]
      },
      selectedMaps: {
        $remove: [uuid]
      }
    });
  }
};

export const layoutMaps = (namespace: string) => {
  let state = initialStateLayoutMaps;
  if (initialStateLayoutMaps.namespace === "") {
    state = update(initialStateLayoutMaps, { namespace: { $set: namespace } });
  }

  //$FlowFixMe
  return createReducer(state, [
    createLeaf(INIT_LAYOUT_MAPS, initLayoutMapHandler),
    createLeaf(INIT_SELECTED_MAP, initSelectedMapsHandler),
    createLeaf(ADD_MAP_TO_LAYOUT, addMapToLayoutHandler),
    createLeaf(ADD_SELECTED_MAP, addSelectedMapHandler),
    createLeaf(REMOVE_SELECTED_MAP, removeSelectedMapHandler),
    createLeaf(REMOVE_LAYOUT_MAP, removeLayoutMapHandler)
  ]);
};
