import { calcDistance } from './collisionCals';

export function pointInLine(x1: number, y1: number, x2: number, y2: number, px: number, py: number): boolean {
    const d1 = calcDistance(px, py, x1, y1);
    const d2 = calcDistance(px, py, x2, y2);
    const lineLen = calcDistance(x1, y1, x2, y2);

    const tolerance = 0.1; // higher # = less accurate

    // if the two distances are equal to the line's
    // length, the point is on the line!
    // note we use the buffer here to give a range,
    // rather than one #
    if (d1 + d2 >= lineLen - tolerance && d1 + d2 <= lineLen + tolerance) {
        return true;
      }
      return false;
}