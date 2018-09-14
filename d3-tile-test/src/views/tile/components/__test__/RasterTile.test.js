//@flow
import React from 'react';
import { shallow } from 'enzyme';
import RasterTile from '../RasterTile';

describe('RasterTile Component', () => {

    it('renders without a crash with preloaded svg content', () => {
        const component = shallow(<RasterTile key="test" x={0} y={0} z={0} url={"testurl"}/>);
        expect(component).toMatchSnapshot();
    });

});