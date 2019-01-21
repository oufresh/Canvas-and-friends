import React from "react";
import { shallow } from "enzyme";
import { ScaleSelectorHOC } from "../ScaleSelector";

describe("ScaleSelector Component", () => {
  it("renders without a crash ", () => {
    const component = shallow(
      <ScaleSelectorHOC
        selectedScale={2}
        scales={[0, 1, 2, 3, 4]}
        visible={true}
        uuid="prova1"
      />
    );
    expect(component).toMatchSnapshot();
  });
});
