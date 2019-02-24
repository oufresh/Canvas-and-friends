/*eslint no-magic-numbers:*/
import { initialMapsRecord } from "../types";
import {
  initMap,
  zoomMap,
  moveMap,
  resizeMap,
  removeMap,
  storeTileMap,
  storeMetaTileMap
} from "../actionCreators";
import { maps } from "../reducer";
import { EXP_RENDER_MODALITY } from "../renderModalities";
import { MAP_ERROR } from "../errors";

jest.mock("../utils");
import { uuidGenerator, now, serializeTileIndex } from "../utils";

describe("maps reducer", () => {
  /* beforeEach(() => {
    jest.addMatchers(matchers);
  });*/

  it("create initial state", () => {
    const state = maps();
    expect(state).toEqual(initialMapsRecord);
  });

  it("change initialStateMaps after an initMap Action", () => {
    const uuid = "uuidTile1";
    const creationDate = 1000;
    const viewPortWidth = 300;
    const viewPortHeight = 200;

    now.mockImplementation(() => creationDate);

    const stateAfter = maps(
      initialMapsRecord,
      initMap({
        uuid,
        defaultExpScale: 1,
        height: 1,
        initExpScale: 1,
        maxExpScale: 0,
        minExpScale: 1,
        renderModality: EXP_RENDER_MODALITY,
        viewPortHeight,
        viewPortWidth,
        width: 1,
        objectPosition: [0, 0],
        baseTileServiceurl: "ciccio",
        tileExpiration: 55
      })
    );

    const stateExpected = {
      maps: new Map([
        [
          uuid,
          {
            creationDate,
            uuid,
            currentExpScale: null,
            expScaleOffset: null,
            transformX: null,
            transformY: null,
            defaultExpScale: 1,
            height: 1,
            initExpScale: 1,
            maxExpScale: 0,
            minExpScale: 1,
            renderModality: EXP_RENDER_MODALITY,
            projection: "",
            viewPortHeight,
            viewPortWidth,
            width: 1,
            scaledObjectTranslationX: 0,
            scaledObjectTranslationY: 0,
            viewPortTranslationX: 0,
            viewPortTranslationY: 0,
            objectExpScale: 1,
            objectPosition: [0, 0],
            tileCacheMap: new Map(),
            tileCacheUpdateTime: 0,
            baseTileServiceurl: "ciccio",
            tileExpiration: 55,
            loading: false,
            useMetaTile: false
          }
        ]
      ])
    };
    expect(stateAfter).toEqual(stateExpected);
  });

  it("change initialStateMaps after an initMap Action with undefined uuid", () => {
    const width = 300;
    const height = 200;

    const UUID_GENERATED = "ba1ec1f0-9171-11e8-8530-234da3c95c9a";

    uuidGenerator.mockImplementation(() => UUID_GENERATED);
    const creationDate = 1000;

    now.mockImplementation(() => creationDate);
    const stateAfter = maps(
      initialMapsRecord,
      initMap({
        uuid: null,
        defaultExpScale: 1,
        height: 1,
        initExpScale: 1,
        maxExpScale: 1,
        minExpScale: 0,
        renderModality: EXP_RENDER_MODALITY,
        viewPortHeight: height,
        viewPortWidth: width,
        width: 1,
        objectPosition: [0, 0],
        baseTileServiceurl: "ciccio",
        tileExpiration: 55
      })
    );
    const mapsTile = new Map([
      [
        UUID_GENERATED,
        {
          currentExpScale: null,
          expScaleOffset: null,
          transformX: null,
          transformY: null,
          projection: "",
          creationDate,
          defaultExpScale: 1,
          height: 1,
          initExpScale: 1,
          maxExpScale: 1,
          minExpScale: 0,
          renderModality: EXP_RENDER_MODALITY,
          uuid: UUID_GENERATED,
          viewPortHeight: height,
          viewPortWidth: width,
          width: 1,
          scaledObjectTranslationX: 0,
          scaledObjectTranslationY: 0,
          viewPortTranslationX: 0,
          viewPortTranslationY: 0,
          objectExpScale: 1,
          objectPosition: [0, 0],
          tileCacheMap: new Map(),
          tileCacheUpdateTime: 0,
          baseTileServiceurl: "ciccio",
          tileExpiration: 55,
          loading: false,
          useMetaTile: false
        }
      ]
    ]);

    const stateExpected = {
      maps: mapsTile
    };

    expect(stateAfter).toEqual(stateExpected);
  });

  it("change statebefore after an initMap Action", () => {
    const uuid = "uuidTile1";

    const mapsTileBefore = new Map([
      [
        uuid,
        {
          uuid,
          viewPortWidth: 100,
          viewPortHeight: 150
        }
      ]
    ]);

    const stateBefore = {
      maps: mapsTileBefore
    };

    const width = 300;
    const height = 200;
    const stateAfter = maps(
      stateBefore,
      initMap({
        uuid,
        defaultExpScale: 1,
        height: 1,
        initExpScale: 1,
        maxExpScale: 1,
        minExpScale: 0,
        renderModality: EXP_RENDER_MODALITY,
        viewPortHeight: height,
        viewPortWidth: width,
        width: 1,
        objectPosition: [0, 0]
      })
    );

    const mapsTile = new Map([
      [
        uuid,
        {
          uuid,
          defaultExpScale: 1,
          height: 1,
          initExpScale: 1,
          maxExpScale: 1,
          minExpScale: 0,
          renderModality: EXP_RENDER_MODALITY,
          viewPortHeight: height,
          viewPortWidth: width,
          width: 1,
          objectExpScale: 1,
          objectPosition: [0, 0]
        }
      ]
    ]);

    const stateExpected = {
      maps: mapsTile
    };

    expect(stateAfter).toEqual(stateExpected);
  });

  it("change stateBefore after a zoomMap Action", () => {
    const uuid = "uuidTile1";
    const mapsTileBefore = new Map([
      [
        uuid,
        {
          uuid,
          transformX: 2,
          transformY: 2,
          currentExpScale: 2
        }
      ]
    ]);

    const stateBefore = {
      maps: mapsTileBefore
    };

    const x = 5;
    const y = 7;
    const currentExpScale = 4;
    const stateAfter = maps(
      stateBefore,
      zoomMap({ uuid, x, y, currentExpScale })
    );
    const mapsTile = new Map([
      [
        uuid,
        {
          uuid,
          transformX: x,
          transformY: y,
          currentExpScale
        }
      ]
    ]);

    const stateExpected = {
      maps: mapsTile
    };
    expect(stateAfter).toEqual(stateExpected);
  });

  it("zoomMap Action with uuid not into the state throw Error", () => {
    const t = () => {
      const uuid1 = "uuidTile1";
      const mapsTileBefore = new Map([[uuid1, { uuid: uuid1 }]]);
      const stateBefore = {
        maps: mapsTileBefore
      };
      const uuid2 = "uuidTile2";
      const x = 5;
      const y = 7;
      const currentExpScale = 4;
      maps(stateBefore, zoomMap({ uuid: uuid2, x, y, currentExpScale }));
    };

    expect(t).toThrowError(MAP_ERROR);
  });

  it("change stateBefore after a movetTile Action", () => {
    const uuid = "uuidTile1";
    const mapsTileBefore = new Map([
      [
        uuid,
        {
          uuid,
          objectExpScale: 65536,
          scaledObjectTranslationX: 0.5,
          scaledObjectTranslationY: 0.5,
          viewPortTranslationX: 0,
          viewPortTranslationY: 0
        }
      ]
    ]);
    const stateBefore = {
      maps: mapsTileBefore
    };

    const move = {
      uuid,
      objectExpScale: 40000,
      scaledObjectTranslationX: 10,
      scaledObjectTranslationY: 10,
      viewPortTranslationX: 11,
      viewPortTranslationY: 11,
      objectPosition: [0, 0]
    };

    const stateAfter = maps(stateBefore, moveMap(move));
    const mapsTile = new Map([
      [
        uuid,
        {
          uuid,
          objectExpScale: 40000,
          scaledObjectTranslationX: 10,
          scaledObjectTranslationY: 10,
          viewPortTranslationX: 11,
          viewPortTranslationY: 11,
          objectPosition: [0, 0]
        }
      ]
    ]);

    const stateExpected = {
      maps: mapsTile
    };

    expect(stateAfter).toEqual(stateExpected);
  });

  it("movetTile Action with uuid not into the state throw Error", () => {
    const t = () => {
      const uuid1 = "moveMap2";
      const mapsTileBefore = new Map([[uuid1, { uuid: uuid1 }]]);
      const stateBefore = {
        maps: mapsTileBefore
      };
      const select = {
        uuid: "moveMapError",
        objectExpScale: 65536,
        scaledObjectTranslationX: 0.5,
        scaledObjectTranslationY: 0.5,
        viewPortTranslationX: 0,
        viewPortTranslationY: 0,
        objectPosition: [0, 0]
      };
      maps(stateBefore, moveMap(select));
    };

    expect(t).toThrowError(MAP_ERROR);
  });

  it("resizeMap Action with uuid correct and new viewport dimensions", () => {
    const uuid = "resizeMap";
    const mapsTileBefore = new Map([
      [
        uuid,
        {
          uuid: uuid,
          viewPortHeight: 100,
          viewPortWidth: 100
        }
      ]
    ]);
    const stateBefore = {
      maps: mapsTileBefore
    };
    const p = {
      uuid: uuid,
      viewPortHeight: 200,
      viewPortWidth: 200
    };
    const stateAfter = maps(stateBefore, resizeMap(p));

    const mapsTile = new Map([
      [
        uuid,
        {
          uuid,
          viewPortHeight: 200,
          viewPortWidth: 200
        }
      ]
    ]);

    const stateExpected = {
      maps: mapsTile
    };

    expect(stateAfter).toEqual(stateExpected);
  });

  it("resizeMap Action with uuid not into the state throw Error", () => {
    const t = () => {
      const uuid1 = "resizeMap";
      const mapsTileBefore = new Map([[uuid1, { uuid: uuid1 }]]);
      const stateBefore = {
        maps: mapsTileBefore,
        viewPortHeight: 100,
        viewPortWidth: 100
      };
      const p = {
        uuid: "cccio",
        viewPortHeight: 200,
        viewPortWidth: 200
      };
      maps(stateBefore, resizeMap(p));
    };

    expect(t).toThrowError(MAP_ERROR);
  });

  it("removeMap Action with uuid correct", () => {
    const uuid = "removeMap";
    const mapsTileBefore = new Map([
      [
        uuid,
        {
          uuid: uuid,
          viewPortHeight: 100,
          viewPortWidth: 100
        }
      ]
    ]);
    const stateBefore = {
      maps: mapsTileBefore
    };
    const p = {
      uuid: uuid
    };
    const stateAfter = maps(stateBefore, removeMap(p));

    const mapsTile = new Map([]);

    const stateExpected = {
      maps: mapsTile
    };

    expect(stateAfter).toEqual(stateExpected);
  });

  it("removeMap Action with uuid not into the state throw Error", () => {
    const t = () => {
      const uuid1 = "removeMap";
      const mapsTileBefore = new Map([[uuid1, { uuid: uuid1 }]]);
      const stateBefore = {
        maps: mapsTileBefore
      };
      const select = {
        uuid: "moveMapError"
      };
      maps(stateBefore, removeMap(select));
    };

    expect(t).toThrowError(MAP_ERROR);
  });

  it("storeTileMap Action with uuid correct", () => {
    const uuid = "storeTileMap";
    const mapsTileBefore = new Map([
      [
        uuid,
        {
          uuid: uuid,
          tileCacheMap: new Map(),
          tileCacheUpdateTime: 0
        }
      ]
    ]);
    const stateBefore = {
      maps: mapsTileBefore
    };
    const p = {
      uuid: uuid,
      z: 1,
      x: 1,
      y: 1,
      tile: "ciccio",
      timestamp: 12345678
    };
    const stateAfter = maps(stateBefore, storeTileMap(p));

    const mapsTile = new Map();
    mapsTile.set(uuid, {
      uuid: uuid,
      tileCacheMap: new Map([
        [
          serializeTileIndex({ z: 1, x: 1, y: 1 }),
          { tile: "ciccio", timestamp: 12345678 }
        ]
      ]),
      tileCacheUpdateTime: 0
    });

    const stateExpected = {
      maps: mapsTile
    };

    expect(stateAfter).toEqual(stateExpected);
  });

  it("storeTileMap Action with uuid not into the state throw Error", () => {
    const t = () => {
      const uuid = "storeTileMap";
      const mapsTileBefore = new Map([
        [uuid, { uuid, tileCacheMap: new Map(), tileCacheUpdateTime: 0 }]
      ]);
      const stateBefore = {
        maps: mapsTileBefore
      };
      const p = {
        uuid: "storeTileMapWrong",
        z: 1,
        x: 1,
        y: 1,
        tile: "ciccio",
        timestamp: 12345678
      };
      maps(stateBefore, storeTileMap(p));
    };

    expect(t).toThrowError(MAP_ERROR);
  });

  it("storeMetaTileMap Action with uuid correct", () => {
    const uuid = "storeMetaTileMap";
    const mapsTileBefore = new Map([
      [
        uuid,
        {
          uuid: uuid,
          tileCacheMap: new Map(),
          tileCacheUpdateTime: 0
        }
      ]
    ]);
    const stateBefore = {
      maps: mapsTileBefore
    };
    const p = {
      uuid: uuid,
      tiles: [
        {
          z: 1,
          x: 1,
          y: 1,
          tile: "ciccio1"
        },
        {
          z: 1,
          x: 2,
          y: 1,
          tile: "ciccio2"
        }
      ],
      timestamp: 12345678
    };
    const stateAfter = maps(stateBefore, storeMetaTileMap(p));

    const mapsTile = new Map();
    mapsTile.set(uuid, {
      uuid: uuid,
      tileCacheMap: new Map([
        [
          serializeTileIndex({ z: 1, x: 1, y: 1 }),
          { tile: "ciccio1", timestamp: 12345678 }
        ],
        [
          serializeTileIndex({ z: 1, x: 2, y: 1 }),
          { tile: "ciccio2", timestamp: 12345678 }
        ]
      ]),
      tileCacheUpdateTime: 0
    });

    const stateExpected = {
      maps: mapsTile
    };

    expect(stateAfter).toEqual(stateExpected);
  });

  it("storeTilMetaeMap Action with uuid not into the state throw Error", () => {
    const t = () => {
      const uuid = "storeMetaTileMap";
      const mapsTileBefore = new Map([
        [uuid, { uuid, tileCacheMap: new Map(), tileCacheUpdateTime: 0 }]
      ]);
      const stateBefore = {
        maps: mapsTileBefore
      };
      const p = {
        uuid: "storeMetaTileMapWrong",
        tiles: [
          {
            z: 1,
            x: 1,
            y: 1,
            tile: "ciccio"
          }
        ],
        timestamp: 12345678
      };
      maps(stateBefore, storeMetaTileMap(p));
    };

    expect(t).toThrowError(MAP_ERROR);
  });
});
