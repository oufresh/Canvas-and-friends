import * as rxjs from 'rxjs';
import * as operators from 'rxjs/operators';
import { CanvasPosition } from './types';
import { ShapeTypes } from './canvasShapes';
import { Shape } from '../shapes/base';
import { Point } from '../shapes/point';
import { MouseHits, collisionProcessor } from './canvasCollisions';
import { Line } from '../shapes/line';

export function deleteShapeProcessor(/*drawingType: ShapeTypes, shapes: CanvasShapes, */clickSubj: rxjs.Subject<CanvasPosition>, moveSubj: rxjs.Subject<CanvasPosition>, onMouseHitObs: rxjs.Observable<MouseHits> | null) {
    if (onMouseHitObs) {
        return onMouseHitObs.pipe(
            operators.filter((mouseHits: MouseHits) => {
                return mouseHits.hits.size > 0;
            }),
            operators.switchMap((mouseHits: MouseHits) => {
                // quando c'è un hit con dopo un click allora posso fare il delete se la shape è del tipo che voglio cancellare
                return clickSubj.pipe(operators.map(() => {
                    return mouseHits;
                }));
            }));
    } else {
        // TODO da fare la collision se disabilitata di default
        /*return clickSubj.pipe(
            operators.switchMap((pos: CanvasPosition) => {
                return collisionProcessor(pos, shapes);
        }));*/

        return null;
    }
}

export interface Drawing {
    type: ShapeTypes;
    end: boolean;
    shape: Shape;
}

export function drawPointProcessor(clickSubj: rxjs.Subject<CanvasPosition>) {
    return clickSubj.pipe(operators.map((pos: CanvasPosition) => {
        return {
            type: ShapeTypes.POINT,
            shape: new Point('AAA', pos[0], pos[1]),
            end: true
        };
    }));
}

export function drawLineProcesso(clickSubj: rxjs.Subject<CanvasPosition>, moveSubj: rxjs.Subject<CanvasPosition>): rxjs.Observable<Drawing> | null {
    return clickSubj.pipe(operators.switchMap((pos: CanvasPosition) => {
        return moveSubj.pipe(operators.map((mPos: CanvasPosition) => {
            const p1: Point = new Point('L1', pos[0], pos[1]);
            const p2: Point = new Point('L2', mPos[0], mPos[1]);
            return {
                type: ShapeTypes.LINE,
                shape: new Line('L', p1, p2),
                end: false
            };
        }));
    }));
}