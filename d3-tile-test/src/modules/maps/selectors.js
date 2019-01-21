//@flow
import { createSelector } from "reselect";
import { checkState, type State } from "@stweb-lib/redux-helper";
import {
  type IsReadyByUuid,
  type MapSizeByUuid,
  type MapTransformByUuid,
  type ZoomTransform,
  type MapsRecord,
  type RenderModalityBuUuid,
  type TilesByUuid,
  type ViewPortByUuid,
  type IsMultipleScalesByUuid,
  type Tiles,
  type IsSchemaEndByUuid,
  type SchemaBoundaryByUuid,
  MapRecord,
  MapTileCache,
  type MapsTileCacheByUuid
} from "./types";
import { type ViewportObjectPositionByUuid } from "../../types";
import { memoizedCalTiles, calcCoords, calcCoordsforTiles } from "./utils";
import {
  EXP_RENDER_MODALITY,
  LINEAR_RENDER_MODALITY,
  SINGLE_EXP_RENDER_MODALITY,
  SINGLE_LINEAR_RENDER_MODALITY
} from "./renderModalities";

import type {
  IntegerScalesArrayByUuid,
  ReferenceSystemScalesByUuid,
  ScalesByUuid
} from "../../types";
import { calcIntegerScaleInvByRenderModality } from "./utils/selectorsFactory";

// $FlowFixMe
let getRoot = (state: State): ?MapsRecord => state;

export const setRootMaps = (rootGetter: State => ?MapsRecord): void => {
  getRoot = rootGetter;
};

export const getMapsRoot = (state: State): MapsRecord =>
  checkState(getRoot(state));

export const getMapsUuids: State => Set<string> = createSelector(
  [getMapsRoot],
  (maps: MapsRecord): Set<string> => {
    const m = maps.maps;
    if (m && m.size > 0) {
      return new Set(m.keys());
    }
    return new Set();
  }
);

export const getMapsTilesByUuid: State => TilesByUuid = createSelector(
  [getMapsRoot],
  (maps: MapsRecord): TilesByUuid => {
    const m = maps.maps;
    let ret: Map<string, Tiles> = new Map();
    if (m && m.size > 0) {
      m.forEach((value, uuid) => {
        let tiles: any = [];
        //console.log(value);
        const {
          viewPortWidth,
          viewPortHeight,
          transformX,
          transformY,
          currentExpScale
        } = value;
        if (
          viewPortWidth > 0 &&
          viewPortHeight > 0 &&
          transformX !== null &&
          transformY !== null &&
          currentExpScale !== null
        ) {
          tiles = memoizedCalTiles(
            viewPortWidth,
            viewPortHeight,
            transformX,
            transformY,
            currentExpScale
          );
        }

        //aggiungo z per sapere indice tiles
        const z = tiles.length > 0 ? tiles[0].z : NaN;
        tiles.z = z;
        ret.set(uuid, tiles);
      });
    }
    return ret;
  }
);

export const getViewPortSizeByUuid: State => ViewPortByUuid = createSelector(
  [getMapsRoot],
  (maps: MapsRecord): ViewPortByUuid => {
    const m = maps.maps;
    if (m && m.size > 0) {
      let ret = new Map();
      m.forEach((value, uuid) => {
        ret.set(uuid, {
          viewPortWidth: value.viewPortWidth,
          viewPortHeight: value.viewPortHeight
        });
      });
      return ret;
    }
    return new Map();
  }
);

export const getMapSizeByUuid: State => MapSizeByUuid = createSelector(
  [getMapsRoot],
  (maps: MapsRecord): MapSizeByUuid => {
    const m = maps.maps;
    if (m && m.size > 0) {
      let ret = new Map();
      m.forEach((value, uuid) => {
        ret.set(uuid, {
          width: value.width,
          height: value.height
        });
      });
      return ret;
    }
    return new Map();
  }
);

