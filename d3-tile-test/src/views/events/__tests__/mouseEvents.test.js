import { doubleClickFilter } from "../mouseEvents";

describe("mouseEvents", () => {
  it("doubleClickFilter found", () => {
    const aEvent = {
      target: {
        nodeName: "pippo",
        parentNode: {
          nodeName: "pluto",
          parentNode: {
            nodeName: "svg"
          }
        }
      }
    };
    const ret = doubleClickFilter(aEvent);
    expect(ret).toBeInstanceOf(Array);
    expect(ret.length).toEqual(2);
  });
  it("doubleClickFilter not found", () => {
    const aEvent = {
      target: {
        nodeName: "pippo",
        parentNode: {
          nodeName: "pluto",
          parentNode: {
            nodeName: "svg"
          }
        }
      }
    };
    const ret = doubleClickFilter(aEvent);
    expect(ret).toBeInstanceOf(Array);
    expect(ret.length).toEqual(2);
  });
  it("doubleClickFilter found with path", () => {
    const aEvent = {
      path: [{ nodeName: "pippo" }, { nodeName: "pluto" }, { nodeName: "svg" }]
    };
    const ret = doubleClickFilter(aEvent);
    expect(ret).toBeInstanceOf(Array);
    expect(ret.length).toEqual(2);
  });
  it("doubleClickFilter not found with path", () => {
    const aEvent = {
      path: [{ nodeName: "pippo" }, { nodeName: "pluto" }, { nodeName: "svg" }]
    };
    const ret = doubleClickFilter(aEvent);
    expect(ret).toBeInstanceOf(Array);
    expect(ret.length).toEqual(2);
  });
});
