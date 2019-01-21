import React from "react";
import { shallow } from "enzyme";
import { SvgDiv } from "../SvgDiv";

describe("SvgDiv", () => {
  it("renders without a crash ", () => {
    const component = shallow(
      <SvgDiv width={100} height={200}>
        <h1>Hello!!</h1>
      </SvgDiv>
    );
    expect(component).toMatchSnapshot();
  });
});
