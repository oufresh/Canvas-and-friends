//@flow
import { createSelector } from "reselect";
import { checkState, type State } from "@stweb-lib/redux-helper";

let getRoot = (state: State): any => state;

export const setRootBrowser = (rootGetter: State => ?any): void => {
  getRoot = rootGetter;
};

export const getBrowserRoot = (state: State): any => checkState(getRoot(state));

export const getBrowser = createSelector(
  [getBrowserRoot],
  (browser: any): any => browser
);
