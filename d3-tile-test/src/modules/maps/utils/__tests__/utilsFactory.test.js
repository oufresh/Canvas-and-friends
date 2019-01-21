/*eslint no-magic-numbers:*/
jest.mock("../expTranslation");
import { calcExpScaledTranslation } from "../expTranslation";
jest.mock("../linearTranslation");
import { calcLinearScaledTranslation } from "../linearTranslation";
import {
  EXP_RENDER_MODALITY,
  LINEAR_RENDER_MODALITY,
  GEO_RENDER_MODALITY,
  SINGLE_LINEAR_RENDER_MODALITY
} from "../../renderModalities";
import { calcObjectTranslation, DEFAULT_OBJ_POS } from "../translation";

describe("utilsFactory", () => {
  it("calcObjectTranslation with EXP_RENDER_MODALITY", () => {
    calcExpScaledTranslation.mockImplementation(() => [20, 30]);
    const newObj = calcObjectTranslation(
      EXP_RENDER_MODALITY,
      [10, 20],
      400,
      400
    );
    expect(newObj).toEqual([20, 30]);
  });
  it("calcObjectTranslation with LINEAR_RENDER_MODALITY", () => {
    calcLinearScaledTranslation.mockImplementation(() => [8, 16]);
    const newObj = calcObjectTranslation(
      LINEAR_RENDER_MODALITY,
      [10, 20],
      400,
      400
    );
    expect(newObj).toEqual([8, 16]);
  });

  it("calcObjectTranslation with GEO_RENDER_MODALITY", () => {
    const newObj = calcObjectTranslation(
      GEO_RENDER_MODALITY,
      [10, 20],
      400,
      400
    );
    expect(newObj).toEqual(DEFAULT_OBJ_POS);
  });

  it("calcObjectTranslation with SINGLE_LINEAR_RENDER_MODALITY", () => {
    const newObj = calcObjectTranslation(
      SINGLE_LINEAR_RENDER_MODALITY,
      [10, 20],
      400,
      400
    );
    expect(newObj).toBeNull();
  });

  it("calcObjectTranslation with null objPos", () => {
    const newObj = calcObjectTranslation(GEO_RENDER_MODALITY, null, 400, 400);
    expect(newObj).toEqual(DEFAULT_OBJ_POS);
  });

  it("calcObjectTranslation with undefined objPos", () => {
    const newObj = calcObjectTranslation(
      GEO_RENDER_MODALITY,
      undefined,
      400,
      400
    );
    expect(newObj).toEqual(DEFAULT_OBJ_POS);
  });
});
