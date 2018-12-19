import * as React from 'react';
import { Point, ExpPoint } from '../../shapes/point';
import * as Shape2Draw from '../shape2Draw';
import { withContext } from '../Canvas';

interface PointProps {
    point?: Point;
    hit: boolean;
    context?: any;
}

export class PPoint extends React.PureComponent<PointProps, any, any> {
    componentDidUpdate() {
        const ctx = this.props.context.ctx;
        if (this.props.point) {
            Shape2Draw.drawPoint(ctx, this.props.point, this.props.hit);
        }
    }
    render() {
        return (
            null
        );
    }
}

export const PCPoint = withContext<any>(PPoint);