export const getRenderModalityByUuid: State => RenderModalityBuUuid = createSelector(
  [getMapsRoot],
  (maps: MapsRecord): RenderModalityBuUuid => {
    const m = maps.maps;
    let ret = new Map();
    if (m && m.size > 0) {
      m.forEach((value, uuid) => {
        ret.set(uuid, value.renderModality);
      });
    }
    return ret;
  }
);

export const getMapTransformByUuid: State => MapTransformByUuid = createSelector(
  [getMapsRoot],
  (maps: MapsRecord): MapTransformByUuid => {
    const m = maps.maps;
    let ret: Map<string, ZoomTransform> = new Map();
    if (m && m.size > 0) {
      m.forEach((value, uuid) => {
        ret.set(uuid, {
          transformX: value.transformX,
          transformY: value.transformY,
          currentExpScale: value.currentExpScale
        });
      });
    }
    return ret;
  }
);

/**
 * Ritorna un oggetto contente le scaleInfo convertite nel sistema di riferimeto dell'oggetto e non di d3
 */
export const getReferenceSystemScalesByUuid: State => ReferenceSystemScalesByUuid = createSelector(
  [getMapsRoot],
  (maps: MapsRecord): ReferenceSystemScalesByUuid => {
    const m = maps.maps;
    let ret = new Map();
    if (m && m.size > 0) {
      m.forEach((value, uuid) => {
        if (value.currentExpScale) {
          const {
            height,
            width,
            currentExpScale,
            renderModality,
            expScaleOffset,
            maxExpScale,
            minExpScale
          } = value;

          const currentScale = calcIntegerScaleInvByRenderModality(
            renderModality,
            width,
            height,
            currentExpScale,
            expScaleOffset,
            false
          );

          const currentScaleInt = calcIntegerScaleInvByRenderModality(
            renderModality,
            width,
            height,
            currentExpScale,
            expScaleOffset,
            true
          );
          const minScale = calcIntegerScaleInvByRenderModality(
            renderModality,
            width,
            height,
            maxExpScale,
            expScaleOffset,
            false
          );
          const maxScale = calcIntegerScaleInvByRenderModality(
            renderModality,
            width,
            height,
            minExpScale,
            expScaleOffset,
            false
          );

          ret.set(uuid, {
            currentScale,
            defaultScale: expScaleOffset,
            currentScaleInt,
            minScale,
            maxScale
          });
        }
      });
    }
    return ret;
  }
);

/**
 * NB: le scale max e min sono invertite in st la 0 è la più ingrandita e la 4 la meno ingrandita rispetto a d3
 *
 * Ritorna l'array di scale(intere) convertite nel sistema di riferimeto dell'oggetto e non di d3
 */

export const getMapIntegerScalesArrayByUuid: State => IntegerScalesArrayByUuid = createSelector(
  [getMapsRoot],
  (maps: MapsRecord): IntegerScalesArrayByUuid => {
    const m = maps.maps;
    let ret = new Map();
    if (m && m.size > 0) {
      m.forEach((value, uuid) => {
        const {
          minExpScale,
          maxExpScale,
          renderModality,
          height,
          width,
          expScaleOffset
        } = value;

        const minScale = calcIntegerScaleInvByRenderModality(
          renderModality,
          width,
          height,
          maxExpScale,
          expScaleOffset,
          true
        );
        const maxScale = calcIntegerScaleInvByRenderModality(
          renderModality,
          width,
          height,
          minExpScale,
          expScaleOffset,
          true
        );

        const scales = [];
        for (let i = 0; i <= maxScale; i++) {
          scales.push(Math.abs(minScale + i));
        }
        ret.set(uuid, scales);
      });
    }
    return ret;
  }
);

export const getScalesByUuid: State => ScalesByUuid = createSelector(
  [getMapsRoot],
  (maps: MapsRecord): ScalesByUuid => {
    const m = maps.maps;
    let ret = new Map();
    if (m && m.size > 0) {
      m.forEach((value, uuid) => {
        const {
          initExpScale,
          maxExpScale,
          minExpScale,
          currentExpScale,
          defaultExpScale
        } = value;

        ret.set(uuid, {
          initExpScale,
          maxExpScale,
          minExpScale,
          currentExpScale,
          defaultExpScale
        });
      });
    }
    return ret;
  }
);

