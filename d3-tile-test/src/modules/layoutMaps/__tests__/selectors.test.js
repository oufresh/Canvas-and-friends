/*eslint no-magic-numbers:*/
import { selectorFactory } from "../selectors";
import { type LayoutMapsT } from "../types";
import { NAMESPACE_LIST } from "../constants";

describe("LayoutMaps selectors", () => {

  //recupero i selettori dal factory
  const {
    getLayoutMapNamespace,
    getLayoutMapUuids,
    getSelectedMaps
  } = selectorFactory();

  it("retrieves selected map uuids , selector: getSelectedMaps", () => {
    const uuid1 = "uuidTile1";
    const STATE: LayoutMapsT = {
      selectedMaps: new Set([uuid1])
    };
    const uuids = getSelectedMaps(STATE);
    const expected = new Set([uuid1]);
    // $FlowFixMe
    expect(uuids).toEqual(expected);
  });

  it("retrieves layout map uuids , selector: getLayoutMapUuids", () => {
    const uuid1 = "uuidTile1";
    const STATE: LayoutMapsT = {
      mapUuids: [uuid1]
    };
    const uuids = getLayoutMapUuids(STATE);
    const expected = [uuid1];
    // $FlowFixMe
    expect(uuids).toEqual(expected);
  });

  it("retrieves namespace of state , selector: getLayoutMapNamespace", () => {
    const STATE: LayoutMapsT = {
      namespace: NAMESPACE_LIST
    };
    const uuids = getLayoutMapNamespace(STATE);
    // $FlowFixMe
    expect(uuids).toEqual(NAMESPACE_LIST);
  });
});
