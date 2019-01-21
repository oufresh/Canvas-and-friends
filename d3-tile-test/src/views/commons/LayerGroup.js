//@flow
import React from "react";
import { transformToString } from "../transforms";
import { type ZoomTransform } from "../../modules/maps";

type LayerGroupPropsT = {
  transform: ZoomTransform,
  svgContent: string
};

const createSvgMarkup = (svg: string) => {
  return { __html: svg };
};

const LayerGroup = (props: LayerGroupPropsT) => {
  const { transform } = props;
  const content = createSvgMarkup(props.svgContent);
  const strTr = transform
    ? transformToString(
        transform.transformX ? transform.transformX : 0,
        transform.transformY ? transform.transformY : 0,
        transform.currentExpScale ? transform.currentExpScale : 1
      )
    : "";
  return <g transform={strTr} dangerouslySetInnerHTML={content} />;
};

export { LayerGroup };
