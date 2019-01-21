//@flow

export type LayoutMapsT = {
  namespace: string,
  mapUuids: Array<string>,
  selectedMaps: Set<string>
};

export const initialStateLayoutMaps = {
  namespace: "",
  mapUuids: [],
  // $FlowFixMe
  selectedMaps: new Set()
};
