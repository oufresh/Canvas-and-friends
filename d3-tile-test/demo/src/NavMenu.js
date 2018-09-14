import React from 'react';
import MenuList from './MenuList';
import styled from 'styled-components';

const NavContainer = styled.div`
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0px;
    background-color: white;
    color: black;
    transition: transform 500ms ease-in-out;
    z-index: 2000;
`;

const NavMenu = ({show}:{show: boolean}) => {
    const transform = show === true ? 'translateX(0%)' : 'translateX(-100%)';
    return(
        <NavContainer style={{transform: transform}}>
            <MenuList />
        </NavContainer>
    ); 
};

export default NavMenu;
