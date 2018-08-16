import './app.css';
import * as _ from 'lodash';

console.log('Hello canvas base!!!');

/*
function test() {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#92B901";
    ctx.fillRect(50, 50, 100, 100);
}*/

var scale = -1;
var baseWidth = -1;
var baseHeight = -1;

function calcScale(width, height) {
    var wScale = width/baseWidth;
    var hScale = height/baseHeight;

    return wScale > hScale ? wScale : hScale;
}

function testPath2D() {

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    context.scale(scale, scale);
     // A square
     var path1 = new Path2D();
     path1.rect(105,105,90,90);

     // A rounded rectangle
     var path2 = new Path2D();
     path2.arc(50,50,45,Math.PI / 2,Math.PI * 1.5,false);
     path2.lineTo(200,5);
     path2.arc(200,50,45,Math.PI * 1.5,Math.PI / 2,false);
     path2.closePath();
 
     context.strokeStyle = 'black';
     context.fillStyle   = 'red';

     context.stroke(path1);
     context.stroke(path2);

     context.fill(path1);
     context.fill(path2);
     
    
     
     // Add hit testing for the shapes tht have been drawn
     /*canvas.onmousemove = function (e)
     {
         var context = e.target.getContext('2d');
         var coordX  = e.offsetX;
         var coordY  = e.offsetY;
         
         // Test the square for clicks
         if (context.isPointInPath(path1, coordX, coordY)) {
             e.target.style.cursor = 'pointer';
             return;
         }
         
         // Test the rounded rectangle for clicks
         if (context.isPointInPath(path2, coordX, coordY)) {
             e.target.style.cursor = 'pointer';
             return;
         }
         
         // Reset the pointer to the default
         e.target.style.cursor = 'default';
     }*/
}
/*
var can = document.getElementsByTagName("canvas")[0];
can.style.width = "300px";
can.style.height = "300px";

can.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    var message = 'x: ' + mousePos.x + ', y:' + mousePos.y;
    writeMessage(canvas, message);
}, false);

function writeMessage(canvas, message) {
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '8pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, 10, 25);
  }
  
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    var wf = can.style.width.replace("px","") / can.width;
    var hf = can.style.height.replace("px","") / can.height;
    return {
      x:  Math.round((evt.clientX - rect.left) / wf) ,
      y: Math.round((evt.clientY - rect.top) / hf) 
    };
  }
*/

function resize() {
    var root = document.getElementById("root");
    var canvas = document.getElementById("canvas");
    var rect = root.getBoundingClientRect();
    scale = calcScale(rect.width, rect.height);
    canvas.width = rect.width;
    canvas.height = rect.height;

    testPath2D();
}

function run() {
    console.log('debounce resized!');
    resize();
}

function init() {
    var root = document.getElementById("root");
    var canvas = document.getElementById("canvas");
    var rect = root.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    scale = 1;
    baseWidth = rect.width;
    baseHeight = rect.height;

    window.onresize = _.debounce(run, 100);

    testPath2D(canvas);
}

init();  