import { MouseHits } from './canvasCollisions';

export type CanvasPosition = Array<number>;
export type CanvasClickPosition = {
    pos: CanvasPosition;
    hits: MouseHits
};
