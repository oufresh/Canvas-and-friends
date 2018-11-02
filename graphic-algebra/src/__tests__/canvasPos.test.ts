import { getMousePos } from '../canvasUtils';

describe("This is a simple test", () => {
    test("renders the heading", () => {
        const e = {
            clientX: 10,
            clientY: 20
        };

        const result = getMousePos({
            x: 5,
            y: 15
        }, e as MouseEvent);
        
        expect(result).toEqual({
            x: 5,
            y: 5
        });
    });
});