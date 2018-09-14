//@flow
import { type Action } from 'stweb-redux-helper';
import { MOVE_TILE } from '../modules/maps';

/**
 * Vogliamo intercettare le action di move map e fare le fetch per
 * caricare le tile svg nello store. Dopo spariamo la action che è stata caricata.
 * L'ipotesi è gestire anche la cache.
 */
const tileLoaderMiddleware = ({getState, dispatch}) => (next: Function) => (action: Action) => {
    if (action.type === MOVE_TILE) {
        console.log('Action move tile: ');
        console.log(action.payload);
    }
    return next(action);
};

export default tileLoaderMiddleware;