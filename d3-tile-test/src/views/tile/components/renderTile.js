//@flow
import React from "react";
import {
  /*EXP_RENDER_MODALITY,
  LINEAR_RENDER_MODALITY,
  GEO_RENDER_MODALITY,*/
  type RenderModality
} from "../../../modules";
/*import {
  type MapSize,
  type TileUrlBuilderParam,
  type ReferenceSystemScales
} from "../../../types";*/
import { SvgCachedTile } from "./SvgCachedTile";
import { TileIndex, TileValue } from "../../../modules/maps";
//import { RasterTile } from "./RasterTile";

export const renderCachedTile = (
  renderModality: RenderModality,
  tileIndex: TileIndex,
  tileValue?: TileValue
): any => {
  return (
    <SvgCachedTile
      x={tileIndex.x}
      y={tileIndex.y}
      z={tileIndex.z}
      key={"" + tileIndex.z + tileIndex.x + tileIndex.y}
      tileContent={tileValue ? tileValue.tile : ""}
    />
  );
};
/*
export const renderTile = (
  renderModality: RenderModality,
  baseTileUrl: string,
  tileUrlBuilder: TileUrlBuilderParam => string,
  tileIndex: TileIndex,
  referenceSystemScales: ReferenceSystemScales,
  objectSize: MapSize,
  tilePromise?: string => Promise<any>
) => {
  if (
    renderModality === EXP_RENDER_MODALITY ||
    renderModality === LINEAR_RENDER_MODALITY
  ) {
    const scale =
      renderModality === EXP_RENDER_MODALITY
        ? referenceSystemScales.currentScaleInt
        : tileIndex.z;
    const url = tileUrlBuilder({
      baseUrl: baseTileUrl,
      width: objectSize.width,
      height: objectSize.height,
      x: tileIndex.x,
      y: tileIndex.y,
      zoomIndex: scale
    });
    return (
      <SvgTile
        x={tileIndex.x}
        y={tileIndex.y}
        z={tileIndex.z}
        key={"" + tileIndex.z + tileIndex.x + tileIndex.y}
        url={url}
        tilePromise={tilePromise}
      />
    );
  } else if (GEO_RENDER_MODALITY === renderModality) {
    const scale =
      renderModality === EXP_RENDER_MODALITY
        ? referenceSystemScales.currentScaleInt
        : tileIndex.z;
    const url = tileUrlBuilder({
      baseUrl: baseTileUrl,
      width: NaN,
      height: NaN,
      x: tileIndex.x,
      y: tileIndex.y,
      zoomIndex: scale
    });
    return (
      <RasterTile
        x={tileIndex.x}
        y={tileIndex.y}
        z={tileIndex.z}
        key={"" + tileIndex.z + tileIndex.x + tileIndex.y}
        url={url}
      />
    );
  } else {
    return null;
  }
};*/
