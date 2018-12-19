export function getMousePos(canvas: HTMLCanvasElement | null, e: React.MouseEvent<HTMLCanvasElement>): Array<number> {
    if (canvas) {
        const rect = canvas.getBoundingClientRect(); 
        const mouseX = e.clientX - rect.left + window.pageXOffset;
        const mouseY = e.clientY - rect.top + window.pageYOffset;
        return [Math.round(mouseX), Math.round(mouseY)];
    } else {
        return [0, 0];
    }
}

/*
BitmapData.prototype.touchPos = function(e) {
    if (e.touches !== undefined && e.touches.length == 1) {
        var touch = e.touches[0];
        var touchX = touch.pageX - this.getCanvasPos().left + window.pageXOffset;
        var touchY = touch.pageY - this.getCanvasPos().top + window.pageYOffset;
    }
    return {
        x : touchX,
        y : touchY
    }
};
*/