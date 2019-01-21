//@flow
/*eslint no-magic-numbers:*/
import React from "react";
import { PlainTileRender } from "../../../src/views";
import {
  type TilesByUuidT,
  type ViewPortByUuid,
  type MapSizeByUuid,
  type ScaleByUuidT,
  type RenderModalityBuUuid
} from "../../../src/modules";

type Props = {|
  onZoomed: (string, number, number, number) => void,
  renderModalityByUuid: RenderModalityBuUuid,
  scalesByUuid: ScaleByUuidT,
  selectedMaps: Set<string>,
  sizeByUuid: MapSizeByUuid,
  tilesByUuid: TilesByUuidT,
  viewPortByUuid: ViewPortByUuid,
  viewportObjectPosition: any,
  objectSizes: Map<string, any>
|};

const baseTileUrl = "http://localhost:5000/tiles";
const urlBuilder = p => {
  return p.baseUrl + "/" + p.zoomIndex + "/" + p.x + "/" + p.y;
};

export const SelectedPlainMapsComponents = ({
  selectedMaps,
  viewPortByUuid,
  tilesByUuid,
  objectSizes,
  scalesByUuid,
  onZoomed,
  renderModalityByUuid,
  viewportObjectPosition
}: Props) => {

  let i = 0;
  
  let ret = []

  selectedMaps.forEach(v => {
    const  k = i;
    i++;
    const { viewPortWidth, viewPortHeight } = viewPortByUuid.get(v);
    const { width: sizeWidth = 0, height: sizeHeight = 0 } = objectSizes.get(v);
    const scales = scalesByUuid.get(v);
    const tiles = tilesByUuid.get(v);
    const renderModality = renderModalityByUuid.get(v);
    const objectSize = objectSizes.get(v);
    ret.push(
      <PlainTileRender
        key={v}
        uuid={v}
        height={viewPortHeight}
        width={viewPortWidth}
        left={0 + k * 704}
        top={0}
        onZoomed={onZoomed}
        tiles={tiles}
        viewportObjectPosition={viewportObjectPosition}
        scales={scales}
        objectSize={objectSize}
        baseTileUrl={baseTileUrl}
        tileUrlBuilder={urlBuilder}
        renderModality={renderModality}
      />
    );
  });

  return ret;
};
