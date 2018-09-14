import { createStore/*, applyMiddleware*/ } from 'redux';
import { devToolsEnhancer /*,composeWithDevTools*/ } from 'redux-devtools-extension';
import reducers from './reducers';
//import TileLoader from '../../../src/middleware/TileLoader';

export default createStore(
    reducers,
    devToolsEnhancer()
    //composeWithDevTools(applyMiddleware(TileLoader))
);