import 'core-js/es6';
import 'core-js/es7/array';
import 'raf/polyfill';
import React from 'react';
import { Fragment } from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter, Switch, Route, Link } from 'react-router-dom';
import { injectGlobal } from 'styled-components';
import store from './store/store';
import GeoRasterRender from './GeoRasterRender';
import PlainSvgRender from './PlainSvgRender';
import MapsContainer from './MapsContainer';
import TabsMapContainer from './TabsMapContainer';
import GeoRasterMultipleMaps from './GeoRasterMultipleMaps';
import StSchemaRender from './StSchemaRender';
import MultiStSchemaRender from './MultiStSchemaRender';
import SingleTileRender from './SingleTileRender';
import LateralMenu from './LateralMenu';
import MenuList from './MenuList';

injectGlobal`
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
  }
`;

const Home = () => (
  <header>
    <nav>
    <MenuList />
    </nav>
  </header>
);

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/georasterrender' component={GeoRasterRender}/>
      <Route path='/svgrender' component={PlainSvgRender}/>
      <Route path='/mapsContainer' component={MapsContainer}/>
      <Route path='/geomapsraster' component={GeoRasterMultipleMaps}/>
      <Route path='/tabsMapContainer' component={TabsMapContainer}/>
      <Route path='/stschemarender' component={StSchemaRender}/>
      <Route path='/multistschemarender' component={MultiStSchemaRender}/>
      <Route path='/singleschemarender' component={SingleTileRender}/>
    </Switch>
  </main>
);

const App = () => (
    <Provider store={store}>
        <HashRouter>
            <Fragment>
              <LateralMenu />
              <Main />
            </Fragment>
        </HashRouter>
    </Provider>
);

render(<App/>, document.querySelector('#demo'))
