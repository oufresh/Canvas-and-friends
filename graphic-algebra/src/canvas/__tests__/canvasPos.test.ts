import { getMousePos } from '../canvasUtils';

describe('This is a simple test', () => {
    test('renders the heading', () => {
        const e = {
            clientX: 10,
            clientY: 20
        };

        const ev = e as MouseEvent;

        const result = getMousePos({ x: 5, y: 15}, ev);

        expect(result).toEqual({
            x: 5,
            y: 5
        });
    });
});