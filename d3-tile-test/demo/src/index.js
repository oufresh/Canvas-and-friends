import "./index.css";
import "core-js/es6";
import "core-js/es7/array";
import "core-js/es7/map";
import "raf/polyfill";
import React from "react";
import { Fragment } from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { HashRouter, Switch, Route } from "react-router-dom";
import store from "./store/store";
import MapsContainer from "./MapsContainer";
import SingleSvgRender from "./SingleSvgRender";
import MenuList from "./MenuList";
import GeoRasterRender from "./GeoRasterRender";
import SurfaceDemo from "./SurfaceDemo";
import ExpScaleMapRender from "./ExpScaleMapRender";
import LinearTileRender from "./LinearTileRender";

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
      <Route exact path="/" component={Home} />
      <Route path="/lineartilerender" component={LinearTileRender} />
      <Route path="/georasterrender" component={GeoRasterRender} />
      <Route path="/mapsContainer" component={MapsContainer} />
      <Route path="/singleschemarender" component={SingleSvgRender} />
      <Route path="/surfacedemo" component={SurfaceDemo} />
      <Route path="/expScaleMapRender" component={ExpScaleMapRender} />
    </Switch>
  </main>
);

const App = () => (
  <Provider store={store}>
    <HashRouter>
      <Fragment>
        <Main />
      </Fragment>
    </HashRouter>
  </Provider>
);

render(<App />, document.querySelector("#demo"));
