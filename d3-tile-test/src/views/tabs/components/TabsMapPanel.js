//@flow
import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import PlainTileRender from '../../tile/components/PlainTileRender';
import { type RenderTileArg } from '../../tile/components/types';
import { 
    type TilesByUuidT, 
    type ViewPortByUuidT,
    type MapSizeByUuidT,
    type ScaleByUuidT
}
from '../../../modules';


type Props = {|
    defaultIndex?:number,
    defaultObjectPosition?:Array<number>, //per ora uno per tutti poi forse bisognera' averlo x ogni tab
    defaultViewportPosition?:Array<number>, //per ora uno per tutti poi forse bisognera' averlo x ogni tab
    onZoomed:(string,number,number,number)=>void,
    renderTile: (RenderTileArg) => React.Component<Object, Object>,
    scalesByUuid:ScaleByUuidT,
    sizeByUuid:MapSizeByUuidT,
    tilesByUuid:TilesByUuidT,
    uuids:Array<string>,
    viewPortByUuid:ViewPortByUuidT,
|}

const TabsMapPanel = ({uuids,defaultIndex,viewPortByUuid,tilesByUuid,sizeByUuid,scalesByUuid,onZoomed,renderTile,defaultViewportPosition=[0, 0],defaultObjectPosition=[0, 0]}:Props) =>{
    return <Tabs defaultIndex={defaultIndex}>
        <TabList>
        {
            uuids.map( (element,i) => {
                return (
                    <Tab key={'tab-' + i}>
                        tab - {i}
                    </Tab>
                ); 
            })
        }
        </TabList>

        {
            uuids.map((v,i) => {
                const {viewPortWidth,viewPortHeight} = viewPortByUuid.get(v);
                const tiles = tilesByUuid.get(v);
                const scales = scalesByUuid.get(v);
                const {width:sizeWidth=0,height:sizeHeight=0} = sizeByUuid.get(v);
                return ( 
                    <TabPanel key={v}>
                        <PlainTileRender 
                            key={v}
                            uuid={v}
                            height={viewPortHeight}
                            width={viewPortWidth} 
                            left={10}
                            top={50}
                            objectHeight={sizeHeight}
                            objectInitZoom={scales?scales.initScale:null}
                            objectPosition={defaultObjectPosition}
                            objectDefaultZoom={scales?scales.defaultScale:null}
                            objectWidth={sizeWidth}
                            objectZoomExtent={scales?[scales.minScale, scales.maxScale]:null}
                            tiles={tiles} 
                            onZoomed={onZoomed} 
                            renderTile={renderTile}
                            viewportPosition={defaultViewportPosition} 
                        />
                    </TabPanel>
                    )
                })
        }
    </Tabs>

}

export {TabsMapPanel};