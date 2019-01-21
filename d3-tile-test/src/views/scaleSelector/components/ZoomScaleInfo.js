//@flow
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  font-family: Helvetica Neue, Helvetica, Arial, Liberation Sans, sans-serif;
  height: 35px;
  display: block;
  margin: 1px;
`;

const LineContainer = styled.div`
  width: 160px;
  height: 35px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
  user-select: none;
`;
const ZoomLabel = styled.div`
  color: rgba(250, 250, 250, 0.6);
  font-size: smaller;
  width: 50px;
`;

const MainLine = styled.div`
  width: 95px;
  height: 1px;
  background-color: rgba(250, 250, 250, 0.6);
`;

const ExtremeLine = styled.div`
  width: 2px;
  height: 6px;
  background-color: rgba(250, 250, 250, 0.6);
`;

const TargetLine = styled.div`
  width: 2px;
  height: 5px;
  background-color: rgba(250, 250, 250, 0.6);
  position: absolute;
  left: ${props => props.left + 40}px;
`;

const TargetText = styled.label`
  color: rgba(250, 250, 250, 0.6);
  position: absolute;
  left: ${props => props.left + 32}px;
  bottom: 22px;
  font-size: smaller;
`;

type Props = {|
  scaleCurrentDecimal: number,
  scaleMin: number,
  scalesSize: number
|};

const ZoomScaleInfo = ({
  scaleCurrentDecimal,
  scaleMin,
  scalesSize
}: Props) => {
  const lineWidth = 97;
  const x1 = 10;
  const x = x1 + (lineWidth / scalesSize) * (scaleCurrentDecimal - scaleMin);
  return (
    <Container>
      <LineContainer id="zoom-line-container">
        <ZoomLabel id="zoom-text-label">ZOOM </ZoomLabel>
        <ExtremeLine id="zoom-first-extreme-line" />
        <MainLine id="zoom-main-line" />
        <ExtremeLine id="zoom-second-extreme-line" />
        <TargetLine id="zoom-target-line" left={x} />
        <TargetText left={x}> {scaleCurrentDecimal.toFixed(1)} </TargetText>
      </LineContainer>
    </Container>
  );
};

export { ZoomScaleInfo };