export const getViewportObjectPositionByUuid: State => ViewportObjectPositionByUuid = createSelector(
  [getMapsRoot],
  (maps: MapsRecord): ViewportObjectPositionByUuid => {
    const m = maps.maps;
    let ret = new Map();
    if (m && m.size > 0) {
      m.forEach((mappa, uuid) => {
        const {
          scaledObjectTranslationX,
          scaledObjectTranslationY,
          viewPortTranslationX,
          viewPortTranslationY,
          objectExpScale,
          objectPosition
        } = mappa;

        ret.set(uuid, {
          scaledObjectTranslation: [
            scaledObjectTranslationX,
            scaledObjectTranslationY
          ],
          objectPosition: objectPosition,
          viewport: [viewPortTranslationX, viewPortTranslationY],
          objectExpScale
        });
      });
    }
    return ret;
  }
);

//!(props.width && props.height && props.scales), Geo
//!(props.width && props.height && props.scales && props.objectSize), Lin/Exp
//EXP_RENDER_MODALITY && LINEAR_RENDER_MODALITY

export const isReadyByUuid: State => IsReadyByUuid = createSelector(
  [
    getRenderModalityByUuid,
    getScalesByUuid,
    getMapSizeByUuid,
    getViewPortSizeByUuid,
    getMapsTilesByUuid
  ],
  (
    renderModality: RenderModalityBuUuid,
    scales: ScalesByUuid,
    mapSizes: MapSizeByUuid,
    viewportSizes: ViewPortByUuid,
    tiles: TilesByUuid
  ): IsReadyByUuid => {
    let ret: Map<string, boolean> = new Map();
    renderModality.forEach((r, uuid) => {
      if (r === EXP_RENDER_MODALITY || r === LINEAR_RENDER_MODALITY) {
        const size = mapSizes.get(uuid);
        const scale = scales.get(uuid);
        const viewport = viewportSizes.get(uuid);
        const _tiles = tiles.get(uuid);
        //console.log(_tiles);
        const ready =
          scale !== undefined &&
          size !== undefined &&
          size.width !== 0 &&
          size.height !== 0 &&
          viewport !== undefined &&
          viewport.viewPortHeight !== 0 &&
          viewport.viewPortWidth !== 0 &&
          _tiles !== undefined; /*&&
          _tiles.length > 0;*/
        ret.set(uuid, ready);
      } else {
        const scale = scales.get(uuid);
        const viewport = viewportSizes.get(uuid);
        ret.set(
          uuid,
          scale !== undefined &&
            viewport !== undefined &&
            viewport.viewPortHeight !== 0 &&
            viewport.viewPortWidth !== 0
        );
      }
    });
    return ret;
  }
);

export const isMultipleScalesByUuid: State => IsMultipleScalesByUuid = createSelector(
  [getMapIntegerScalesArrayByUuid],
  (scalesMap: IntegerScalesArrayByUuid): IsMultipleScalesByUuid => {
    let ret = new Map();
    if (scalesMap && scalesMap.size > 0) {
      scalesMap.forEach((s, uuid) => {
        ret.set(uuid, s.length > 1);
      });
    }
    return ret;
  }
);

