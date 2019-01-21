/*eslint no-magic-numbers:*/
import {
  getMapsUuids,
  getMapsTilesByUuid,
  getViewPortSizeByUuid,
  getMapSizeByUuid,
  getRenderModalityByUuid,
  getMapTransformByUuid,
  getReferenceSystemScalesByUuid,
  getMapIntegerScalesArrayByUuid,
  getScalesByUuid,
  getViewportObjectPositionByUuid,
  isMultipleScalesByUuid,
  isReadyByUuid,
  isSchemaEndByUuid,
  getSchemaBoundaryByUuid,
  getMapsTilesCacheByUuid
} from "../selectors";
import {
  EXP_RENDER_MODALITY,
  LINEAR_RENDER_MODALITY,
  SINGLE_EXP_RENDER_MODALITY
} from "../renderModalities";

jest.mock("../utils/coordinates");
import { calcCoordsforTiles } from "../utils/coordinates";

describe("Maps selectors", () => {
  const uuid1 = "uuidTile1";
  const uuid2 = "uuidTile2";
  const uuid3 = "uuidTile3";
  const mapsTileBefore = new Map([
    [uuid1, { uuid: uuid1 }],
    [uuid2, { uuid: uuid2 }],
    [uuid3, { uuid: uuid3 }]
  ]);

  const STATE_INITIALIZED = {
    maps: mapsTileBefore
  };

  it("retrieves uuids from empty maps, selector: getMapsUuids", () => {
    const STATE_NOT_INITIALIZED = {
      maps: new Map()
    };
    const uuids = getMapsUuids(STATE_NOT_INITIALIZED);
    const uuidsExpected = new Set();
    // $FlowFixMe
    expect(uuids).toEqual(uuidsExpected);
  });

  it("retrieves uuids from maps, selector: getMapsUuids", () => {
    const uuids = getMapsUuids(STATE_INITIALIZED);
    const uuidsExpected = new Set([uuid1, uuid2, uuid3]);
    // $FlowFixMe
    expect(uuids).toEqual(uuidsExpected);
  });

  it("getMapsTilesByUuid, MapRecord with conditions to get tiles", () => {
    const mapsTile = new Map([
      [
        uuid1,
        {
          uuid1,
          viewPortWidth: 100,
          viewPortHeight: 100,
          transformX: 0,
          transformY: 0,
          currentExpScale: 256
        }
      ]
    ]);

    const STATE = {
      maps: mapsTile
    };
    const tilesbyUuid = getMapsTilesByUuid(STATE);

    expect(tilesbyUuid.size).toBe(1);

    const t1_0 = { x: 0, y: 0, z: 0, tx: 0, ty: 0 };
    const t1_translate = [-0.5, -0.5];
    const t1_scale = 256;
    expect(tilesbyUuid.get(uuid1)[0]).toEqual(t1_0);
    expect(tilesbyUuid.get(uuid1).translate).toEqual(t1_translate);
    expect(tilesbyUuid.get(uuid1).scale).toEqual(t1_scale);
  });

  it("getViewPortSizeByUuid, retrieves viewPort by uuid", () => {
    const mapsTile = new Map([
      [uuid1, { uuid: uuid1, viewPortWidth: 5, viewPortHeight: 10 }],
      [uuid2, { uuid: uuid2, viewPortWidth: 54, viewPortHeight: 14 }]
    ]);

    const STATE = {
      maps: mapsTile
    };
    const viewPortbyUuid = getViewPortSizeByUuid(STATE);

    expect(viewPortbyUuid.size).toBe(2);
    expect(viewPortbyUuid.get(uuid1)).toEqual({
      viewPortWidth: 5,
      viewPortHeight: 10
    });
    expect(viewPortbyUuid.get(uuid2)).toEqual({
      viewPortWidth: 54,
      viewPortHeight: 14
    });
  });

  it("getMapSizeByUuid, retrieves map size by uuid", () => {
    const mapsTile = new Map([
      [uuid1, { uuid: uuid1, width: 100, height: 200 }],
      [uuid2, { uuid: uuid2, width: 400, height: 500 }]
    ]);

    const STATE = {
      maps: mapsTile
    };
    const mapsSize = getMapSizeByUuid(STATE);

    expect(mapsSize.size).toBe(2);
    expect(mapsSize.get(uuid1)).toEqual({
      width: 100,
      height: 200
    });
    expect(mapsSize.get(uuid2)).toEqual({
      width: 400,
      height: 500
    });
  });

  it("getRenderModalityByUuid, retrieves renderModality by uuid", () => {
    const mapsTile = new Map([
      [
        uuid1,
        {
          uuid: uuid1,
          renderModality: EXP_RENDER_MODALITY
        }
      ],
      [uuid2, { uuid: uuid2, renderModality: LINEAR_RENDER_MODALITY }]
    ]);

    const STATE = {
      maps: mapsTile
    };
    const renderModalityByUuid = getRenderModalityByUuid(STATE);

    expect(renderModalityByUuid.size).toBe(2);
    expect(renderModalityByUuid.get(uuid1)).toEqual(EXP_RENDER_MODALITY);
    expect(renderModalityByUuid.get(uuid2)).toEqual(LINEAR_RENDER_MODALITY);
  });

  it("getMapTransformByUuid, retrieves transforms by uuid", () => {
    const mapsTile = new Map([
      [
        uuid1,
        {
          uuid: uuid1,
          transformX: 10,
          transformY: 20,
          currentExpScale: 11
        }
      ],
      [
        uuid2,
        {
          uuid: uuid2,
          transformX: 50,
          transformY: 60,
          currentExpScale: 14
        }
      ]
    ]);

    const STATE = {
      maps: mapsTile
    };
    const transformsByUuid = getMapTransformByUuid(STATE);

    expect(transformsByUuid.size).toBe(2);
    expect(transformsByUuid.get(uuid1)).toEqual({
      transformX: 10,
      transformY: 20,
      currentExpScale: 11
    });
    expect(transformsByUuid.get(uuid2)).toEqual({
      transformX: 50,
      transformY: 60,
      currentExpScale: 14
    });
  });

  it("getReferenceSystemScalesByUuid, renderModality: EXP_RENDER_MODALITY", () => {
    const uuid1 = "uuidTile1";
    const mapsTile = new Map([
      [
        uuid1,
        {
          uuid: uuid1,
          currentExpScale: 65536,
          height: 400,
          width: 500,
          defaultExpScale: 65536,
          expScaleOffset: 2,
          renderModality: EXP_RENDER_MODALITY,
          maxExpScale: 368166.797505462,
          minExpScale: 11665.81920233121
        }
      ]
    ]);

    const state = {
      maps: mapsTile
    };
    const scaleInfoByUuid = getReferenceSystemScalesByUuid(state);
    const expectedScale = {
      currentScale: 2,
      defaultScale: 2,
      currentScaleInt: 2,
      maxScale: 4.49,
      minScale: -0.49
    };

    expect(scaleInfoByUuid.get(uuid1).currentScale).toEqual(
      expectedScale.currentScale
    );
    expect(scaleInfoByUuid.get(uuid1).defaultScale).toEqual(
      expectedScale.defaultScale
    );
    expect(scaleInfoByUuid.get(uuid1).currentScaleInt).toEqual(
      expectedScale.currentScaleInt
    );
    expect(+scaleInfoByUuid.get(uuid1).maxScale.toFixed(2)).toEqual(
      expectedScale.maxScale
    );
    expect(+scaleInfoByUuid.get(uuid1).maxScale.toFixed(2)).toEqual(
      expectedScale.maxScale
    );
  });

  it("getReferenceSystemScalesByUuid, renderModality: LINEAR_RENDER_MODALITY", () => {
    const uuid1 = "uuidTile1";
    const mapsTile = new Map([
      [
        uuid1,
        {
          uuid: uuid1,
          currentExpScale: 65536,
          height: 400,
          width: 500,
          defaultExpScale: 65536,
          expScaleOffset: 2,
          renderModality: LINEAR_RENDER_MODALITY,
          maxExpScale: 368166.797505462,
          minExpScale: 11665.81920233121
        }
      ]
    ]);

    const state = {
      maps: mapsTile
    };
    const scaleInfoByUuid = getReferenceSystemScalesByUuid(state);
    const expectedScale = {
      currentScale: 2,
      defaultScale: 2,
      currentScaleInt: 2,
      maxScale: 4.49,
      minScale: -0.49
    };
    expect(scaleInfoByUuid.get(uuid1).currentScale).toEqual(
      expectedScale.currentScale
    );
    expect(scaleInfoByUuid.get(uuid1).defaultScale).toEqual(
      expectedScale.defaultScale
    );
    expect(scaleInfoByUuid.get(uuid1).currentScaleInt).toEqual(
      expectedScale.currentScaleInt
    );
    expect(+scaleInfoByUuid.get(uuid1).maxScale.toFixed(2)).toEqual(
      expectedScale.maxScale
    );
    expect(+scaleInfoByUuid.get(uuid1).maxScale.toFixed(2)).toEqual(
      expectedScale.maxScale
    );
  });

  it("getMapIntegerScalesArrayByUuid, renderModality: EXP_RENDER_MODALITY", () => {
    const uuid1 = "uuidTile1";
    const mapsTile = new Map([
      [
        uuid1,
        {
          uuid: uuid1,
          minExpScale: 16384,
          maxExpScale: 262144,
          height: 400,
          width: 500,
          defaultExpScale: 65536,
          renderModality: EXP_RENDER_MODALITY,
          expScaleOffset: 2
        }
      ]
    ]);

    const state = {
      maps: mapsTile
    };
    const scaleInfoByUuid = getMapIntegerScalesArrayByUuid(state);
    expect(scaleInfoByUuid.get(uuid1)).toEqual([0, 1, 2, 3, 4]);
  });

  it("test getScalesByUuid", () => {
    const uuid1 = "uuidTile1";
    const mapsTile = new Map([
      [
        uuid1,
        {
          uuid: uuid1,
          minExpScale: 16384,
          maxExpScale: 262144,
          height: 400,
          width: 500,
          defaultExpScale: 65536,
          renderModality: EXP_RENDER_MODALITY,
          currentExpScale: 65536,
          initExpScale: 65536
        }
      ]
    ]);

    const state = {
      maps: mapsTile
    };
    const scales = getScalesByUuid(state);

    expect(scales.get(uuid1)).toEqual({
      minExpScale: 16384,
      maxExpScale: 262144,
      defaultExpScale: 65536,
      currentExpScale: 65536,
      initExpScale: 65536
    });
  });

  it("getViewportObjectPositionByUuid", () => {
    const uuid1 = "uuidTile1";
    const mapsTile = new Map([
      [
        uuid1,
        {
          uuid: uuid1,
          scaledObjectTranslationX: 0.5,
          scaledObjectTranslationY: 0.5,
          viewPortTranslationX: 0,
          viewPortTranslationY: 0,
          objectExpScale: 0,
          objectPosition: [0, 0]
        }
      ]
    ]);

    const state = {
      maps: mapsTile
    };
    const positionsActual = getViewportObjectPositionByUuid(state);

    const positionExpected = {
      scaledObjectTranslation: [0.5, 0.5],
      viewport: [0, 0],
      objectExpScale: 0,
      objectPosition: [0, 0]
    };

    expect(positionsActual.get(uuid1)).toEqual(positionExpected);
  });

  it("isMultipleScalesByUuid, renderModality: EXP_RENDER_MODALITY", () => {
    const uuid1 = "uuidTile1";
    const mapsTile = new Map([
      [
        uuid1,
        {
          uuid: uuid1,
          minExpScale: 16384,
          maxExpScale: 262144,
          height: 400,
          width: 500,
          defaultExpScale: 65536,
          renderModality: EXP_RENDER_MODALITY,
          expScaleOffset: 2
        }
      ]
    ]);

    const state = {
      maps: mapsTile
    };
    const isMultiple = isMultipleScalesByUuid(state);

    expect(isMultiple.get(uuid1)).toEqual(true);
  });

  it("isReadyByUuid, check if map is ready to be rendered", () => {
    const uuid1 = "uuidTile1";
    const mapsTile = new Map([
      [
        uuid1,
        {
          uuid: uuid1,
          minExpScale: 16384,
          maxExpScale: 262144,
          height: 400,
          width: 500,
          defaultExpScale: 65536,
          renderModality: EXP_RENDER_MODALITY,
          expScaleOffset: 2,
          viewPortHeight: 600,
          viewPortWidth: 880,
          transformX: 1,
          transformY: 1,
          currentExpScale: 1
        }
      ]
    ]);

    const state = {
      maps: mapsTile
    };
    const isReady = isReadyByUuid(state);

    expect(isReady.get(uuid1)).toEqual(true);
  });

  it("getReferenceSystemScalesByUuid, renderModality: SINGLE_EXP_RENDER_MODALITY", () => {
    const uuid1 = "uuidTile1";
    const mapsTile = new Map([
      [
        uuid1,
        {
          uuid: uuid1,
          currentExpScale: 1.2613446228805718,
          height: 400,
          width: 500,
          defaultExpScale: 1,
          expScaleOffset: 0,
          renderModality: SINGLE_EXP_RENDER_MODALITY,
          maxExpScale: 1.5,
          minExpScale: 0.7
        }
      ]
    ]);

    const state = {
      maps: mapsTile
    };
    const scaleInfoByUuid = getReferenceSystemScalesByUuid(state);
    const expectedScale = {
      currentScale: -0.33,
      defaultScale: 0,
      currentScaleInt: 0,
      maxScale: 0.51,
      minScale: -0.58
    };
    expect(+scaleInfoByUuid.get(uuid1).currentScale.toFixed(2)).toEqual(
      expectedScale.currentScale
    );
    expect(+scaleInfoByUuid.get(uuid1).defaultScale.toFixed(2)).toEqual(
      expectedScale.defaultScale
    );
    expect(+scaleInfoByUuid.get(uuid1).currentScaleInt.toFixed(2)).toEqual(
      expectedScale.currentScaleInt
    );
  });

  it("isSchemaEndByUuid", () => {
    //mockaare calcCoordsforTiles
    calcCoordsforTiles.mockImplementation(() => [400, 300]);

    const uuid1 = "uuidTile1";
    const mapsTile = new Map([
      [
        uuid1,
        {
          uuid: uuid1,
          viewPortHeight: 400,
          viewPortWidth: 500,
          transformX: 1,
          transformY: 1,
          currentExpScale: 1
        }
      ]
    ]);

    const state = {
      maps: mapsTile
    };
    const end = isSchemaEndByUuid(state).get(uuid1);

    expect(end).toEqual({
      top: false,
      left: false,
      right: false,
      bottom: false
    });
  });

  it("getSchemaBoundaryByUuid", () => {
    const uuid1 = "uuidTile1";
    const mapsTile = new Map([
      [
        uuid1,
        {
          uuid: uuid1,
          viewPortHeight: 600,
          viewPortWidth: 700,
          transformX: 32768,
          transformY: 32768,
          currentExpScale: 65536,
          defaultExpScale: 65536,
          initExpScale: 65536,
          expScaleOffset: 2,
          renderModality: EXP_RENDER_MODALITY,
          height: 44016,
          width: 52572
        }
      ]
    ]);

    calcCoordsforTiles.mockImplementation((renderModality, viewportCoords) => {
      return viewportCoords;  
    });

    const state = {
      maps: mapsTile
    };
    const end = getSchemaBoundaryByUuid(state).get(uuid1);

    expect(end).toEqual({
      top: 0,
      left: 0,
      right: 52572 - 700,
      bottom: 44016 - 600
    });
  });

  it("getMapsTilesCacheByUuid", () => {
    const uuid1 = "uuidTile1";
    const mapsTile = new Map([
      [
        uuid1,
        {
          uuid: uuid1,
          viewPortHeight: 600,
          viewPortWidth: 700,
          transformX: 32768,
          transformY: 32768,
          currentExpScale: 65536,
          defaultExpScale: 65536,
          initExpScale: 65536,
          expScaleOffset: 2,
          renderModality: EXP_RENDER_MODALITY,
          height: 44016,
          width: 52572,
          tileCacheMap: new Map(),
          tileCacheUpdateTime: 100,
          tileExpiration: 5000
        }
      ]
    ]);

    const state = {
      maps: mapsTile
    };
    const end = getMapsTilesCacheByUuid(state).get(uuid1);

    expect(end).toEqual({
      tileCacheMap: new Map(),
      tileCacheUpdateTime: 100
    });
  });
});
