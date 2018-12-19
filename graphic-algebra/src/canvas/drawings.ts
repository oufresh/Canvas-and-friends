import * as rxjs from 'rxjs';
import * as operators from 'rxjs/operators';
import { CanvasPosition } from './types';
import { ShapeTypes } from './canvasShapes';
import { Shape } from '../shapes/base';
import { Point } from '../shapes/point';

/*export function setDrawingManager(drawingType: ShapeTypes) {
    
}*/

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