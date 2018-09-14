//@flow
import React, { PureComponent } from 'react';

const getTilePromise = (baseUrl, z,x,y) => {
    const url = `${baseUrl}/${z}/${x}/${y}`;
    return fetch(url).then(r => {
        if (r.ok === true)
            return r.text();
        else
            throw new Error(r.statusText)
    });
}

const svgGetTile = (WrappedComponent: PureComponent<{}>, baseUrl: string) => {
    return class UrlProvidedComponent extends PureComponent<{}> {
        constructor(props:{}) {
            super(props);
        }

        render() {
            return <WrappedComponent getTilePromise={getTilePromise} baseUrl={baseUrl} {...this.props} />;
        }
    }
}

export default svgGetTile;