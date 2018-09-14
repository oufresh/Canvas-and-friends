import { type SingleRenderInfoT} from './types';

export const initRenderInfo = (objWidth: number, objHeight: number, objZoomExtent: Array<number>, objectDefaultZoom: number, objInitZoom: number): SingleRenderInfoT => {
    return {
        initScale: objInitZoom,
        scaleExtent: [objZoomExtent[0], objZoomExtent[objZoomExtent.length-1]]
    };
};