//@flow
import React from 'react';
import { transformToString } from '../utils';

type LayerGroupPropsT = {
    scale: number,
    translate: Array<number>,
    svgContent: string
};

const createSvgMarkup = (svg: string) => {
    return { __html: svg };
}

const LayerGroup = (props: LayerGroupPropsT) => {
    const content = createSvgMarkup(props.svgContent);
    const strTr = (props.translate && props.scale) ? transformToString(props.translate[0], props.translate[1], props.scale) : '';
    return <g transform={strTr} dangerouslySetInnerHTML={content} />;
}

export { LayerGroup };
