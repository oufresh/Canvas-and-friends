//@flow
import React, { PureComponent } from 'react';

import { type RenderInfoT} from '../../src/modules';

//http://localhost:7080/schematica/rest/schematica/schemi/tile/ST/ST/REALE/TOPOLOGICO_MT/none/none/Monocromatico/52572/44016/2/8/1?id=none&infoDAL=none&codApp=none

const getTilePromise = (baseUrl: string, z: number, x: number, y: number): Promise => {
    const url = `${baseUrl}/${z}/${x}/${y}`;
    return fetch(url).then(r => {
        if (r.ok === true)
            return r.text();
        else
            throw new Error(r.statusText)
    });
}

const getStTilePromise = (baseUrl: string, z: number, x: number, y: number, renderInfo: RenderInfoT): Promise => {
    const stScale = Math.round(renderInfo.scaleExtent[0] + (renderInfo.maxScaleConv - z));
    const url = `${baseUrl}/${renderInfo.schemaWidth}/${renderInfo.schemaHeight}/${stScale}/${x}/${y}?id=none&infoDAL=none&codApp=none`;

    const p = new Promise((resolve, reject) => {
        return fetch(url).then(r => {
            if (r.ok === true)
                return r.json();
            else
                return new Error('Error fetch: ' + r.status + ', ' + r.statusText);
        }).then(json => {
            resolve(json.schemaSvg);
        }).catch(e => {
            console.error(e);
            reject(e);
        });
    });

    return p;
}

const stSvgGetTile = (WrappedComponent: PureComponent<{}>, baseUrl: string, renderInfo: RenderInfoT) => {
    return class UrlProvidedComponent extends PureComponent<{}> {
        constructor(props:{}) {
            super(props);
        }

        render() {
            return <WrappedComponent getTilePromise={getStTilePromise} baseUrl={baseUrl} renderInfo={renderInfo} {...this.props} />;
        }
    }
}

export default stSvgGetTile;