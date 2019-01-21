/*eslint no-magic-numbers:*/
import { initialStateLayoutMaps } from "../types";
import { layoutMaps } from "../reducer";
import {
  initLayoutMap,
  addMapToLayout,
  addSelectedMap,
  initSelectedMap,
  removeSelectedMap,
  removeLayoutMap
} from "../actionCreators";
import {
  NAMESPACE_POPUP,
  NAMESPACE_LIST,
  LAYOUT_MAP_ERROR
} from "../constants";

describe("reducer layoutMaps", () => {
  it("check initLayoutMap handler different namespace", () => {
    const namespace = NAMESPACE_LIST;
    const uuids = ["uuid1", "uuid2"];
    const state = initialStateLayoutMaps;
    state.namespace = NAMESPACE_LIST;
    const stateAfter = layoutMaps(namespace)(
      state,
      initLayoutMap({
        namespace: NAMESPACE_POPUP,
        uuids
      })
    );
    const stateExpected = {
      namespace: NAMESPACE_LIST,
      mapUuids: [],
      selectedMaps: new Set()
    };
    expect(stateExpected).toEqual(stateAfter);
  });

  it("check initLayoutMap handler exact namespace", () => {
    const namespace = NAMESPACE_LIST;
    const uuids = ["uuid1", "uuid2"];
    const state = {
      namespace,
      mapUuids: [],
      selectedMaps: new Set()
    };
    const stateAfter = layoutMaps(namespace)(
      state,
      initLayoutMap({ namespace, uuids })
    );
    const stateExpected = {
      namespace,
      mapUuids: uuids,
      selectedMaps: new Set()
    };
    expect(stateExpected).toEqual(stateAfter);
  });

  it("check initLayoutMap handler exact namespace and override previus list", () => {
    const namespace = NAMESPACE_LIST;
    const state = {
      namespace,
      mapUuids: ["uuid1", "uuidd2"],
      selectedMaps: new Set()
    };
    const uuids = ["uuid3", "uuid4"];
    const stateAfter = layoutMaps(namespace)(
      state,
      initLayoutMap({ namespace, uuids })
    );
    const stateExpected = {
      namespace,
      mapUuids: uuids,
      selectedMaps: new Set()
    };
    expect(stateExpected).toEqual(stateAfter);
  });

  it("check addMapToLayout handler different namespace", () => {
    const namespace = NAMESPACE_LIST;
    const uuid = "uuid1";
    const state = {
      namespace,
      mapUuids: [],
      selectedMaps: new Set()
    };
    const stateAfter = layoutMaps(namespace)(
      state,
      addMapToLayout({ namespace: NAMESPACE_POPUP, uuid })
    );
    const stateExpected = {
      namespace,
      mapUuids: [],
      selectedMaps: new Set()
    };
    expect(stateExpected).toEqual(stateAfter);
  });

  it("check addMapToLayout handler exact namespace", () => {
    const namespace = NAMESPACE_LIST;
    const uuid = "uuid1";
    const state = {
      namespace,
      mapUuids: [],
      selectedMaps: new Set()
    };
    const stateAfter = layoutMaps(namespace)(
      state,
      addMapToLayout({ namespace, uuid })
    );
    const stateExpected = {
      namespace,
      mapUuids: [uuid],
      selectedMaps: new Set()
    };
    expect(stateExpected).toEqual(stateAfter);
  });

  it("check addSelectedMap handler different namespace", () => {
    const namespace = NAMESPACE_LIST;
    const uuid = "uuid1";
    const state = {
      namespace,
      mapUuids: [],
      selectedMaps: new Set()
    };
    const stateAfter = layoutMaps(namespace)(
      state,
      addSelectedMap({ namespace: NAMESPACE_POPUP, uuid })
    );
    const stateExpected = {
      namespace,
      mapUuids: [],
      selectedMaps: new Set()
    };
    expect(stateExpected).toEqual(stateAfter);
  });

  it("check addSelectedMap handler exact namespace", () => {
    const namespace = NAMESPACE_LIST;
    const uuid = "uuid1";
    const state = {
      namespace,
      mapUuids: [],
      selectedMaps: new Set()
    };
    const stateAfter = layoutMaps(namespace)(
      state,
      addSelectedMap({ namespace, uuid })
    );
    const stateExpected = {
      mapUuids: [],
      namespace,
      selectedMaps: new Set([uuid])
    };
    expect(stateExpected).toEqual(stateAfter);
  });

  it("check initSelectedMap handler different namespace", () => {
    const namespace = NAMESPACE_LIST;
    const uuids = ["uuid1", "uuid2"];
    const state = {
      namespace,
      mapUuids: uuids,
      selectedMaps: new Set()
    };
    const stateAfter = layoutMaps(namespace)(
      state,
      initSelectedMap({ namespace: NAMESPACE_POPUP, uuids })
    );
    const stateExpected = {
      namespace,
      mapUuids: uuids,
      selectedMaps: new Set()
    };
    expect(stateExpected).toEqual(stateAfter);
  });

  it("check initSelectedMap handler exact namespace", () => {
    const namespace = NAMESPACE_LIST;
    const uuids = ["uuid1", "uuid2"];
    const state = {
      namespace,
      mapUuids: [],
      selectedMaps: new Set()
    };
    const stateAfter = layoutMaps(namespace)(
      state,
      initSelectedMap({ namespace, uuids })
    );
    const stateExpected = {
      namespace,
      mapUuids: uuids,
      selectedMaps: new Set(uuids)
    };
    expect(stateExpected).toEqual(stateAfter);
  });

  it("check removeSelectedMap handler exact namespace", () => {
    const namespace = NAMESPACE_LIST;
    const uuids = ["uuid1", "uuid2"];
    const state = {
      namespace,
      mapUuids: uuids,
      selectedMaps: new Set(uuids)
    };
    const stateAfter = layoutMaps(namespace)(
      state,
      removeSelectedMap({ namespace, uuid: "uuid1" })
    );
    const stateExpected = {
      namespace,
      mapUuids: uuids,
      selectedMaps: new Set(["uuid2"])
    };

    expect(stateExpected).toEqual(stateAfter);
  });

  it("check removeSelectedMap handler different namespace", () => {
    const namespace = NAMESPACE_LIST;
    const uuids = ["uuid1", "uuid2"];
    const state = {
      namespace,
      mapUuids: uuids,
      selectedMaps: new Set()
    };
    const stateAfter = layoutMaps(namespace)(
      state,
      removeSelectedMap({ namespace: NAMESPACE_POPUP, uuids })
    );
    const stateExpected = {
      namespace,
      mapUuids: uuids,
      selectedMaps: new Set()
    };
    expect(stateExpected).toEqual(stateAfter);
  });

  it("check removeLayoutMap handler exact namespace", () => {
    const namespace = NAMESPACE_LIST;
    const uuids = ["uuid1", "uuid2"];
    const state = {
      namespace,
      mapUuids: uuids,
      selectedMaps: new Set(uuids)
    };
    const stateAfter = layoutMaps(namespace)(
      state,
      removeLayoutMap({ namespace, uuid: "uuid1" })
    );
    const stateExpected = {
      namespace,
      mapUuids: ["uuid2"],
      selectedMaps: new Set(["uuid2"])
    };
    expect(stateAfter).toEqual(stateExpected);
  });

  it("check removeLayoutMap handler different namespace", () => {
    const namespace = NAMESPACE_LIST;
    const uuids = ["uuid1", "uuid2"];
    const state = {
      namespace,
      mapUuids: uuids,
      selectedMaps: new Set()
    };
    const stateAfter = layoutMaps(namespace)(
      state,
      removeLayoutMap({ namespace: NAMESPACE_POPUP, uuid: "uuid1" })
    );
    const stateExpected = {
      namespace,
      mapUuids: uuids,
      selectedMaps: new Set()
    };
    expect(stateExpected).toEqual(stateAfter);
  });

  it("removeLayoutMap Action with uuid not into the state mapUuids throw Error", () => {
    const t = () => {
      const namespace = NAMESPACE_LIST;
      const uuids = ["uuid1"];
      const state = {
        namespace,
        mapUuids: uuids,
        selectedMaps: new Set()
      };
      layoutMaps(namespace)(
        state,
        removeLayoutMap({ namespace: NAMESPACE_LIST, uuid: "notIntoState" })
      );
    };

    expect(t).toThrowError(LAYOUT_MAP_ERROR);
  });
});
