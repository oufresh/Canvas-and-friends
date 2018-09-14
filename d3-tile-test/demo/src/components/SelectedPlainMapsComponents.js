/*eslint no-magic-numbers:*/
import React from 'react';
import PlainTileRender from '../../../src/views/tile/components/PlainTileRender';
import svgUrlProvider from '../../../src/views/tile/components/svgUrlProvider';
import SvgTile from '../../../src/views/tile/components/SvgTile';
import { type RenderTileArg } from '../../../src/views/tile/components/types';
import {
    type TilesByUuidT,
    type ViewPortByUuidT,
    type MapSizeByUuidT,
    type ScaleByUuidT,
    type RenderInfoByUuidT
} from '../../../src/modules';

type Props={|
    renderInfoByUuid:RenderInfoByUuidT,
    tilesByUuid:TilesByUuidT,
    viewPortByUuid:ViewPortByUuidT,
    scalesByUuid:ScaleByUuidT,
    sizeByUuid:MapSizeByUuidT,
    selectedMaps:Set<string>,
    onZoomed:(string,number,number,number)=>void
|}


const defaultViewportPosition = [0, 0];
const defaultObjectPosition = [0, 0];

const SvgProvidedTile = svgUrlProvider(SvgTile, 'http://localhost:5000/tiles');

export const renderTile = (t: RenderTileArg) => <SvgProvidedTile 
    x={t.x}
    y={t.y}
    z={t.z}
    key={''+t.z+t.x+t.y}
/>;

export const SelectedPlainMapsComponents = ({selectedMaps,viewPortByUuid,tilesByUuid,sizeByUuid,scalesByUuid,onZoomed,renderInfoByUuid}:Props) =>{
    return selectedMaps.toJS().map((v,i) => {
        const {viewPortWidth,viewPortHeight} = viewPortByUuid.get(v);
        const {width:sizeWidth=0,height:sizeHeight=0} = sizeByUuid.get(v);
        const scales = scalesByUuid.get(v);
        const tiles = tilesByUuid.get(v);
        const renderInfo = renderInfoByUuid.get(v);
        return ( 
                <PlainTileRender 
                    key={v}
                    uuid={v}
                    height={viewPortHeight}
                    width={viewPortWidth} 
                    left={ 0 + i* 704}
                    top={0}
                    objectDefaultZoom={scales?scales.defaultScale:null}
                    objectHeight={sizeHeight}
                    objectInitZoom={scales?scales.initScale:null}
                    objectPosition={defaultObjectPosition}
                    objectWidth={sizeWidth}
                    objectZoomExtent={scales?[scales.minScale, scales.maxScale]:null}
                    onZoomed={onZoomed} 
                    renderTile={renderTile}
                    tiles={tiles}
                    viewportPosition={defaultViewportPosition}
                    renderInfo={renderInfo}
                />
            )
        }
    
    )
}
