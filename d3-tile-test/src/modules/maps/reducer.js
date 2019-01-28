//@flow
import { createLeaf, createReducer } from "@stweb-lib/redux-helper";
import update from "immutability-helper";
import {
  INIT_MAP,
  MOVE_MAP,
  ZOOM_MAP,
  RESIZE_MAP,
  REMOVE_MAP,
  STORE_TILE_MAP,
  STORE_METATILE_MAP,
  LOADING_TILES_MAP
} from "./actionDefinitions";
import {
  type InitMap,
  type MoveMap,
  ZoomMap,
  type ResizeMap,
  type RemoveMap,
  StoreTileMap,
  StoreMetaTileMap,
  MetaTileElement,
  LoadingTilesMap
} from "./actionCreators";
import {
  initialMapsRecord,
  initialMapRecord,
  type MapsRecord,
  TileIndex,
  TileValue
} from "./types";
import { MAP_ERROR } from "./errors";
import { uuidGenerator, now, serializeTileIndex } from "./utils";

const initMapHandler = (state: MapsRecord, payload: InitMap): MapsRecord => {
  let { uuid, initExpScale } = payload;

  //creao l'uuid se non esiste
  if (!uuid) uuid = uuidGenerator();

  const existUuid = state.maps.has(uuid);
  //sovrascrivo il tile esistente
  if (existUuid) {
    //devo fare update in due passi perché $apply al momento non mi ha funzionato
    const t = state.maps.get(uuid);
    const objectExpScale = payload.objectExpScale
      ? payload.objectExpScale
      : initExpScale;
    const nt = update(t, {
      $merge: { ...payload, objectExpScale }
    });

    return update(state, {
      maps: {
        $add: [[uuid, nt]]
      }
    });

    //da capire come funziona meglio $apply
    /*$apply: t => {
          console.log(t);
          const objectExpScale = initExpScale;
          const nt = update(t, {
            $merge: { ...payload, objectExpScale }
          });
          console.log(nt);
          return nt;
        }
      }
    });*/
  }
  //creao un nuovo tile
  else {
    const creationDate = now();
    const objectExpScale = payload.objectExpScale
      ? payload.objectExpScale
      : initExpScale;
    const tile = update(initialMapRecord, {
      $merge: {
        ...payload,
        uuid,
        creationDate,
        objectExpScale
      }
    });

    return update(state, {
      maps: {
        $add: [[uuid, tile]]
      }
    });

    //return state.setIn(["maps", uuid], tile);
  }
};

const moveMapHandler = (state: MapsRecord, payload: MoveMap): MapsRecord => {
  const {
    uuid,
    objectExpScale,
    scaledObjectTranslationX,
    scaledObjectTranslationY,
    viewPortTranslationX,
    viewPortTranslationY,
    objectPosition
  } = payload;
  const existUuid = state.maps.has(uuid);
  if (existUuid) {
    const t = state.maps.get(uuid);
    const nt = update(t, {
      $merge: {
        objectExpScale,
        scaledObjectTranslationX,
        scaledObjectTranslationY,
        viewPortTranslationX,
        viewPortTranslationY,
        objectPosition
      }
    });

    return update(state, {
      maps: {
        $add: [[uuid, nt]]
      }
    });
  } else {
    throw new Error(MAP_ERROR);
  }
};

const zoomMapHandler = (state: MapsRecord, payload: ZoomMap): MapsRecord => {
  const { uuid, x, y, currentExpScale } = payload;
  const existUuid = state.maps.has(uuid);
  if (existUuid) {
    const t = state.maps.get(uuid);
    const nt = update(t, {
      $merge: {
        transformX: x,
        transformY: y,
        currentExpScale
      }
    });

    return update(state, {
      maps: {
        $add: [[uuid, nt]]
      }
    });
  } else {
    throw new Error(MAP_ERROR);
  }
};

const resizeMapHandler = (
  state: MapsRecord,
  payload: ResizeMap
): MapsRecord => {
  const { uuid, viewPortWidth, viewPortHeight } = payload;
  const existUuid = state.maps.has(uuid);
  if (existUuid) {
    const t = state.maps.get(uuid);
    const nt = update(t, {
      $merge: {
        viewPortWidth: viewPortWidth,
        viewPortHeight: viewPortHeight
      }
    });

    return update(state, {
      maps: {
        $add: [[uuid, nt]]
      }
    });
  } else {
    throw new Error(MAP_ERROR);
  }
};

const removeMapHandler = (
  state: MapsRecord,
  payload: RemoveMap
): MapsRecord => {
  const { uuid } = payload;
  const existUuid = state.maps.has(uuid);
  if (existUuid) {
    return update(state, {
      maps: {
        $remove: [uuid]
      }
    });
  } else {
    throw new Error(MAP_ERROR);
  }
};

const storeTileMapHandler = (state: MapsRecord, payload: StoreTileMap) => {
  const { uuid, z, x, y, tile, timestamp } = payload;
  const existUuid = state.maps.has(uuid);
  if (existUuid) {
    const t = state.maps.get(uuid);
    const ti: TileIndex = { z, x, y };
    const tv: TileValue = { tile, timestamp };
    const nt = update(t, {
      tileCacheMap: {
        $add: [[serializeTileIndex(ti), tv]]
      }
    });

    return update(state, {
      maps: {
        $add: [[uuid, nt]]
      }
    });
  } else {
    throw new Error(MAP_ERROR);
  }
};

const storeMetaTileMapHandler = (
  state: MapsRecord,
  payload: StoreMetaTileMap
) => {
  const { uuid, tiles, timestamp } = payload;
  if (state.maps.has(uuid)) {
    const t = state.maps.get(uuid);
    const metaTiles = [];

    tiles.forEach((mt: MetaTileElement) => {
      const ti: TileIndex = { z: mt.z, x: mt.x, y: mt.y };
      const tv: TileValue = { tile: mt.tile, timestamp };
      metaTiles.push([serializeTileIndex(ti), tv]);
    });

    const nt = update(t, {
      tileCacheMap: {
        $add: metaTiles
      }
    });

    return update(state, {
      maps: {
        $add: [[uuid, nt]]
      }
    });
  } else {
    throw new Error(MAP_ERROR);
  }
};

const loadingTilesMapHandler = (
  state: MapsRecord,
  payload: LoadingTilesMap
) => {
  const { uuid, loading } = payload;
  const existUuid = state.maps.has(uuid);
  if (existUuid) {
    const t = state.maps.get(uuid);
    const nt = update(t, {
      loading: {
        $set: loading
      }
    });
    return update(state, {
      maps: {
        $add: [[uuid, nt]]
      }
    });
  } else {
    throw new Error(MAP_ERROR);
  }
};

//$FlowFixMe
export const maps = createReducer(initialMapsRecord, [
  createLeaf(INIT_MAP, initMapHandler),
  createLeaf(MOVE_MAP, moveMapHandler),
  createLeaf(ZOOM_MAP, zoomMapHandler),
  createLeaf(RESIZE_MAP, resizeMapHandler),
  createLeaf(REMOVE_MAP, removeMapHandler),
  createLeaf(STORE_TILE_MAP, storeTileMapHandler),
  createLeaf(STORE_METATILE_MAP, storeMetaTileMapHandler),
  createLeaf(LOADING_TILES_MAP, loadingTilesMapHandler)
]);
