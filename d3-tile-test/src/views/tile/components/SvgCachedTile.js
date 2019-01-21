//@flow
import React from "react";
import { TILE_SIZE /*, serializeTileIndex*/ } from "../../../modules";

export interface SvgCachedTilePropsType {
  tileContent: string;
  x: number;
  y: number;
  z: number;
}

/**
 * Crea l'oggetto per iniettare il markup svg nel componente
 * @param {string} svg markup della tile
 */
const createSvgMarkup = (svg?: string): Object => {
  return { __html: svg };
};

/**
 * Componente React per il rendering delle Tile
 */
export class SvgCachedTile extends React.PureComponent<SvgCachedTilePropsType> {
  render() {
    const content = createSvgMarkup(this.props.tileContent);
    //prettier-ignore
    const transform = "translate(" + this.props.x * TILE_SIZE + " " + this.props.y * TILE_SIZE + ")";
    /* console.log(
      "Render tile" +
        (this.props.tileContent === "" ? " empty: " : ":") +
        serializeTileIndex({
          z: this.props.z,
          x: this.props.x,
          y: this.props.y
        }) +
        ", " +
        new Date().toISOString()
    );*/
    return (
      <g
        transform={transform}
        width={TILE_SIZE}
        height={TILE_SIZE}
        dangerouslySetInnerHTML={content}
      />
    );
  }
}