export const isSchemaEndByUuid: State => IsSchemaEndByUuid = createSelector(
  [getMapsRoot, getMapsTilesByUuid, getViewPortSizeByUuid],
  (
    maps: MapsRecord,
    tiles: TilesByUuid,
    viewportSizes: ViewPortByUuid
  ): IsSchemaEndByUuid => {
    let ret = new Map();
    if (maps.maps && maps.maps.size > 0) {
      maps.maps.forEach((m, uuid) => {
        const viewportSize = viewportSizes.get(uuid);
        const _tiles = tiles.get(uuid);

        if (_tiles && viewportSize && _tiles.length > 0) {
          // top - left [0, 0]
          const origPos1 = calcCoordsforTiles(
            EXP_RENDER_MODALITY,
            [0, 0],
            _tiles.scale,
            _tiles.translate[0],
            _tiles.translate[1]
          );

          // bottom  - right
          const origPos2 = calcCoordsforTiles(
            EXP_RENDER_MODALITY,
            [viewportSize.viewPortWidth, viewportSize.viewPortHeight],
            _tiles.scale,
            _tiles.translate[0],
            _tiles.translate[1]
          );

          const end = {
            top: origPos1[1] <= 0,
            left: origPos1[0] <= 0,
            bottom: origPos2[1] >= viewportSize.viewPortHeight,
            right: origPos2[0] >= viewportSize.viewPortWidth
          };

          ret.set(uuid, end);
        }
      });
    }
    return ret;
  }
);

export const getSchemaBoundaryByUuid: State => SchemaBoundaryByUuid = createSelector(
  [getMapsRoot, getMapsTilesByUuid, getMapTransformByUuid],
  (
    maps: MapsRecord,
    tiles: TilesByUuid,
    transforms: MapTransformByUuid
  ): SchemaBoundaryByUuid => {
    let ret = new Map();
    if (maps.maps && maps.maps.size > 0) {
      maps.maps.forEach((m, uuid) => {
        const _tiles = tiles.get(uuid);
        const transform = transforms.get(uuid);

        let origPos1 = [0, 0];
        let origPos2 = [m.width, m.height];

        if (
          (m.renderModality === EXP_RENDER_MODALITY ||
            m.renderModality === LINEAR_RENDER_MODALITY) &&
          _tiles &&
          _tiles.length > 0
        ) {
          // top - left [0, 0]
          origPos1 = calcCoordsforTiles(
            m.renderModality,
            [0, 0],
            _tiles.scale,
            _tiles.translate[0],
            _tiles.translate[1]
          );

          // bottom  - right
          origPos2 = calcCoordsforTiles(
            m.renderModality,
            [m.viewPortWidth, m.viewPortHeight],
            _tiles.scale,
            _tiles.translate[0],
            _tiles.translate[1]
          );
        } else if (
          transform &&
          (m.renderModality === SINGLE_EXP_RENDER_MODALITY ||
            m.renderModality === SINGLE_LINEAR_RENDER_MODALITY)
        ) {
          // top - left [0, 0]
          origPos1 = calcCoords(
            0,
            0,
            transform.transformX ? transform.transformX : 0,
            transform.transformY ? transform.transformY : 0,
            transform.currentExpScale ? transform.currentExpScale : 1
          );

          // bottom  - right
          origPos2 = calcCoords(
            m.viewPortWidth,
            m.viewPortHeight,
            transform.transformX ? transform.transformX : 0,
            transform.transformY ? transform.transformY : 0,
            transform.currentExpScale ? transform.currentExpScale : 1
          );
        }
        const end = {
          top: 0 - origPos1[1],
          left: 0 - origPos1[0],
          bottom: m.height - origPos2[1],
          right: m.width - origPos2[0]
        };
        ret.set(uuid, end);
      });
    }
    return ret;
  }
);

export const getMapsTilesCacheByUuid: State => MapsTileCacheByUuid = createSelector(
  [getMapsRoot],
  (mapsRecord: MapsRecord): MapsTileCacheByUuid => {
    let ret = new Map();
    if (mapsRecord.maps && mapsRecord.maps.size > 0) {
      mapsRecord.maps.forEach((m: MapRecord, uuid: string) => {
        const cache: MapTileCache = {
          tileCacheMap: m.tileCacheMap,
          tileCacheUpdateTime: m.tileCacheUpdateTime
        };
        ret.set(uuid, cache);
      });
    }
    return ret;
  }
);
