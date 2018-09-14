import React from 'react';
import { Link } from 'react-router-dom';

const MenuList = () => {
    return (
    <ul style={{listStyle: 'none'}}>
        <li><Link to='/' replace>Home</Link></li>
        <li><Link to='/georasterrender' replace>Geographic map with react and redux</Link></li>
        <li><Link to='/svgrender' replace>Svg tiles with react and redux</Link></li>
        <li><Link to='/mapsContainer' replace>Svg maps container list-popup</Link></li>
        <li><Link to='/geomapsraster' replace>Geo raster maps container list-popup</Link></li>
        <li><Link to='/tabsMapContainer' replace>Tabs Maps container</Link></li>
        <li><Link to='/stschemarender' replace>Rendering st schema</Link></li>
        <li><Link to='/multistschemarender' replace>Rendering multiplo st schema</Link></li>
        <li><Link to='/singleschemarender' replace>Rendering signle tile st schema</Link></li>
    </ul>);
};

export default MenuList;
