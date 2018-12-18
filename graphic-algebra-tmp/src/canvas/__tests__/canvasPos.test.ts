import { getMousePos } from '../canvasUtils';

describe('This is a simple test', () => {
    test('renders the heading', () => {
        const e = {
            clientX: 10,
            clientY: 20
        };

        const ev = e as MouseEvent;
        /*const cv = {
            get
        }

        const result = getMousePos([5, 15], ev);

        expect(result).toEqual([5, 5]);*/
    });
});