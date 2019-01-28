# D3 Tests

Sample drawing svg with React and d3 for zoom and translate.

## d3-zoom trasform

2D trasform matrix is applied to a svg \<g\> tag

k 0 tx
0 k ty
0 0 1

The matrix is applied to every tag/geometry inside the group.

```html
<svg>
    <g id="layer" transform="translate(-175,-75) scale(0.5)">
        <!-- All rendering instructions -->
    </g>
</svg>
```


### d3-zoom initialization

This is a basic initialization of d3-zoom. The trasform is directly applied to a **g**

```javascript
const svg = d3.select(svgTag);
const layer = svg.append('g');
const zoom = d3.zoom()
  .on("zoom", () => {
    layer.attr("transform", d3.event.transform);
});

```

This also enables the default uer interaction: wheel for zoom, pan wiht mouse move.


### Scale and translate

A generic trasform  start from **d3.zoomIdentity**. There are three steps:

1. Translate in the viewport coordinates to move the origin where we need
2. Scale the object
3. Translate the scaled object to have the interested point in choosen position of the viewport 

```javascript

const viewportPosition = [50, 50];
const objectSize = [500, 500];

svg.call(zoom.transform, d3.zoomIdentity
    .translate(viewportPosition[0], viewportPosition[1])
    .scale(currentK)
    .translate(-objectSize[0]/2, -objectSize[1]/2)
 );
```

**Note** the above function doesn't care ab out the boundaries! It's a procedure useful for the initialization. You may use d3-zoom **zoom.translateBy(selection, x, y)**, **zoom.translateTo(selection, x, y)**, **zoom.scaleBy(selection, k)** and **zoom.scaleTo(selection, k)** which ensure that you can't go outside the object is you set the extent constraint.


### Object coordinates

To calcultate object coordinates we can use the trasform in d3.event. Wa can store it every time a zoom event appens in a var.
Then we can calculate the original x and y applying the formula in the example below.


```javascript

var d3Trasform = ...;


zoom.on("zoom", () => {
  d3Trasform = d3.event.trasform;
});

function calcCoords(mx, my)
{
  if (d3Transform) {
    let cx = (mx - d3Trasform.x) / d3Trasform.k;
    let cy = (my - d3Trasform.y) / d3Trasform.k;
    return [cx, cy];
  }

  return [mx, my];
}
```



