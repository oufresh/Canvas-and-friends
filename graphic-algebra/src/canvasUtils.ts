
export type CPos = {
    x: number
    y: number
};

export function getCanvasPos(canvas?: HTMLCanvasElement): CPos {
    let x = 0;
    let y = 0;
    if (canvas) {
        x = canvas.offsetLeft;
        y = canvas.offsetTop;
    }

    return {
        x, y
    };
};

export function getMousePos(canvasPos: CPos, e: MouseEvent): CPos {
    var mouseX = e.clientX - canvasPos.x + window.pageXOffset;
    var mouseY = e.clientY - canvasPos.y + window.pageYOffset;
    return {
        x : mouseX,
        y : mouseY
    };
};

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