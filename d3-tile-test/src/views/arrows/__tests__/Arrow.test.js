import React from "react";
import { shallow } from "enzyme";
import { ArrowUp } from "../Arrow";

describe("ArrowUp", () => {
  it("renders without a crash ", () => {
    const component = shallow(
      <ArrowUp top={100} left={200} onClick={()=>{}}>
      </ArrowUp>
    );
    expect(component).toMatchSnapshot();
  });
});