//@flow
import React from "react";
import { TILE_SIZE } from "../../../modules";

type TilePropsType = {
  url: string,
  x: number,
  y: number,
  width?: number,
  height?: number
};

const defaultHeight: number = TILE_SIZE;
const defaultWidth: number = TILE_SIZE;

export const RasterTile = (props: TilePropsType) => {
  //console.log("RasterTile url: " + props.url);
  const h = props.height ? props.height : defaultHeight;
  const w = props.width ? props.width : defaultWidth;

  return (
    <image
      href={props.url}
      width={w}
      height={h}
      x={props.x * w}
      y={props.y * h}
    />
  );
};
