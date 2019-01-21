//@flow
import React from "react";

const SvgDiv = ({
  top,
  left,
  width,
  height,
  backgroundColor,
  children
}: {
  top?: number,
  left?: number,
  width: number,
  height: number,
  backgroundColor?: string,
  children: any
}) => {
  const style = {
    position: "absolute",
    top: (top ? top : 0) + "px",
    left: (left ? left : 0) + "px",
    overflow: "hidden",
    pointerEvents: "all",
    width: width + "px",
    height: height + "px",
    backgroundColor: backgroundColor ? backgroundColor : "rgba(0,0,0,1)"
  };
  return <div style={style}>{children}</div>;
};

export { SvgDiv };
