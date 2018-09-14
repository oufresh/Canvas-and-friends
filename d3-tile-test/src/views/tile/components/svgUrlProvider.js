//@flow
import React, { PureComponent } from 'react';

const svgUrlProvider = (WrappedComponent: PureComponent<{}>, baseUrl: string) => {
    return class UrlProvidedComponent extends PureComponent<{}> {
        constructor(props:{}) {
            super(props);
        }

        render() {
            return <WrappedComponent urlSvgProvider={(z,x,y)=>`${baseUrl}/${z}/${x}/${y}`} {...this.props} />;
        }
    }
}

export default svgUrlProvider;