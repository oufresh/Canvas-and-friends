import { calcDistance } from './collisionCals';

export function pointInCircle(px: number, py: number, cx: number, cy: number, r: number): boolean {
    const distance = calcDistance(cx, cy, px, py);
    if (distance <= r) {
        return true;
    }
    return false;
}
