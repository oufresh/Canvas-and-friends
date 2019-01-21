import React from "react";
import { shallow } from "enzyme";
import { ZoomScaleInfo } from "../ZoomScaleInfo";

describe("ZoomScaleInfo Component", () => {
  it("renders without a crash ", () => {
    const component = shallow(
      <ZoomScaleInfo
        scalesSize={5}
        scaleMin={-0.49}
        scaleCurrentDecimal={4.49}
      />
    );
    expect(component).toMatchSnapshot();
  });
});
