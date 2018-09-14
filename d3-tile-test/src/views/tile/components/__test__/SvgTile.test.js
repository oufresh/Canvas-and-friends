//@flow
import React from 'react';
import { shallow } from 'enzyme';
import SvgTile from '../SvgTile';

describe('SvgTile Component', () => {

    it('renders without a crash with preloaded svg content', () => {
        const component = shallow(<SvgTile key="test" x={0} y={0} z={0} svgContent={'<rect stroke="#000" id="svgtest" height="254" width="254" y="1" x="1" stroke-width="1.5" fill="rgba(0,0,0,0)"></rect>'}/>);
        expect(component).toMatchSnapshot();
    });

});