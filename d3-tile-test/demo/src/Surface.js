//@flow
import React from "react";

const Surface = ({ width, height, children, id, tr, svgRef, onMouseMove }) => {
  const onMV = onMouseMove ? onMouseMove : () => {};
  return (
    <svg
      data-id={id}
      width={width}
      height={height}
      ref={svgRef}
      onMouseMove={onMV}
    >
      <g transform={tr}>{children}</g>
    </svg>
  );
};

export default Surface;
