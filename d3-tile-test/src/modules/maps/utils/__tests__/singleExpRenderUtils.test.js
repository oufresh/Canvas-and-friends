/*eslint no-magic-numbers:*/
import {
  calcSingleExpScaleInv,
  calcSingleExpScale
} from "../singleExpRenderUtils";

describe("singleExpRenderUtils functions test", () => {
  it("calcSingleExpScaleInv prova 0 ", () => {
    const numb = calcSingleExpScaleInv(2, 2);
    expect(numb).toEqual(1);
  });

  it("calcSingleExpScaleInv prova 01 ", () => {
    const numb = calcSingleExpScaleInv(2, 1);
    expect(numb).toEqual(2);
  });

  it("calcSingleExpScaleInv prova 02 ", () => {
    const numb = calcSingleExpScaleInv(2, 4);
    expect(numb).toEqual(0);
  });

  it("calcSingleExpScaleInv prova 1 ", () => {
    const numb = calcSingleExpScaleInv(0, 1.261);
    expect(numb.toFixed(5)).toEqual((-0.3345682756661327).toFixed(5));
  });

  it("calcSingleExpScaleInv prova 2", () => {
    const numb = calcSingleExpScaleInv(0, 1.49);
    expect(numb.toFixed(5)).toEqual((-0.5753123306874368).toFixed(5));
  });

  it("calcSingleExpScaleInv prova 3", () => {
    const numb = calcSingleExpScaleInv(0, 0.7);
    expect(numb).toEqual(0.5145731728297583);
  });

  it("calcSingleExpScale prova 1", () => {
    const numb = calcSingleExpScale(0, 0.49);
    expect(numb).toEqual(1.4044448757379973);
  });

  it("calcSingleExpScale prova 2", () => {
    const numb = calcSingleExpScale(0, -0.49);
    expect(numb).toEqual(0.7120250977985358);
  });
});
