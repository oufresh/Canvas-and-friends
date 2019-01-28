//@flow
import * as React from "react";
import {
  serializeTileIndex,
  MapTileCache,
  type Tiles,
  TileIndex,
  TileValue,
  type RenderModality
} from "../../../modules/maps";
import { renderCachedTile } from "./renderTile";

export interface TileCollectionRenderProps {
  tiles: Tiles;
  tileCache: MapTileCache;
  renderModality: RenderModality;
}

export class TileCollectionRender extends React.PureComponent<TileCollectionRenderProps> {
  render() {
    let tileComponents = [];
    tileComponents = this.props.tiles.map(t => {
      const tileIndex: TileIndex = { x: t.x, y: t.y, z: t.z };
      const tileCacheMap = this.props.tileCache.tileCacheMap;
      //prettier-ignore
      const tValue: TileValue | typeof undefined = tileCacheMap.get(serializeTileIndex(tileIndex));
      return renderCachedTile(this.props.renderModality, tileIndex, tValue);
    });

    return <React.Fragment>{tileComponents}</React.Fragment>;
  }
}
