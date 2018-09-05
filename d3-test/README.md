# D3 Tests

D3 tets

## Trasformazione d3-zoom

Con d3-zoom si possono fare trasformazioni del canvas svg. Si applica la matrice di trasformazione 2D al canvas o gruppo svg (vale anceh per canvas HTML5):

k 0 tx<br/>
0 k ty<br/>
0 0 1

In questo modo viene fatta la trasformazione di coordinate di ciascun vertice. Gli oggetti sono scalati del fattore k e traslati di (tx, ty).

Nello specifico utilizzando l'attributo **transform** applicato al gruppo **g**, assimilabile ad un layer che contiene poi il codice svg, si ottiene la trasformazione. Ad esempio:

```html
<svg>
    <g id="layer" transform="translate(-175,-75) scale(0.5)">
        <!-- All rendering instructions -->
    </g>
</svg>
```

### Inizializzazione

Utlizzando d3-zoom si inizializza l'uso di zoom e translate con il codice:

```javascript
const svg = d3.select(svgElem);
const layer = svg.append('g');
const zoom = d3.zoom()
  .on("zoom", () => {
    layer.attr("transform", d3.event.transform);
});

```

Questo abilita l'interazione di default con il mouse (rotella per zoom, mouse down - pan - mouse up per traslare).

### Scalamenti e traslazioni programmatiche

Per effetture una traslazione, uno scalamento o entrambi in modo programmatico, ad esempio una centratura, si deve applicare la matrice di traformazione noti i parametri che la compongono: le traslazioni tx e ty e il fattore di scala k.
In generale dobbiamo tenere conto che una trasformazione di questo genere può essere composta da diversi passi; in questo caso 3 partendo dalla matrice indentità **d3.zoomIdentity**.

1. Traslazione in coordinate della viewport dell'origine dell nostro oggetto/mappa/schema disegnato nel layer.
2. Applicazione dello scalamento a tutti gli oggetti del layer.
3. Traslazione degli oggetti nel layer in coordinate relative al layer stesso, ovvero quelle originali del nostro schema o modello fisico di partenza.

Ad esempio se volessi spostare il centro dello schema in una specifica posizione della viewport dovrei costruire la matrice in questo modo:

```javascript

const viewportPosition = [50, 50];
const schemaSize = [500, 500];

svg.call(zoom.transform, d3.zoomIdentity
    .translate(viewportPosition[0], viewportPosition[1])
    .scale(currentK)
    .translate(-schemaSize[0]/2, -schemaSize[1]/2)
 );
```

Se non avessi necessità di spostare il punto di origine dello schema, prima indicato da **viewportPosition** posso anche lasciare zeri nella trasformazione.

### Calcolo coordinate schema

Risulta utile conoscere le coordinate dello schema date quelle della viewport (ad esempio per interazioni mouse). Per fare questo si deve applicare una trasformazione inversa conoscendo le coordinate del mouse nel canvas svg.

Un modo è memorizzare **d3.event.transform** ad ogni chiamata di **.on("zoom", () => { ... ** in una variabile o stato ed utilizzarlo quindi per il calcolo.
Questo perché **d3.event** conterrà via via solo le informazioni relative all'evento avvenuto in quel momento.

```javascript
var d3Transform = ...;

function calcCoords(mx, my)
{
  if (d3Transform) {
    let cx = (mx - d3Transform.x) / d3Transform.k;
    let cy = (my - d3Transform.y) / d3Transform.k;
    return [cx, cy];
  }

  return [mx, my];
}
```



