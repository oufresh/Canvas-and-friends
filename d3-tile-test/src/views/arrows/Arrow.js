//@flow
import React from "react";
import styled from "styled-components";

export const ArrowUp = ({
  top,
  left,
  onClick
}: {
  top: number,
  left: number,
  onClick: () => void
}) => {
  const Icon = styled.svg`
  fill: #fff;
  fill-opacity: 0.45;
  width: 32px;
  height: 32px;
  &:hover {
    fill-opacity: 1;
  }
`;  
  const style = {
    position: "absolute",
    cursor: "pointer",
    top: top,
    left: left / 2
  };    
  return (
    <Icon style={style} onClick={onClick}>
      <path d="M22.086 20.914l2.829-2.829-8.914-8.914-8.914 8.914 2.828 2.828 6.086-6.086z" />
    </Icon>
  );
};

export const ArrowRight = ({
  top,
  left,
  onClick
}: {
  top: number,
  left: number,
  onClick: () => void
}) => {
  const Icon = styled.svg`
  fill: #fff;
  fill-opacity: 0.45;
  width: 32px;
  height: 32px;
  &:hover {
    fill-opacity: 1;
  }
`;  
  const style = {
    position: "absolute",
    cursor: "pointer",
    top: top / 2,
    left: left - 32
  };
  return (
    <Icon style={style} onClick={onClick}>
      <path d="M11.086 22.086l2.829 2.829 8.914-8.914-8.914-8.914-2.828 2.828 6.086 6.086z"/>
    </Icon>
  );
};

export const ArrowBottom = ({
  top,
  left,
  onClick
}: {
  top: number,
  left: number,
  onClick: () => void
}) => {
  const Icon = styled.svg`
  fill: #fff;
  fill-opacity: 0.45;
  width: 32px;
  height: 32px;
  &:hover {
    fill-opacity: 1;
  }
`;  
  const style = {
    position: "absolute",
    cursor: "pointer",
    top: top - 32,
    left: left / 2
  };
  return (
    <Icon style={style} onClick={onClick}>
      <path d="M9.914 11.086l-2.829 2.829 8.914 8.914 8.914-8.914-2.828-2.828-6.086 6.086z"/>
    </Icon>
  );
};

export const ArrowLeft = ({
  top,
  left,
  onClick
}: {
  top: number,
  left: number,
  onClick: () => void
}) => {
  const Icon = styled.svg`
  fill: #fff;
  fill-opacity: 0.45;
  width: 32px;
  height: 32px;
  &:hover {
    fill-opacity: 1;
  }
`;  
  const style = {
    position: "absolute",
    cursor: "pointer",
    top: top / 2,
    left: left
  };
  return (
    <Icon style={style} onClick={onClick}>
      <path d="M20.914 9.914l-2.829-2.829-8.914 8.914 8.914 8.914 2.828-2.828-6.086-6.086z"/>
    </Icon>
  );
};
