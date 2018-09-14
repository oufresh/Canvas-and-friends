//@flow
import React from 'react';
import styled from 'styled-components';

const SvgDiv = styled.div`
    position: absolute;
    top: ${props => (props.top ? props.top : 0) + 'px'};
    left: ${props => (props.left ? props.left: 0) + 'px' };
    overflow: hidden;
    pointer-events: all;
    width: ${props => props.width + 'px'};
    height: ${props => props.height + 'px'};
    background-color: ${props => props.backgroundColor ? props.backgroundColor: 'rgba(0,0,0,1)'};
`;

export { SvgDiv };