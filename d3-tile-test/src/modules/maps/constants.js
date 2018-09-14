//@flow
import { type ExpRenderModalityT, type LinearRenderModalityT, type SingleRenderModalityT} from './types';
export const MOVE_TILE_ERROR = `tried to move tile witch is not into the state`;

export const EXP_RENDER_MODALITY:ExpRenderModalityT = 'EXPONENTIAL_RENDER_MODALITY';
export const LINEAR_RENDER_MODALITY:LinearRenderModalityT = 'LINEAR_RENDER_MODALITY';
export const SINGLE_RENDER_MODALITY:SingleRenderModalityT = 'SINGLE_RENDER_MODALITY';

export type RenderModalityT = ExpRenderModalityT | LinearRenderModalityT | SingleRenderModalityT;

