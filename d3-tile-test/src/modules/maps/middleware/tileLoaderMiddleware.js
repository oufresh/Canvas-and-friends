//@flow
/* eslint-disable no-console */
import {
  type Action,
  type GetState,
  type Dispatch
} from "@stweb-lib/redux-helper";
import { ZOOM_MAP } from "../actionDefinitions";
import { storeTileMap } from "../actionCreators";
import { serializeTileIndex } from "../utils";
import {
  type Tiles,
  type ParamTiles,
  type MapsRecord,
  MapRecord,
  TileValue
} from "../types";
import { ReferenceSystemScales } from "../../../types/maps";
import {
  getMapsTilesByUuid,
  getReferenceSystemScalesByUuid
} from "../selectors";

/**
 * Vogliamo intercettare le action di move map e fare le fetch per
 * caricare le tile svg nello store. Dopo spariamo la action che è stata caricata.
 * L'ipotesi è gestire anche la cache.
 */

const defaultTileUrlBuilder = (
  baseUrl: string,
  width: number,
  height: number,
  x: number,
  y: number,
  zoomIndex: number
) => {
  return `${baseUrl}/${width}/${height}/${zoomIndex}/${x}/${y}?id=none&infoDAL=none&codApp=none`;
};

function isTileExpired(tileValue: TileValue, tileExpiration: number): boolean {
  if (tileExpiration === Infinity) return false;
  else {
    return new Date().getTime() - tileValue.timestamp > tileExpiration;
  }
}

export type TileUrlBuilderF = (
  baseUrl: string,
  width: number,
  height: number,
  x: number,
  y: number,
  zoomIndex: number
) => string;

export function createTileLoaderMiddleware(tileUrlBuilder: TileUrlBuilderF) {
  const pendingFetchSet: Set<string> = new Set();
  return ({
    getState,
    dispatch
  }: {
    getState: GetState,
    dispatch: Dispatch
  }) => (next: Function) => (action: Action<*>) => {
    if (action.type === ZOOM_MAP) {
      let result = next(action);
      //$FlowFixMe
      const mapsRecord: MapsRecord = getState().get("maps");
      if (mapsRecord) {
        const { uuid } = action.payload;
        const map: MapRecord | typeof undefined = mapsRecord.maps.get(uuid);
        const tiles: Tiles | typeof undefined = getMapsTilesByUuid(
          getState()
        ).get(uuid);

        //ignore per problemi di eslint
        // prettier-ignore
        const refSystem: ReferenceSystemScales | typeof undefined = 
          getReferenceSystemScalesByUuid(getState()).get(uuid);
        if (
          tiles &&
          refSystem &&
          map &&
          map.expScaleOffset &&
          map.currentExpScale
        ) {
          //const currentScaleInt = refSystem.currentScaleInt;
          tiles.forEach((t: ParamTiles) => {
            // dispatch to sotre new tile in the cache -> storeTileMap
            const index = serializeTileIndex({ z: t.z, x: t.x, y: t.y });
            //console.log(index);
            const tileFound = map.tileCacheMap.get(index);
            if (
              (!tileFound || isTileExpired(tileFound, map.tileExpiration)) &&
              !pendingFetchSet.has(index)
            ) {
              const url = tileUrlBuilder(
                map.baseTileServiceurl,
                map.width,
                map.height,
                t.x,
                t.y,
                refSystem.currentScaleInt
              );
              pendingFetchSet.add(index);
              fetch(url)
                .then(r => {
                  if (r.ok === true) return r.json();
                  else throw new Error(r.statusText);
                })
                .then(response => {
                  /*console.log(
                    "Received tile: " +
                      serializeTileIndex({ z: t.z, x: t.x, y: t.y }) +
                      ", " +
                      new Date().toISOString()
                  );*/
                  dispatch(
                    storeTileMap({
                      uuid: map.uuid,
                      z: t.z,
                      x: t.x,
                      y: t.y,
                      tile: response.schemaSvg,
                      timestamp: new Date().getTime()
                    })
                  );
                  pendingFetchSet.delete(index);
                })
                .catch(e => {
                  console.error(e);
                  pendingFetchSet.delete(index);
                });
            }
          });
        }
      }
      return result;
    }
    return next(action);
  };
}

const tileLoaderMiddleware = ({
  getState,
  dispatch
}: {
  getState: GetState,
  dispatch: Dispatch
}) => (next: Function) => (action: Action<*>) => {
  if (action.type === ZOOM_MAP) {
    // console.log("Detected action zoom map");
    // console.log(action.payload);
    let result = next(action);
    // console.log("Dispatch action zoom map end");

    //$FlowFixMe
    const mapsRecord: MapsRecord = getState().get("maps");
    if (mapsRecord) {
      const { uuid } = action.payload;
      const map: MapRecord | typeof undefined = mapsRecord.maps.get(uuid);
      const tiles: Tiles | typeof undefined = getMapsTilesByUuid(
        getState()
      ).get(uuid);

      //ignore per problemi di eslint
      // prettier-ignore
      const refSystem: ReferenceSystemScales | typeof undefined = 
        getReferenceSystemScalesByUuid(getState()).get(uuid);

      if (
        tiles &&
        refSystem &&
        map &&
        map.expScaleOffset &&
        map.currentExpScale
      ) {
        //const currentScaleInt = refSystem.currentScaleInt;
        tiles.forEach((t: ParamTiles) => {
          // dispatch to sotre new tile in the cache -> storeTileMap
          // prettier-ignore
          const tileFound = map.tileCacheMap.get(serializeTileIndex({z: t.z, x: t.x, y: t.y}));
          if (
            !tileFound ||
            isTileExpired(tileFound, map.tileExpiration) === true
          ) {
            const url = defaultTileUrlBuilder(
              map.baseTileServiceurl,
              map.width,
              map.height,
              t.x,
              t.y,
              refSystem.currentScaleInt
            );
            fetch(url)
              .then(r => {
                if (r.ok === true) return r.json();
                else throw new Error(r.statusText);
              })
              .then(response => {
                //console.log('Received tile: ' + svgString);
                dispatch(
                  storeTileMap({
                    uuid: map.uuid,
                    z: t.z,
                    x: t.x,
                    y: t.y,
                    tile: response.schemaSvg,
                    timestamp: new Date().getTime()
                  })
                );
              })
              .catch(e => {
                console.error(e);
              });
          }
        });
      }
    }

    return result;
  }

  return next(action);
};

export { tileLoaderMiddleware };
