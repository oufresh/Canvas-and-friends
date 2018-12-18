export function calcDistance(x1: number, y1: number, x2: number, y2: number) {
    const distX = x2 - x1;
    const distY = y2 - y1;
    return Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
}