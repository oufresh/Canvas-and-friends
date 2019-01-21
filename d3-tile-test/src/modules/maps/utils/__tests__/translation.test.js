import {
  SINGLE_EXP_RENDER_MODALITY,
  EXP_RENDER_MODALITY
} from "../../renderModalities";
jest.mock("../coordinates");
import { calcCoords } from "../coordinates";
jest.mock("../expTranslation");
import { calcExpScaledTranslation } from "../expTranslation";
import {
  calcObjectTranslation,
  calcSingleObjectTranslation
} from "../translation";

describe("translation", () => {
  it("calculate object translation for single svg", () => {
    calcCoords.mockImplementation(() => [200, 200]);
    const scaledObject = calcSingleObjectTranslation(
      SINGLE_EXP_RENDER_MODALITY,
      [100, 100],
      1000,
      1000,
      2
    );
    expect(scaledObject).not.toBeNull();
    expect(scaledObject).toEqual([300, 300]);
  });

  it("calculate object translation for single svg wrong render modality", () => {
    calcCoords.mockImplementation(() => [200, 200]);
    const scaledObject = calcSingleObjectTranslation(
      EXP_RENDER_MODALITY,
      [100, 100],
      1000,
      1000,
      2
    );
    expect(scaledObject).toBeNull();
  });

  it("calculate object translation for tiled svg", () => {
    calcExpScaledTranslation.mockImplementation(() => [0.1, 0.1]);
    const scaledObject = calcObjectTranslation(
      EXP_RENDER_MODALITY,
      [100, 100],
      1000,
      1000,
      2
    );
    expect(scaledObject).not.toBeNull();
    expect(scaledObject).toEqual([0.1, 0.1]);
  });

  it("calculate object translation for tiled svg wrong render modality", () => {
    calcCoords.mockImplementation(() => [200, 200]);
    const scaledObject = calcObjectTranslation(
      SINGLE_EXP_RENDER_MODALITY,
      [100, 100],
      1000,
      1000,
      2
    );
    expect(scaledObject).toBeNull();
  });
});
