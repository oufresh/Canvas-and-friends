import * as rxjs from 'rxjs';
import * as operators from 'rxjs/operators';
import { CanvasPosition } from './types';
import { ShapeTypes, CanvasShapes } from './canvasShapes';
import { Shape } from '../shapes/base';
import { Point } from '../shapes/point';
import { MouseHits, collisionProcessor } from './canvasCollisions';

export function deleteShapeProcessor(drawingType: ShapeTypes, shapes: CanvasShapes, clickSubj: rxjs.Subject<CanvasPosition>, moveSubj: rxjs.Subject<CanvasPosition>, onMouseHitObs: rxjs.Observable<MouseHits>) {
    if (onMouseHitObs) {
        return onMouseHitObs.pipe(
            operators.filter((mouseHits: MouseHits) => {
                return mouseHits.hits.size > 0;
            }),
            operators.switchMap((mouseHits: MouseHits) => {
                // quando c'è un hit con dopo un click allora posso fare il delete se la shape è del tipo che voglio cancellare
                // return clickSubj.pipe()
            }));
    } else {
        return clickSubj.pipe(
            operators.switchMap((pos: CanvasPosition) => {
                return collisionProcessor(pos, shapes);
        }));
    }
}

export interface Drawing {
    type: ShapeTypes;
    shape: Shape;
}

export function drawPointProcessor(clickSubj: rxjs.Subject<CanvasPosition>) {
    return clickSubj.pipe(operators.map((pos: CanvasPosition) => {
        return {
            type: ShapeTypes.POINT,
            shape: new Point('AAA', pos[0], pos[1])
        };
    }));
}

export function createDrawingEventProcessor(drawingType: ShapeTypes, clickSubj: rxjs.Subject<CanvasPosition>, moveSubj: rxjs.Subject<CanvasPosition>): rxjs.Observable<Drawing> | null {
    if (drawingType === ShapeTypes.POINT) {
        return drawPointProcessor(clickSubj);
    }
    return null;
}