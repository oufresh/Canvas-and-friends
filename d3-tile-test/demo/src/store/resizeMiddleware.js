//@flow
import {
  type Action,
  type GetState,
  type Dispatch
} from "@stweb-lib/redux-helper";
import { debounce } from "lodash";

let inited = false;
const timeout = 500;

const resizeMiddleware = ({
  getState,
  dispatch
}: {
  getState: GetState,
  dispatch: Dispatch
}) => (next: Function) => (action: Action<*>) => {
  if (inited === false) {
    window.addEventListener(
      "resize",
      debounce(() => {
        dispatch({
          type: "RESIZE",
          payload: {}
        });
      }, timeout)
    );
    inited = true;
  }
  return next(action);
};

export { resizeMiddleware };
