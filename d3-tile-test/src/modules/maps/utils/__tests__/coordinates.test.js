import {
  calcCoords,
  calcCoordsforTiles,
  convertCoordsForTiles
} from "../coordinates";
import { TILE_SIZE } from "../constants";
import { EXP_RENDER_MODALITY } from "../../renderModalities";

describe("coordinates", () => {
  it("calcCoords, calculate map coords from position no translate or zoom", () => {
    const mx = 0;
    const my = 0;
    const transform = {
      tx: 0,
      ty: 0,
      k: 1
    };
    const coords = calcCoords(mx, my, transform.tx, transform.ty, transform.k);

    expect(coords).toEqual([0, 0]);
  });

  it("calcCoords, calculate map coords from position with translate", () => {
    const mx = 0;
    const my = 0;
    const transform = {
      tx: 100,
      ty: 200,
      k: 1
    };
    const coords = calcCoords(mx, my, transform.tx, transform.ty, transform.k);

    expect(coords).toEqual([-100, -200]);
  });

  it("calcCoords, calculate map coords from position with translate and zoom", () => {
    const mx = 0;
    const my = 0;
    const transform = {
      tx: -100,
      ty: -200,
      k: 2
    };
    const coords = calcCoords(mx, my, transform.tx, transform.ty, transform.k);

    expect(coords).toEqual([50, 100]);
  });

  it("calcCoords, calculate map coords from position != 0 with translate", () => {
    const mx = 30;
    const my = 40;
    const transform = {
      tx: -100,
      ty: -200,
      k: 1
    };
    const coords = calcCoords(mx, my, transform.tx, transform.ty, transform.k);

    expect(coords).toEqual([130, 240]);
  });

  it("calcCoords, calculate map coords from position != 0 with translate and zoom", () => {
    const mx = 30;
    const my = 40;
    const transform = {
      tx: -100,
      ty: -200,
      k: 2
    };
    const coords = calcCoords(mx, my, transform.tx, transform.ty, transform.k);

    expect(coords).toEqual([65, 120]);
  });

  it("calcCoordsforTiles, calculate map coords in base scale from position 0 without translate and zoom", () => {
    const pos = [0, 0];
    const tileTransform = {
      tileTranslateX: 0,
      tileTranslateY: 0,
      tileScale: 1
    };
    const coords = calcCoordsforTiles(
      pos,
      tileTransform.tileScale,
      tileTransform.tileTranslateX,
      tileTransform.tileTranslateY
    );

    expect(coords).toEqual([0, 0]);
  });

  it("calcCoordsforTiles, calculate map coords in base scale from position != 0 without translate and zoom", () => {
    const pos = [5000, 10000];
    const tileTransform = {
      tileTranslateX: 0,
      tileTranslateY: 0,
      tileScale: 1
    };
    const coords = calcCoordsforTiles(
      EXP_RENDER_MODALITY,
      pos,
      tileTransform.tileScale,
      tileTransform.tileTranslateX,
      tileTransform.tileTranslateY
    );

    //devo tener conto della scala di base tile
    expect(coords).toEqual([5000 * TILE_SIZE, 10000 * TILE_SIZE]);
  });

  it("calcCoordsforTiles, calculate map coords in base scale from position != 0 with translate", () => {
    const pos = [100, 100];
    const tileTransform = {
      tileTranslateX: -500,
      tileTranslateY: -1000,
      tileScale: 1
    };
    const coords = calcCoordsforTiles(
      EXP_RENDER_MODALITY,
      pos,
      tileTransform.tileScale,
      tileTransform.tileTranslateX,
      tileTransform.tileTranslateY
    );

    //devo tener conto della scala di base tile
    expect(coords).toEqual([600 * TILE_SIZE, 1100 * TILE_SIZE]);
  });

  it("calcCoordsforTiles, calculate map coords in base scale from position != 0 with zoom", () => {
    const pos = [100, 200];
    const tileTransform = {
      tileTranslateX: 0,
      tileTranslateY: 0,
      tileScale: 1.5
    };
    const coords = calcCoordsforTiles(
      EXP_RENDER_MODALITY,
      pos,
      tileTransform.tileScale,
      tileTransform.tileTranslateX,
      tileTransform.tileTranslateY
    );

    //devo tener conto della scala di base tile
    expect(coords).toEqual([
      Math.round((100 / 1.5) * TILE_SIZE),
      Math.round((200 / 1.5) * TILE_SIZE)
    ]);
  });

  it("calcCoordsforTiles, calculate map coords in base scale from position != 0 with translate and zoom", () => {
    const pos = [100, 200];
    const tileTransform = {
      tileTranslateX: -500,
      tileTranslateY: -500,
      tileScale: 1.5
    };
    const coords = calcCoordsforTiles(
      EXP_RENDER_MODALITY,
      pos,
      tileTransform.tileScale,
      tileTransform.tileTranslateX,
      tileTransform.tileTranslateY
    );

    //devo tener conto della scala di base tile
    expect(coords).toEqual([
      Math.round(((100 + 500 * 1.5) * TILE_SIZE) / 1.5),
      Math.round(((200 + 500 * 1.5) * TILE_SIZE) / 1.5)
    ]);
  });

  it("convertCoordsForTiles, transform coords to get value from base object scale to current scale", () => {
    const baseScaleCoords = [0, 0];
    const coords = convertCoordsForTiles(2, 2, baseScaleCoords);
    expect(coords).toEqual([0, 0]);
  });

  it("convertCoordsForTiles, transform coords to get value from base object scale to current scale", () => {
    const baseScaleCoords = [1000, 1000];
    const coords = convertCoordsForTiles(2, 2, baseScaleCoords);
    expect(coords).toEqual([1000, 1000]);
  });

  it("convertCoordsForTiles, transform coords to get value from base object scale to current scale", () => {
    const baseScaleCoords = [1000, 1000];
    const coords = convertCoordsForTiles(1, 2, baseScaleCoords);
    expect(coords).toEqual([500, 500]);
  });

  it("convertCoordsForTiles, transform coords to get value from base object scale to current scale", () => {
    const baseScaleCoords = [1000, 1000];
    const coords = convertCoordsForTiles(3, 2, baseScaleCoords);
    expect(coords).toEqual([2000, 2000]);
  });
});
