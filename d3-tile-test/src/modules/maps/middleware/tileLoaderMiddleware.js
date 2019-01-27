//@flow
/* eslint-disable no-console */
import {
  type Action,
  type GetState,
  type Dispatch
} from "@stweb-lib/redux-helper";
import { ZOOM_MAP } from "../actionDefinitions";
import { storeTileMap, storeMetaTileMap } from "../actionCreators";
import { serializeTileIndex } from "../utils";
import {
  type Tiles,
  type ParamTiles,
  type MapsRecord,
  MapRecord,
  TileValue,
  TileIndex
} from "../types";
import { ReferenceSystemScales } from "../../../types/maps";
import {
  getMapsTilesByUuid,
  getReferenceSystemScalesByUuid
} from "../selectors";

function isTileExpired(tileValue: TileValue, tileExpiration: number): boolean {
  if (tileExpiration === Infinity) return false;
  else {
    return new Date().getTime() - tileValue.timestamp > tileExpiration;
  }
}

/**
 * Calcola l'indice del metatile 3x3 a cui la tile iniziando da 0,0 che viene tagliata dal server.
 * E' come se shiftassi di 1,1 e allora lo aggiungo all'indice di partenza per calcolare in che metatile mi trovo.
 * La tile centrale dato l'indice del metatile è xMt = ixMt * 3
 * @param {TileIndex} index indice della tile di cui voglio conoscere il metatile
 */
function getMataTileIndex(index: TileIndex): TileIndex {
  const ixMt = Math.floor((index.x + 1) / 3);
  const xMt = /*1 + */ ixMt * 3;
  const iyMt = Math.floor((index.y + 1) / 3);
  const yMt = /*1 + */ iyMt * 3;
  return { x: xMt, y: yMt, z: index.z };
}

/**
 * Vogliamo intercettare le action di move map e fare le fetch per
 * caricare le tile svg nello store. Dopo spariamo la action che è stata caricata.
 * L'ipotesi è gestire anche la cache.
 */
export type TileUrlBuilderF = (
  baseUrl: string,
  width: number,
  height: number,
  x: number,
  y: number,
  zoomIndex: number
) => string;

export function createTileLoaderMiddleware(
  tileUrlBuilder: TileUrlBuilderF,
  useMetaTile: boolean
) {
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
            let index = null;
            let url = "";
            if (useMetaTile === true) {
              const metaTileIndex: TileIndex = getMataTileIndex({
                z: t.z,
                x: t.x,
                y: t.y
              });
              index = serializeTileIndex(metaTileIndex);
              url = tileUrlBuilder(
                map.baseTileServiceurl,
                map.width,
                map.height,
                metaTileIndex.x,
                metaTileIndex.y,
                refSystem.currentScaleInt
              );
            } else {
              // dispatch to sotre new tile in the cache -> storeTileMap
              index = serializeTileIndex({ z: t.z, x: t.x, y: t.y });
              url = tileUrlBuilder(
                map.baseTileServiceurl,
                map.width,
                map.height,
                t.x,
                t.y,
                refSystem.currentScaleInt
              );
            }

            const tileFound = map.tileCacheMap.get(index);
            if (
              (!tileFound || isTileExpired(tileFound, map.tileExpiration)) &&
              url !== "" &&
              !pendingFetchSet.has(url)
            ) {
              pendingFetchSet.add(url);
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
                  if (useMetaTile === true) {
                    const tiles = response.tileKeys.map(tileKey => {
                      const s = tileKey.x + "-" + tileKey.y;
                      return {
                        x: tileKey.x,
                        y: tileKey.y,
                        z: t.z,
                        tile: response.schemaMetaSvg[s]
                      };
                    });
                    dispatch(
                      storeMetaTileMap({
                        uuid: map.uuid,
                        tiles,
                        timestamp: new Date().getTime()
                      })
                    );
                  } else {
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
                  }
                  pendingFetchSet.delete(url);
                })
                .catch(e => {
                  console.error(e);
                  pendingFetchSet.delete(url);
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
