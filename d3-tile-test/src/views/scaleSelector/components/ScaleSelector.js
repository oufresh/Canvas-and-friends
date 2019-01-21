//@flow
import React from "react";
import styled from "styled-components";
import { branch, renderNothing } from "recompose";

const CELL_WIDTH = 25;
const CELL_HEIGHT = 24;

const ScaleArray = styled.div`
  font-family: Helvetica Neue, Helvetica, Arial, Liberation Sans, sans-serif;
  display: flex;
  flex-direction: row;
  background-color: transparent;
  text-align: center;
  user-select: none;
  height: 24px;
`;
const Scale = styled.div`
  width: ${CELL_WIDTH}px;
  height: ${CELL_HEIGHT}px;
  background-color: ${props =>
    props.current === true ? "rgba(255,40,40,0.60)" : "rgba(50,50,50,0.5);"};
  color: ${props => (props.current ? "cyan" : "#F0F0F0")};
  font-weight: ${props => (props.current ? "bold;" : "")};
  padding-top: 4px;

  &:hover {
    cursor: pointer;
  }
`;

type Props = {|
  onClick: (string, number) => any,
  scales?: Array<number>,
  selectedScale: number,
  visible: boolean,
  uuid: string
|};

const ScaleSelector = ({
  onClick,
  scales = [],
  selectedScale,
  uuid
}: Props) => {
  const w = scales.length * CELL_WIDTH + 2;
  return (
    <ScaleArray style={{ width: w + "px" }}>
      {scales.map(item => (
        <Scale
          key={`scale-${item}`}
          current={selectedScale === item}
          onClick={() => onClick(uuid, item)}
        >
          {item}
        </Scale>
      ))}
    </ScaleArray>
  );
};

// $FlowFixMe
const ScaleSelectorHOC = branch(
  (props: Props): boolean => !props.visible,
  renderNothing
)(ScaleSelector);

export { ScaleSelectorHOC };
