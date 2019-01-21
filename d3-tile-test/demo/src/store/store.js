//@flow
import { createStore, compose, applyMiddleware } from "redux";
import { responsiveStoreEnhancer } from "redux-responsive";
import { createLogger } from "redux-logger";
import { resizeMiddleware } from "./resizeMiddleware";
import reducers from "./reducers";
import { createTileLoaderMiddleware } from "../../../src/modules/maps/middleware";

const composeEnhancers = () =>
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ /*({
    serialize: true
})*/ ||
  compose;

const logger = createLogger({
  predicate: (getState, action) => {
    if (action.type.includes("STORE_TILE")) {
      //console.log("---------STORE_TILE----------");
      return false;
    }
    return true;
  }
});

const tileUrlBuilder = (
  baseUrl: string,
  width: number,
  height: number,
  x: number,
  y: number,
  zoomIndex: number
) => {
  return `${baseUrl}/${width}/${height}/${zoomIndex}/${x}/${y}?id=none&infoDAL=none&codApp=none`;
};

const tileLoaderMiddleware = createTileLoaderMiddleware(tileUrlBuilder);

const middlewares = applyMiddleware(
  resizeMiddleware,
  tileLoaderMiddleware,
  logger
);

export default createStore(
  reducers,
  composeEnhancers()(responsiveStoreEnhancer, middlewares)
);
