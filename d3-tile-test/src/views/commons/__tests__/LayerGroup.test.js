import React from "react";
import { shallow } from "enzyme";
import { LayerGroup } from "../LayerGroup";

describe("LayerGroup", () => {
  it("renders without a crash ", () => {
    const transform = {
      transformX: 0,
      transformY: 0,
      currentExpScale: 1
    };
    const component = shallow(
      <LayerGroup
        transform={transform}
        svgContent={'<rect x="0" y="0" width="100" height="100" />'}
      />
    );
    expect(component).toMatchSnapshot();
  });
});
