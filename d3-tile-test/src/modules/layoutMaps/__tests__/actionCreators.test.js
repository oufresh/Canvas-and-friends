/*eslint no-magic-numbers:*/
import {
  addMapToLayout,
  addSelectedMap,
  initLayoutMap,
  initSelectedMap,
  removeLayoutMap,
  removeSelectedMap
} from "../actionCreators";
import {
  INIT_LAYOUT_MAPS,
  ADD_MAP_TO_LAYOUT,
  ADD_SELECTED_MAP,
  INIT_SELECTED_MAP,
  REMOVE_LAYOUT_MAP,
  REMOVE_SELECTED_MAP
} from "../actionDefinitions";
import { NAMESPACE_LIST, NAMESPACE_TAB } from "../constants";

describe("actionCreator module layoutMaps", () => {
  it("check action initLayoutMap", () => {
    const uuids = ["uuid1,uuid2"];

    const actionActual = initLayoutMap({
      namespace: NAMESPACE_LIST,
      uuids
    });

    const actionExpected = {
      type: INIT_LAYOUT_MAPS,
      payload: {
        namespace: NAMESPACE_LIST,
        uuids
      }
    };
    expect(actionActual).toEqual(actionExpected);
  });

  it("check action addMapToLayout", () => {
    const uuid = "uuid1";

    const actionActual = addMapToLayout({ namespace: NAMESPACE_LIST, uuid });

    const actionExpected = {
      type: ADD_MAP_TO_LAYOUT,
      payload: {
        namespace: NAMESPACE_LIST,
        uuid
      }
    };
    expect(actionActual).toEqual(actionExpected);
  });

  it("check action addSelectedMap", () => {
    const uuid = "uuid1";

    const actionActual = addSelectedMap({ namespace: NAMESPACE_LIST, uuid });

    const actionExpected = {
      type: ADD_SELECTED_MAP,
      payload: {
        namespace: NAMESPACE_LIST,
        uuid
      }
    };
    expect(actionActual).toEqual(actionExpected);
  });

  it("check action initSelectedMap", () => {
    const uuids = ["uuid1,uuid2"];

    const actionActual = initSelectedMap({ namespace: NAMESPACE_TAB, uuids });

    const actionExpected = {
      type: INIT_SELECTED_MAP,
      payload: {
        namespace: NAMESPACE_TAB,
        uuids
      }
    };
    expect(actionActual).toEqual(actionExpected);
  });

  it("check action removeLayoutMap", () => {
    const uuid = "uuid1";

    const actionActual = removeLayoutMap({ namespace: NAMESPACE_LIST, uuid });

    const actionExpected = {
      type: REMOVE_LAYOUT_MAP,
      payload: {
        namespace: NAMESPACE_LIST,
        uuid
      }
    };
    expect(actionActual).toEqual(actionExpected);
  });

  it("check action removeSelectedMap", () => {
    const uuid = "uuid1";

    const actionActual = removeSelectedMap({ namespace: NAMESPACE_LIST, uuid });

    const actionExpected = {
      type: REMOVE_SELECTED_MAP,
      payload: {
        namespace: NAMESPACE_LIST,
        uuid
      }
    };
    expect(actionActual).toEqual(actionExpected);
  });
});
