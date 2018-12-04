import { Point } from '../point';
import { Polygon } from '../shapes/polygon';
import { Line } from '../line';

export function drawPoint(ctx: CanvasRenderingContext2D, p: Point): void {
    if (ctx) {
        const oldStyle = ctx.strokeStyle;
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(p.x - 3, p.y);
        ctx.lineTo(p.x + 3, p.y);
        ctx.moveTo(p.x, p.y - 3);
        ctx.lineTo(p.x, p.y + 3);
        ctx.stroke();
        ctx.strokeStyle = oldStyle;
    }
}

export function drawCircle(ctx: CanvasRenderingContext2D, c: Point, r: number, fill?: boolean): void {
    if (ctx) {
        const oldStyle = ctx.strokeStyle;
        const oldFillStyle = ctx.fillStyle;
        ctx.strokeStyle = 'rgba(0,0,255,1)';
        ctx.fillStyle = 'rgba(0,0,255,0.5)';
        ctx.beginPath();
        ctx.arc(c.x, c.y, r, 0, 2 * Math.PI, false);
        ctx.stroke();
        if (fill === true) {
            ctx.fill();
        }
        ctx.strokeStyle = oldStyle;
        ctx.fillStyle = oldFillStyle;
    }
}

export function drawPolygon(ctx: CanvasRenderingContext2D, pol: Polygon, fillDense ?: boolean): void {
    // fare unca calc style partendo dallo stato del polygon se ha over o
    // altri effetti
    const oldStrokeStyle = ctx.strokeStyle;
    const oldFillStyle = ctx.fillStyle;
    ctx.fillStyle = fillDense ? 'rgba(200,0,200,1)' : 'rgba(200,0,200,0.3)';
    ctx.strokeStyle = 'rgba(100,0,100,1)';
    ctx.beginPath();
    pol.vertices.forEach((p: Array<number>, index: number) => {
        if (index === 0) {
            ctx.moveTo(p[0], p[1]);
        } else if (index === pol.vertices.length - 1) {
            ctx.lineTo(p[0], p[1]);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else {
            ctx.lineTo(p[0], p[1]);
        }
    });
    ctx.fillStyle = oldFillStyle;
    ctx.strokeStyle = oldStrokeStyle;
}

export function drawLine(ctx: CanvasRenderingContext2D, line: Line): void {
    if (ctx) {
        const oldStrokeStyle = ctx.strokeStyle;
        ctx.beginPath();
        ctx.moveTo(line.vertex[0].x, line.vertex[0].y);
        ctx.lineTo(line.vertex[1].x, line.vertex[1].y);
        ctx.stroke();
        ctx.strokeStyle = oldStrokeStyle;
    }
}