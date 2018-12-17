import * as rxjs from 'rxjs';
import { CanvasPosition } from './types';
import { ShapeTypes } from './canvasShapes';

/*export function setDrawingManager(drawingType: ShapeTypes) {
    
}*/

export function manageOnClick(drawingType: ShapeTypes, clickSubj: rxjs.Subject<CanvasPosition>) {
    return clickSubj.asObservable();
}