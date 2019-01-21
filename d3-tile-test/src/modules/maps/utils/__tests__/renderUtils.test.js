import { calcExpInt, calObjExpScale, calcSingleObjScale } from "../renderUtils";
import {
  EXP_RENDER_MODALITY,
  LINEAR_RENDER_MODALITY,
  SINGLE_LINEAR_RENDER_MODALITY,
  SINGLE_EXP_RENDER_MODALITY
} from "../../renderModalities";

jest.mock("../linearRenderUtils");
jest.mock("../expRenderUtils");
jest.mock("../singleExpRenderUtils");
import { calcLinearScale } from "../linearRenderUtils";
import { calcExpScale } from "../expRenderUtils";
import { calcSingleExpScale } from "../singleExpRenderUtils";

//da fare il test della factory mocckando i calcoli

describe("scale calculations", () => {
  it("calcExpInt", () => {
    const expInt = calcExpInt(65536, 65536);
    expect(expInt).toEqual(8);
  });

  it("calObjExpScale LINEAR_RENDER_MODALITY", () => {
    calcLinearScale.mockImplementation(() => 256);
    const s = calObjExpScale(LINEAR_RENDER_MODALITY, 1, 1, 1);
    expect(calcLinearScale).toHaveBeenCalledTimes(1);
  });

  it("calObjExpScale EXP_RENDER_MODALITY", () => {
    calcExpScale.mockImplementation(() => 256);
    const s = calObjExpScale(EXP_RENDER_MODALITY, 1, 1, 1, 1);
    expect(calcExpScale).toHaveBeenCalledTimes(1);
  });

  it("calcSingleObjScale SINGLE_EXP_RENDER_MODALITY", () => {
    calcSingleExpScale.mockImplementation(() => 1);
    const s = calcSingleObjScale(SINGLE_EXP_RENDER_MODALITY, 1, 1);
    expect(calcSingleExpScale).toHaveBeenCalledTimes(1);
  });

  it("calcSingleObjScale SINGLE_LINEAR_RENDER_MODALITY", () => {
    const s = calcSingleObjScale(SINGLE_LINEAR_RENDER_MODALITY, 1);
    expect(s).toEqual(1);
  });
});
