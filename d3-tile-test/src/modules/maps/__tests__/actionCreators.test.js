/*eslint no-magic-numbers:*/
import {
  initMap,
  zoomMap,
  moveMap,
  resizeMap,
  removeMap,
  storeTileMap,
  storeMetaTileMap
} from "../actionCreators";
import {
  INIT_MAP,
  ZOOM_MAP,
  MOVE_MAP,
  RESIZE_MAP,
  REMOVE_MAP,
  STORE_TILE_MAP,
  STORE_METATILE_MAP
} from "../actionDefinitions";
import { EXP_RENDER_MODALITY } from "../renderModalities";

describe("actionCreator module maps", () => {
  it("check action initMap", () => {
    const uuid = "uuidTile1";
    const viewPortWidth = 300;
    const viewPortHeight = 200;
    const actionActual = initMap({
      uuid,
      viewPortWidth,
      viewPortHeight,
      defaultExpScale: 1,
      initExpScale: 1,
      width: 1,
      height: 1,
      maxExpScale: 1,
      minExpScale: 0,
      renderModality: EXP_RENDER_MODALITY,
      objectPosition: [0, 0],
      baseTileServiceurl: "http://ciccio"
    });

    const actionExpected = {
      type: INIT_MAP,
      payload: {
        uuid,
        height: 1,
        width: 1,
        defaultExpScale: 1,
        initExpScale: 1,
        viewPortHeight,
        viewPortWidth,
        maxExpScale: 1,
        minExpScale: 0,
        renderModality: EXP_RENDER_MODALITY,
        objectPosition: [0, 0],
        baseTileServiceurl: "http://ciccio"
      }
    };

    expect(actionActual).toEqual(actionExpected);
  });

  it("check action zoomMap", () => {
    const uuidTile = "zoomMap";
    const x = 5;
    const y = 7;
    const currentExpScale = 7;
    const actionActual = zoomMap({ uuid: uuidTile, x, y, currentExpScale });

    const actionExpected = {
      type: ZOOM_MAP,
      payload: {
        uuid: uuidTile,
        x,
        y,
        currentExpScale
      }
    };
    expect(actionActual).toEqual(actionExpected);
  });

  it("check action moveMap", () => {
    const select = {
      uuid: "prova",
      objectExpScale: 65536,
      scaledObjectTranslationX: 0.5,
      scaledObjectTranslationY: 0.5,
      viewPortTranslationX: 0,
      viewPortTranslationY: 0,
      objectPosition: [0, 0]
    };

    const actionActual = moveMap(select);

    const actionExpected = {
      type: MOVE_MAP,
      payload: {
        uuid: "prova",
        objectExpScale: 65536,
        scaledObjectTranslationX: 0.5,
        scaledObjectTranslationY: 0.5,
        viewPortTranslationX: 0,
        viewPortTranslationY: 0,
        objectPosition: [0, 0]
      }
    };
    expect(actionActual).toEqual(actionExpected);
  });

  it("check action resizeMap", () => {
    const r = {
      uuid: "prova",
      viewPortWidth: 200,
      viewPortHeight: 200
    };

    const actionActual = resizeMap(r);

    expect(actionActual).toEqual({
      type: RESIZE_MAP,
      payload: {
        uuid: "prova",
        viewPortWidth: 200,
        viewPortHeight: 200
      }
    });
  });

  it("check action removeMap", () => {
    const r = {
      uuid: "prova"
    };

    const actionActual = removeMap(r);

    expect(actionActual).toEqual({
      type: REMOVE_MAP,
      payload: {
        uuid: "prova"
      }
    });
  });

  it("check action StoreTileMap", () => {
    const aTile = {
      uuid: "prova",
      z: 1,
      x: 1,
      y: 1,
      tile: "Solo la tile di prova"
    };

    const actionActual = storeTileMap(aTile);

    expect(actionActual).toEqual({
      type: STORE_TILE_MAP,
      payload: {
        uuid: "prova",
        z: 1,
        x: 1,
        y: 1,
        tile: "Solo la tile di prova"
      }
    });
  });

  it("check action StoreMetaTileMap", () => {
    const someTiles = {
      uuid: "prova",
      timestamp: 100000,
      tiles: [
        { x: 1, y: 1, z: 1, tile: "tile1" },
        { x: 2, y: 1, z: 1, tile: "tile2" },
        { x: 3, y: 1, z: 1, tile: "tile3" },
        { x: 4, y: 1, z: 1, tile: "tile4" }
      ]
    };

    const actionActual = storeMetaTileMap(someTiles);

    expect(actionActual).toEqual({
      type: STORE_METATILE_MAP,
      payload: {
        uuid: "prova",
        timestamp: 100000,
        tiles: [
          { x: 1, y: 1, z: 1, tile: "tile1" },
          { x: 2, y: 1, z: 1, tile: "tile2" },
          { x: 3, y: 1, z: 1, tile: "tile3" },
          { x: 4, y: 1, z: 1, tile: "tile4" }
        ]
      }
    });
  });
});
