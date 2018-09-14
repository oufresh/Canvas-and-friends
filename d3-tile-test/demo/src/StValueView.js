//@flow
import React from 'react';
import styled from 'styled-components';

const StValueCont = styled.div`
    height: 32px;
    display: flex;
    flex-direction: row;
`;

const ScaleInputLabel = styled.label`
    border: none;
    margin-right: 5px;
`;

const ScaleInputValue = styled.label`
    border: none;
    flex-grow: 1;
    margin-left: 5px;
`;

const StValueView = ({label, value}:{label: string, value: any}) => {
    return (
        <StValueCont>
            <ScaleInputLabel>{label}</ScaleInputLabel>
            <ScaleInputValue>{value}</ScaleInputValue>
        </StValueCont>
    );
}

export default StValueView;