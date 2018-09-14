//@flow
import React from 'react';
import styled from 'styled-components';

const StSchemaInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 5px;
    width: 100%;
`;

const StSchemaInfo = ({children}:{children: React.Component}) => {
    return (
        <StSchemaInfoContainer>{children}</StSchemaInfoContainer>
    );
}

export default StSchemaInfo;
