import { getMousePos } from "../mouse";

describe("mouse", () => {
  it("getMousePos, calculate mouse coords from simple event", () => {
    window.scrollX = 0;
    window.scrollY = 0;

    const evt = {
      pageX: 50,
      pageY: 100
    };

    const pos = getMousePos(evt);

    expect(pos).toEqual([50, 100]);
  });

  it("getMousePos, calculate mouse coords from simple event with scroll", () => {
    window.scrollX = 25;
    window.scrollY = 2000;

    const evt = {
      pageX: 50 + 25,
      pageY: 100 + 2000
    };

    const pos = getMousePos(evt);

    expect(pos).toEqual([50, 100]);
  });

  it("getMousePos, calculate mouse coords from event with canvas offset", () => {
    window.scrollX = 0;
    window.scrollY = 0;
    const canvasOffet = {
      x: 100,
      y: 200
    };

    const evt = {
      pageX: 50 + canvasOffet.x,
      pageY: 100 + canvasOffet.y,
      target: {
        getBoundingClientRect: () => {
          return {
            left: canvasOffet.x,
            top: canvasOffet.y
          };
        }
      }
    };

    const pos = getMousePos(evt);

    expect(pos).toEqual([50, 100]);
  });
});
