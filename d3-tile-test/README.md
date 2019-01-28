# d3-maps

Libreria per il rendering di geometrie con tile attraverso svg e raster. In questo documento le formule matematiche sono scritte con Katex (un subset di latex). Con Visual Studio Code è possibile installare una extension [1] per avaere l'anterprima; le formule vanno racchiuse in appositi tag $\` ... \`$ per GitLab e impostare il parametro di configurazione "mdmath.delimiters": "gitlab" per essere coerenti con GitLab.



## Aspetti generali
d3-maps è una libreria basata su React per il rendering degli schemi di ST. Supporta i seguenti formati per la visualizzazione degli schemi:

Tiles svg indicizzate con lo standard Slippy Map.
Tiles svg indicizzate con fattore di scala logaritmico, quello usato da ST.
Tiles raster di tipi Slippy Map.

La libreria esporta:

componenti React per il rendering puro delle tiles/svg
modulo Redux maps per la gestione dello stato dello schema con reducers e selettori per eseguire il calcoli specifici per zoom e pan dello schema
modulo layoutMaps per la gestione base di liste/popup/tabs di schemi contemporanei (non ha la parte di view dei tab)


## Requisiti e dipendenze
d3-maps si appoggia ad alcune librerie esterne in particolare:

d3, d3-geo, d3-selection, d3-tile, d3-zoom per i calcoli, gestione eventi dello schema/mappa e tile
React/Redux per il rendering e gestione dello stato (le tiles sono renderizzate con React e non con d3)
immutability-helper per la modifica dello stato

Utilizza inoltre librerie specifiche per ST

@stweb-lib/redux-helper per i reducer


## Demo
Il progetto prevede una cartella demo in cui vi è un'app di prova. Per il corretto funzionamento della demo è necessario avere un server che fornisca le tiles. Nella demo l'url del server viene specificata al middleware di caricamento delle tiles attraverso la proprietà baseTileServiceurl e la funzione tileUrlBuilder.
E' necessario inizializzare lo store con reducers e selectors, il middleware citato sopra, e infine un container connesso allo store stesso.
In questa libreria non è stato previsto di esportare un container per dare delle componenti più riutilizzabili; è sensato che esso possa essere nello strato superiore (ad esempio in st-maps).
Le condizioni iniziali sulla scala massima, minima e corrente sono calcolate con le funzioni di base messe a disposizione dalla libreria e i valori ottenuti dipendono dal tipo di scala utilizzato (logaritmica o no).

## Interazioni con la mappa/schema
Le interazioni di default sono quelle di pan e zoom attraverso il mouse. Sono inoltre previste delle azioni e relative funzioni per spostare o zoomare la mappa programmaticamente, catturare il click o il doppio click sullo schema con gli elementi svg trovati (su cui applicare eventuali logiche).

## API
La libreria esporta

- Componenti grafici React
- reducers
- selectors
- middleware
- funzioni di utility per i calcoli relativi all'interazione, zoom e movimento dello schema

## Componenti per il rendering di schemi tiled svg.

### PlainTileRender

Per il rendering di schemi con tile in formato svg il componente grafico esportato è **PlainTileRender**, un esempio del suo utilizzo si trova nella demo in **ExpScaleMapRender.js**.
Questo componente ha diverse proprietà:

```js
export type TileRenderPropsType = {
  uuid: string,
  width: number,
  height: number,
  top?: number,
  left?: number,
  viewportObjectPosition: ViewportObjectPosition, //posizionamento
  renderModality: RenderModality,
  scales: Scales,
  objectSize: MapSize,
  translateExtent?: ?Array<Array<number>>, //per ora sappiamo che dovremo affrontarlo
  onZoomed: ZoomMap => any,
  tiles: Tiles,
  onMouseMove?: (Array<number>) => any,
  onDoubleClickFilter?: (Array<HTMLElement>) => boolean,
  onMouseDownFilter?: (Array<HTMLElement>) => boolean,
  onClickFilter?: (Array<HTMLElement>) => boolean,
  referenceSystemScales: ReferenceSystemScales,
  schemaBoundary: SchemaBoundary,
  debugGrid?: boolean,
  tileCache: MapTileCache
};
```

Diverse proprietà sono dei tipi complessi a loro volta definiti nella libreria.
Alcune di queste proprietà non devono essere definite nel container ma sono informazioni che vengono derivate dai selettori dallo stato base alle azioni compiute; pertanto il container si deve preoccupare solo di passarle al componente dopo aver invocato i selettori. Di seguito vediamo le proprietà elencate.


#### onZoomed

Callback che invoca l'action **zoomMap**, serve per scrivere nello store il nuovo stato di posizionamento della mappa a seguito di azioni di movimento programmatiche o interazioni dell'utente con lo schema con il mouse. I parametri sono valori calcolati da d3 e reperibili nell'evento **d3-event** a cui è agganciata la callback. 

**Non è necessario interagire con essa, nè bisogna mai invocare zoomMap esplicitamente!!!!!**

Serve per riportare i valori di d3 nello store; per effettuare degli spostamenti programmatici l'azione da utilizzare è **moveMap**.

Dettaglio:

```js
export interface ZoomMap {
  currentExpScale: number;
  uuid: string;
  x: number;
  y: number;
}

onZoomed: ZoomMap => any
```

#### tiles

Contiene le informazioni legate alle tiles che devono essere renderizzate in base alla posizione che si vuole vedere sulla mappa, allo zoom e alla dimensione della viewport. Vi sono gli indici delle tiles da caricare, il livello di scala ricalcolato in base all'indice delle tile z attuale e la traslazione sempre ricalcolato in base alle tiles attuali. Questo concetto viene spiegato in dettaglio nella sezione sul funzionamento della libreria; per ora pensiamo che si tratta di uno spostamento e di un cambio zoom "piccolo" che non richiede nuove tile, ma basta spostare o zoomare quelle presenti.

**Non deve essere definita ma presa dal selettore obbligatoriamente!!**

```js

tiles: Tiles

export type ParamTiles = {
  x: number,
  y: number,
  z: number,
  tx: number,
  ty: number
};

export type Tiles = Array<ParamTiles> & {
  scale: number,
  translate: Array<number>,
  z: number
};

```

#### referenceSystemScales

Sono i valori del "sistema di riferimento" della scala dell'oggetto che andiamo a renderizzare con le tiles. 

**Non deve essere scritta esplicitamente ma ricavata dal selettore**

```js
export interface ReferenceSystemScales {
  currentScale: number;
  defaultScale: ?number;
  currentScaleInt: number;
  maxScale: number;
  minScale: number;
}
```


#### schemaBoundary

Serve per capire se lo schema può ancora muoversi verticalmente o orizzontalmente: contiene le distanze tra la fine dello schema e i bordi della viewport. Per ora non è utilizzato per bloccare il pan fuori dallo schema; è da capire come usare le funzioni di d3 direttamente come nel caso di rendergin di svg senza tiles.

**Non deve essere scritta esplicitamente ma ricavata dal selettore**

```js
export type SchemaBoundary = {|
  top: number,
  left: number,
  right: number,
  bottom: number
|};
```

#### tileCache

Cache delle tile per singolo schema e va passata al componente. E' descritta in dettaglio nella sezione del middleware.

**Non deve essere scritta esplicitamente ma ricavata dal selettore**

```js
export interface TileValue {
  tile: string;
  timestamp: number;
}

export interface MapTileCache {
  tileCacheMap: Map<string, TileValue>;
  tileCacheUpdateTime: number;
}
```

#### viewportObjectPosition

E' l''oggetto che descrive il posizionamento dello schema a seguito di una action esplicita di movimento, ovvero una dispacth di **moveMap**. I valori che lo compongono sono derivati dallo store dal relativo selettore. Questi sono la scala a cui si deve portare, il posizionamento della viewport rispetto all'oggetto originale, e lo spostamento eventuale dell'oggetto all'interno della viewport alla scala voluta. objectPosition per ora è riportato per comodità ma infuturo potrà essere tolto incorporando i calcoli internamento.

**Anche questa properties non deve essere scritta esplicitamente ma solo ricavata dal selettore che fa i calcoli, si usa la moveMap per comandare**


```js
/**
 * Posizione dell'oggetto nella viewport con la relativa scala.
 * Per ora abbiamo sia la scaledObjectTranslation sia objectPosition
 * in futuro da usare solo objectPosition e portare i calcoli dentro
 */
export type ViewportObjectPosition = {|
  scaledObjectTranslation: Array<number>, //traslazione dell'oggetto scalato di objExpScale nella vieport
  viewport: Array<number>, //traslazione dell'origine della viewport
  objectExpScale: number, //scala esponenziale dell'oggetto
  objectPosition: Array<number> //posizione dell'oggetto equivalente alla traslazione
|};
```

Non sono immediati da capire i valori sopra e verranno ripresi nella sezione del funzionamento. Per ora pensiamo che per muovere l'oggetto possiamo pensare di mettere un punto della viewport, definito da viewport, sopra un punto dello schema, definito da scaledObjectTranslation, allo scala a cui vogliamo "vedere" lo schema.

Meglio si potrebbe dire che si applicano tre passi come nelle trasformazioni grafiche:

1. Sposto nell'origine
2. Scalo
3. Traslo della quantità scalata


#### renderModality

E' il tipo di scala e oggetti che andiamo a renderizzare, nel nostro caso sarà EXP_RENDER_MODALITY che indica un oggetto piano in scala logaritmica. Come vedramo è un parametro della initMap.
Può valere anche LINEAR_RENDER_MODALITY se la scala dell'oggetto di partenza è lineare e non logaritmica.

**Non deve essere scritta esplicitamente ma ricavata dal selettore**

#### scales

Sono le scale dell'oggetto definite con la initMap più quella corrente.
**Non deve essere scritta esplicitamente ma ricavata dal selettore**

```js
/**
 * Informazioni sulla scala dell'oggetto
 */
export type Scales = {|
  currentExpScale: ?number,
  defaultExpScale: number,
  initExpScale: number,
  maxExpScale: number,
  minExpScale: number
|};
```


#### objectSize

Sono le dimensioni dell'oggetto.
**Non deve essere scritta esplicitamente ma ricavata dal selettore**

export type MapSize = {|
  width: number,
  height: number
|};

#### width, height

Sono le dimensioni della viewport, vengono inizializzate con la initMap. Queste possono cambiare se c'è un resize, in questo caso occorre fare la dispatch della action resizeMap con le nuove dimensioni.

**Non deve essere scritta esplicitamente ma ricavata dal selettore**

```js
export type ViewPort = {|
  viewPortWidth: number,
  viewPortHeight: number
|};
```


#### uuid
Identifica univocamente lo schema, lo stesso da usare nella initMap, è di tipo string.


#### top?, left?

Servono per il posizionamento della viewport. Sono da lasciare a 0 o omettere se non in casi estremamente rari!


#### onMouseMove

Callbakck di movimento del mouse, riporta le coordinate sullo schema

```js
onMouseMove?: (Array<number>) => any
```


#### onDoubleClickFilter?: (Array<HTMLElement>) => boolean

Callback per intercettare il doppio click del mouse sullo schema. Il parametro contiene un array che è il **path** degli elementi svg su cui è propagato l'evento partendo quello più incapsulato e via via tutti i parenti non oltre il tag svg. I successivi sono filtrati perché non di interesse ai fini dell'interazione con lo schema.
**La funzione ritorna un booleano** questo serve per impedire che venga eseguita l'azione di dafault di d3 ad esempio zoom o pan e ed eseguire un'azione specifica per l'utilizzatore.

Valori di ritorno:

**true** => viene eseguita l'azione di d3
**false** => viene bloccata l'azione di d3.

Il funzionamento prevede ad esempio che si cerchi un eventuale elemento nell'array **path** e a seguito del risultato eseguire un'azione specifica e tornare false o tornare true e lasciare a d3.

```js
onDoubleClickFilter?: (Array<HTMLElement>) => boolean
```


#### onClickFilter?: (Array<HTMLElement>) => boolean,

Esattamente come onDoubleClickFilter ma per il click singolo.

```js
onClickFilter?: (Array<HTMLElement>) => boolean
```

#### onMouseDownFilter?: (Array<HTMLElement>) => boolean

Come sopra ma per il mousedown. Attenzione che questa se torna false inibisce il pan!

```js
onMouseDownFilter?: (Array<HTMLElement>) => boolean
```

## Actions modulo maps

### initMap

E' la prima action da utilizzare per inizializzare il modulo al rendering di uno schema. Contiene tutti i dati iniziali per il successivo funzionamento del rendering con le tile. Dimensione della viewport, dimensione dello schema, scale di default, scala iniziale, posizionamento iniziale, renderModality, url base per le tiles, intervallo di scadenza delle tiles.

I parametri di posizionamento iniziale e scale vanno calcolati con le funzioni:

**calObjExpScale**: funzione di calcolo della scala interna per lo store date le dimnensioni dello schema, il tipo di rendering, e la scala logaritmica o lineare voluta.

**calcObjectTranslation**: calcolail punto dell'oggetto alla scala voluta per il posizionamento iniziale; di norma si pensa che il punto di posizionamento iniziale possa stare nell'origine della viewport altrimenti anche essa va traslata

```js
const init = {
      uuid: UUID_PROVA,
      defaultExpScale,
      expScaleOffset: 2,
      height: HEIGHT,
      initExpScale,
      maxExpScale,
      minExpScale,
      renderModality: EXP_RENDER_MODALITY,
      viewPortHeight: rect.height,
      viewPortWidth: rect.width,
      width: WIDTH,
      objectExpScale: initExpScale,
      scaledObjectTranslationX: initObjectPosition[0],
      scaledObjectTranslationY: initObjectPosition[1],
      viewPortTranslationX: 0,
      viewPortTranslationY: 0,
      objectPosition: [WIDTH / 2, HEIGHT / 2],
      baseTileServiceurl: baseUrl,
      tileExpiration: 60000
};
    
initMap(init);

```

### moveMap

E' la action che permette di muovere o zoomare lo schema in modo programmatico. Accetta diversi parametri perché necessita di sapere **quale punto della viewport deve essere allineato con lo schema alla scala voluta** (questo va concetto va stampato nel cervello).

Per calcolare tali valori si devono usare le funzioni della libreria come sopra; in più le funzioni 

**calcCoordsforTiles** calcola la posizione nello schema dato un punto della vieport alla scala di default dello schema
**convertCoordsForTiles** converte la posizione calcolata sopra alla scala corrente, **vanno usate una dopo l'altra**

```js
      this.props.moveMap({
        uuid,
        objectExpScale,
        scaledObjectTranslationX: newObjectPosition[0],
        scaledObjectTranslationY: newObjectPosition[1],
        viewPortTranslationX: viewportPosition[0],
        viewPortTranslationY: viewportPosition[1],
        objectPosition: schemaPosition
      });
```
Nella demo è utilizzata ad esempio per il cambio scala mantenendo il centro della viewport sul centro dello schema!!

E' da rivedere per due motivi:

1. Si può semplificare usando internamente delle API di più alto livello di d3 per muovere solo lo schema fissando l'origine della viewport come riferimento. Questo potrebbe anche essere una action diversa che oltretutto potrebbe sfruttare il bouding di d3 per non uscire dallo schema capendo come farlo funzionare con le tiles (bounding definito da una funzione).

2. Se eseguita una volta, poi lo schema viene mosso e rieseguita con gli stessi valori non si ottiene nulla ... di fatto non cambiando i valori nello store non avviene un nuovo movimento perché internamente dove si chiama l'api di d3 è fatta una differenza con le props precedenti nella componentDidUpdate... Non è tanto un problema di PureComponent necessario per non renderizzare tile sinutilimente con tempi troppo lunghi ma prorpio che quei valori sono uguarli rispetto a prima, ci vuole qualcosa che dica che è stato fatto un movimento programmatico, un timestamp per esempio.


### zoomMap

Già citata in precedenza è la action che scatta automaticamente e che in container deve solo mappa sulla callback onZoomed, serve per scrivere i nuovi dati di posizionamento per il calcolo delle tiles nello store.

```js
export interface ZoomMap {
  currentExpScale: number;
  uuid: string;
  x: number;
  y: number;
}
```


### resizeMap

Action che fa il resize dello schema a seguito di un cambio di dimensioni della viewport, ad sempio dopo un resize. da usare sempre dopo una debounce di 500ms.

```js
export type ResizeMap = {|
  uuid: string,
  viewPortWidth: number,
  viewPortHeight: number
|};
```


### removeMap

Action che cancella il record dallo store con la cache delle tile associata.

```js
export type RemoveMap = {|
  uuid: string
|};
```

### storeTileMap

Action sparata dal middleware per memorizzare nella cache le tiles ricevuta dal server. Scatta in automatico.

```js
/**
 * Tile con relativa tripletta di indicizzazione da mettere nella cache dello store.
 * zoomIndex sarebbe la z o la scala se siamo in exp.
 */
export interface StoreTileMap {
  uuid: string;
  z: number;
  x: number;
  y: number;
  tile: string;
  timestamp: number;
}
```





## Middleware caricamento e cache delle tiles

Di base le tiles sono identificate dalla tripletta (z, x, y) come nel formato Slippy Map. **z** indica il livello di zoom, **x** e **y** gli indici orizzonatali e vericali.
In assenza di cache le tiles venivano caricate da ciascun componente **\<Tile ...\>** in modo autonomo con una fetch nel "mount" del componente Tile stesso. Non c'è quindi nessun meccanismo di cache perché ogni tile viene ricreata al variare degli indici, l'unica ottimizzazione era che il componente **\<tile \>** era derivato da **React.PureComponent**.

#### Caricamento con fetch dal server e cache

Il middleware **tileLoaderMiddleware** si occupa di popolare la cache delle tiles via via che arrivano nuove richieste. La cache è una mappa **tileCacheMap** presente nello stato:

```javascript
type state = {
  // ...
  tileCacheMap: Map<string, TileValue>;
  tileCacheUpdateTime: number;
  baseTileServiceurl: string;
  tileExpiration: number;
  //...
}

```

Ad ogni richiesta di nuove tiles da renderizzare, eseguita per mezzo della dispatch della Action **ZOOM_MAP** il middlewre la intercetta, calcola le tiles da renderizzare nella viewport attraverso la funzione **calcTiles** che fa uso di d3-tiles.
Queste vengono richieste al server e successicamente inerite nella cache dello stato per mezzo della action **STORE_TILE_AMP**. La view a questo punto renderizza subito le tiles presenti in cache mentre quando arriveranno quelle in fase di fetch dal server.

#### Conversioni di scale e indice z

Il livello di zoom delle tiles **z** e gli indici orizzontali **x** e **y** sono quelli del formato SlippyMap e calcolati da in base alle dimensioni della viewport, del livello di scala esponenziale in base 2 con l'oggetto reale desiderato e della porzione dell'oggetto che si desidera vedere. Tutti queste infomazioni sono presenti nello stato e il loro significato è spiegato in dettaglio successivamente.

Se il sistema di riferimento usato non è di tipo SlippyMap occorre fare delle conversioni. Nel caso specifico vengono fatte per passare da **z** al livello di **scala** di riferimento.
In d3-maps sono presi in considerazione tre casi: il caso in cui la scala di riferimento sia quella di Slippy Map come nel caso di tiles geografiche tradizionali raster o lineare o logaritmica.
Il caso logaritmico è di particolare interesse perché quello usato dal modulo **st-maps** per interfacciarsi con il sistema ST.

#### Fetch tiles dal server

Per effettuare la fetch delle tiles dal server nello stato è presente un campo che è **baseTileServiceurl**; con questo attraverso la funzione **tileUrlBuilder** viene costruita la url con i parametri zommIndex (z o la scala di riferimento), x e y che identificano la tile da richiedere.
E' presente un set **pendingFetchSet** indicizzato con le url delle richieste delle tiles per che contiene le fetch in stato di pending e che non devono essere rieseguite fintanto che sono in questo stato.

#### Update e pulizia della cache

La cache delle tiles non prevede al momento un meccanismo di pulizia ad esempio con un timer. Quando la mappa/schema non vorrà essere più visualizzata viene distrutto lo stato relativo a quella view e di conseguenza anche la mappa delle tiles viene cancellata.
E' presente invece un meccanisco di update delle tiles basato sui campi **timestamp** in **TileValue** e **tileExpiration** nello stato.
**timestamp** rappresenta in millisecondi il momento in cui la tile è stata ricevuta, **tileExpiration** è l'intervallo di tempo entro cui le tiles sono considerate valide.
Il middleware utilizza questi campi per decidere se una tile già in cache deve essere ricaricata o può ancora considerarsi valida.

#### Log action

E' importante se non per puro debug limitare le action che vengono loggate dal middleware redux-logger. Per fare questo occorre inizializzarlo con:

```javascript
const logger = createLogger({
  predicate: (getState, action) => {
    if (action.type.includes("STORE_TILE")) {
      return false;
    }
    return true;
  }
});
```

## Modulo layoutMaps

### Descrizione

Modulo che si occupa di gestire il layout di schemi multipli. Sfruttando questo modulo lato View, sarà possibile avere, ad esempio, uno schema di sfondo e uno schema all'interno di un popup, oppure una visualizzazione a tabs degli schemi.

### Gestione istanze multiple

#### Reducer layoutMaps

Ogni reducer del modulo layoutMaps deve essere istanziato passando come parametro un **namespace** che lo identifica univocamente.

```js
//reducers.js
import {
  layoutMaps,
  NAMESPACE_LIST,
  NAMESPACE_POPUP
} from "@stweb-lib/d3-maps";

const reducersMap: ReducersMap = {
  layoutMapsList: layoutMaps(NAMESPACE_LIST),
  layoutMapsPopup: layoutMaps(NAMESPACE_POPUP)
};

```

**NB:**
Da notare che in questo caso non viene settato il _setRoot_ dei selettori in quanto quest'ultimi sono gestiti diversamente dal solito, verrà spiegato in seguito.

Lo stato di layoutMap è descritto dal seguente type:

```js
export type LayoutMapsT = {
  namespace: string,
  mapUuids: Array<string>,
  selectedMaps: Set<string>
};

```

#### Actions layoutMaps

Tutte le actionCreator del modulo hanno come primo parametro il **namespace** in modo da poter associare la action all'istanza desiderata di reducer.

```js
//actionCreators.js
import { type Action, createAction } from "@stweb-lib/redux-helper";
import {
  INIT_LAYOUT_MAPS,
  ADD_MAP_TO_LAYOUT,
  ADD_SELECTED_MAP
} from "./actionDefinitions";

/*----- Types -----*/
export type InitLayoutMapT = {|
  namespace: string,
  uuids: Array<string>
|};
export type AddMapToLayoutT = {|
  namespace: string,
  uuid: string
|};
export type AddSelectedMapT = {|
  namespace: string,
  uuid: string
|};
export type InitSelectedMapT = {|
  namespace: string,
  uuids: Array<string>
|};

/*----- Actions ----- */
export const initLayoutMap = (
  initLayout: InitLayoutMapT
): Action<InitLayoutMapT> => {
  return createAction(INIT_LAYOUT_MAPS, initLayout);
};
export const addMapToLayout = (
  addMapLayout: AddMapToLayoutT
): Action<AddMapToLayoutT> => {
  return createAction(ADD_MAP_TO_LAYOUT, addMapLayout);
};
export const addSelectedMap = (
  addSelectedMap: AddSelectedMapT
): Action<AddSelectedMapT> => {
  return createAction(ADD_SELECTED_MAP, addSelectedMap);
};
export const initSelectedMap = (
  initSelectedMap: InitSelectedMapT
): Action<InitSelectedMapT> => {
  return createAction(INIT_SELECTED_MAP, initSelectedMap);
};
```

#### Selectors layoutMaps

Per quanto riguarda i selettori è necessario modificare l'approccio finora utilizzato per la loro creazione (descritto nello documentazione di _@stweb-lib/redux-helper_) in quanto devono essere condivisi tra istanze multiple di componenti di views.
L'obiettivo è far si che ogni istanza abbia il proprio insieme di selettori.

#### Descrizione approccio per i selettori

Di seguito è riportato il _nuovo approccio_ per selettori.

```js
//selectors.js
import { createSelector } from "reselect";
import { type State } from "@stweb-lib/redux-helper";
import { type LayoutMapsT } from "./types";

const getRootDefault = (state: State): LayoutMapsT => state;

/** metodo di utily da chiamare nel mapStateToProps per settare l'istanza corretta */
export const getRootByNameDeclaration = (rootState: string) => (
  state: (state: State) => LayoutMapsT
) => state.get(rootState);

export function selectorFactory(
  getRoot: (state: State) => LayoutMapsT = getRootDefault
) {
  const getLayoutMapsRoot = (state: State): LayoutMapsT => getRoot(state);
  const getSelectedMaps = createSelector(
    [getLayoutMapsRoot],
    (layoutMaps: (layoutMaps: LayoutMapsT) => Set<string>) =>
      layoutMaps.selectedMaps
  );
  const getLayoutMapUuids = createSelector(
    [getLayoutMapsRoot],
    (layoutMaps: (layoutMaps: LayoutMapsT) => Array<string>) =>
      layoutMaps.mapUuids
  );
  const getLayoutMapNamespace = createSelector(
    [getLayoutMapsRoot],
    (layoutMaps: (layoutMaps: LayoutMapsT) => string) => layoutMaps.namespace
  );

  return {
    getLayoutMapsRoot,
    getSelectedMaps,
    getLayoutMapUuids,
    getLayoutMapNamespace
  };
}
```

Di seguito vi è un _esempio_ di come sfruttare il **selectorFactory**.


```js
//reducers.js
import {
  layoutMaps,
  NAMESPACE_LIST,
  NAMESPACE_POPUP,
  selectorFactory,
  getRootByNameDeclaration
} from "../../../src/modules/layoutMaps";

const reducersMap: ReducersMap = {
  layoutMapsList: layoutMaps(NAMESPACE_LIST),
  layoutMapsPopup: layoutMaps(NAMESPACE_POPUP)
};

export const selectorLayoutMapsList = selectorFactory(
  getRootByNameDeclaration("layoutMapsList")
);
export const selectorLayoutMapsPopup = selectorFactory(
  getRootByNameDeclaration("layoutMapsPopup")
);
```

Il file _selectors.js_ esporta due metodi pricipali:

- **getRootByNameDeclaration** : metodo di utily per settare l'istanza corretta. Prende come parametro una stringa corrispondente alla porzione di stato di interesse (definito nell'oggetto reducersMap) e ritorna la porzione di stato relativa.

- **selectorFactory**: è una funzione che ha come parametro in ingresso lo stato. All'interno devono essere definiti i selettori (è possibile utilizzare la versione di selettori con o senza _createSelector_). Il valore di ritorno è un oggetto costituito dai selettori appena creati.

Il file _reducers.js_ esporta due istanze di selettori ciascuna relativa alla propria porzione di stato:

- **selectorLayoutMapsList**

- **selectorLayoutMapsPopup**

##### Utilizzo dei selettori nei componenti di View

I componenti di View devono sfruttare i selettori esportati dal file **reducers.js** all'interno del _mapStateToProps_.

```js
//ViewContainer.js
import {
  selectorLayoutMapsList,
  selectorLayoutMapsPopup
} from "./store/reducers";

const mapStateToProps = state => {
  return {
    selectedMapsList: selectorLayoutMapsList.getSelectedMaps(state),
    selectedMapsPopup: selectorLayoutMapsPopup.getSelectedMaps(state)
  };
};
```

## Rendering di oggetti piani e uso delle tiles

Per realizzare le funzionalità di zoom e pan nel rendering di oggetti piani stati utilizzati i moduli d3-zoom e d3-tile. Questi non presuppongono nulla sul contesto di rendering: ci permettono di effettuare i calcoli necessari per gestire zoom e pan con le trsformazioni matriciali associate e gestire le tile nelle varie scale in cui si vuole rappresentare l'oggetto. Nel caso di utilizzo di tiles d3-tiles si appoggia a d3-zoom.

## d3-zoom

E' il modulo di d3 che si occupa di gestire lo zoom e il pan del rendering context e calcolare le trasformazioni da applicare a seguito di tali eventi.

Di default il pan si effettua tenendo premuto il pulsante sinistro del mouse e muovendo nelle 4 direzioni il mouse stesso.

Lo zoom di default si effettua con la rotella del mouse (zoom-in e zoom-out) e con doppio click del tasto sinistro (zoom-in).

Per usare d3-zoom occorre appoggiarsi a d3-select per selezionare l'elemento html di disegno in mod che sia usabile dalla libreria stessa; poi si deve inizializzare d3-zoom e registrare una callback all'oggetto zoom di d3 in questo modo

```javascript
this.svg = select(this.svgRef.current); //d3-select del riferimento al canvas o svg
this.zoom = d3Zoom().scaleExtent(scaleEstent).on("zoom", zoomCallBack); //init dello zoom con una estensione massima e minima e registrazione della callback
this.svg.call(this.zoom); //applicazione dello zoom behaviour creato al contest
```

A seguoti di queste gesture d3-zoom ci fornisce i parametri della trasformazione (o matrice di trasformazione). Tralasciando per semplicità d3-tile e le scale delle tiles stesse, nel caso di rendering **svg** devono essere applicati al gruppo svg che utilizziamo come layer per la rappresenatzione:

```html
    <g transform="translate(transform.x, transform.y) scale(transform.k)">
```

Nel caso di rendering con il **canvas** si avrebbe invece:

```javascript
context.translate(transform.x, transform.y);
context.scale(transform.k, transform.k);
```

dove **context** è il contesto 2D associato al canvas che stiamo utilizzando.

**Note:** E' fonfamentale dichiarare le dimensioni dell'area di disegno sia nel caso dell'svg sia nel caso del canvas attraverso gli attributi html width ed height. E' diverso utilizzare gli attributi css: queti ultimi determinano solo uno scalamento a posteriori dell'oggetto che, qualora necessario, è meglio implementare con la proprietà scale del css. Per ridimensionare è sempre meglio usare gli attributi width ed height che determinano la dimensione in pixel del contesto di disegno.

Questo modulo ci da quindi le funzionalità di zoom e pan semplici su un contesto di disegno. A seguito di ogni gesture viene invocata la callback passata a d3-zoom e  l'evento **d3.event** contiene le informazioni calcolate da d3 sulla corrente trasformazione da applicare

- **d3.event.transform.x** contiene lo spostamento corrente sull'asse x
- **d3.event.transform.y** contiene lo spostamento corrente sull'asse y
- **d3.event.transform.k** contiene il fattore di scala corrente

Questi vanno applicati al contesto di disegno come descritto sopra per avere l'effetto di pan o zoom.

I valori di transform.x e transform.y rappresentano lo spostamento in pixel, mentre k rappresenta il fattore di scala lineare. In condizioni iniziali, senza aver fatto alcun zoom o pan avremo.

```javascript
  d3.event.transform.x = 0;
  d3.event.transform.y = 0;
  d3.event.transform.k = 1;
```

Effettuando pan e zoom questi valori varieranno:

- k < 1 gli oggetti disegnati saranno rimpiccioliti e le dimensioni finali saranno k volte più piccole
- k > 1 gli oggetti sono ingranditi
- x < 0 il disegno si sposta a sinistra
- x > 0 il disegno si sposta a destra
- y > 0 si sposta in basso
- y < 0 si sposta in alto

d3-zoom ci fornisce delle API per applicare le trasformazioni anche in modo programmatico e non solo con interazioni del mouse. A seguito della chiamatadi queste funzioni dei nuovi valori in d3.event.transform vengono calcolati e saranno da utilizzare.


### Posizionamento dell'immagine, centratura e spostamento e cenni di modellazione

Per arrivare a posizionare l'oggetto o un punto di esso nella view port bisogna innanzi tutto calcolare le coordinate nella viewport del punto di origine passando attraverso la scala e poi tenere conto delle coordinate usate nella viewport.

Per effettuare questa trasformazione si deve tener conto di diversi aspetti (non per forza tutti necessari):

1. La traslazione dell'oggetto renderizzazto nelle coordinate della viewport
2. La scala esponenziale da applicare
3. La translazione dell'oggetto scalato in coordinate reali o normalizzate nel caso tiles.

#### Matrice di modellazione

Le tasformazioni grafiche in generale sono definite da matrici di modellazione.

In uno spazio bidimensionale si utilizza una matrice 3x3 con coordinate omogee per effettuare la trasformazione tra gli spazi di partenza e di destinazione. Non è una tasformazione lineare ma affine e definendo come di seguito le matrici di trasformazione è possibile ricondursi alle formule dell'algebra lineare.

Matrice di tasformazione generica:

```math
    \begin{bmatrix} 
    k & 0 & tx \\
    0 & k & ty \\
    0 & 0 & 1
    \end{bmatrix}
```

**k** è il fattore di scala applicato poi al canvas svg, direttamente così nel caso di d3-zoom soltanto, ricalcolato sulla base delle tile con d3-tile.

**tx** e **ty** sono le taslazioni.

Questa matrice è molto usata nelle operazioni di modellazione grafica per traslare, ruotare, e scalare le forme geometriche (il caso sopra non prende in considerazione i parametri di rotazione che dipendono dall'angolo).

In generale quindi si definisce ogni trasformazione come una matrice e l'applicazione di una successione di trasformazioni si traduce in un prodotto righe per colonne di matrici.
Si ottiene la matrice finale che viene moltiplicata per ciascun vettore rappresentante il punto.

I parametri "tanslate" e "scale" degli attributi del \<g> svg o del contesto del canvas fanno proprio queste operazioni di modellazione. Mentre nel canvas è possibile utilizzare uno stack di matrici (con push e pop) per definire quale usare nel momento in cui si disegna uno shape, nell' \<svg> questo è ottenuto innestando elementi \<g> ciscuno con i propri attributi di transform.

Sia il canvas che svg applicheranno la matrice ottenuta dai prodotti di tutte quelle precedenti a ciascun vertice della shape definita.

**Nota** Un ragionamento simi le si ha nel contesto della modellazione OpenGL/Direct3D.


#### Trasformazioni con d3

Con le API di d3-zoom si parte dall'oggetto **zoomIdentity** a cui si applicano le funzioni **translate()**, **scale()** e infine **translate()** per concatenare le tre trasformazioni precedenti (prodotto righe per colonne banale).

Supponiamo di utilizzare nel nostro modello delle coordinate cartesiane (X,Y) con l'origine in alto a sinistra come nel caso del canvas svg.

La trasformazione in genereale è composta dalla sequenza:

**translate()scale(expScaleDefault)translate()**

ovvero

```javascript
    svg.call(this.zoom.transform, zoomIdentity
        .translate(vX, vY)
        .scale(k)
        .translate(DX, DY)
    );
```
- vX e vY rappresentano la traslazione dell'origine della viewport
- k rappresenta il valore di cui vogliamo scalare l'oggetto
- DX e DY rapprensentano la traslazione dell'oggetto nel suo sistema di riferimento.

Per applicare una trasformazione dobbiamo quindi pensare di identificare un punto della viewport e uno sull'oggetto che praticamente dovranno coincidere: le traslazioni saranno allora definite per la viewport dalla taslazione della sua origine per portarla dove ci interessa, da una scala e infine dal punto dell'oggetto che dovrà andare a coincidere con quello della viewport (DX e DY possono essere anche numeri negativi).

Ad esempio, supponiamo di posizionare il centro dell'oggetto nel centro della viewport, diversamente dal default in alto a destra.

```javascript
vX = viewportWidth / 2;
vY = viewportHeight / 2;
DX = objectWidth / 2;
DY = objectHeight / 2;
```

DX e DY sono espressi nelle dimensioni reali dell'oggetto perché anche con $`k \rlap{\,/}{=} 1`$ dopo la scale() viene riportato nelle sue dimensioni naturali.

Con d3-tiles vedremo che la traslazione di coordinate nelle coordinate reali per posizionare l'oggetto si applica sempre usando lo spostamento desiderato dell'oggetto ma in relazione al fattore di scala massimo calcolato. Pertanto lo spostamento sarà un numero compreso in [-1, 1].

Inoltre quando si utilizza d3-zoom insieme a d3-tile i livelli di zoom intermedi al passaggio di due scale diverse di tile sono gestiti proprio da d3-zoom. Quando vengono caricate le tile della nuova scala d3-zoom agisce su un nuovo oggetto di dimensioni diverse perchè variando l'indice delle tile e di conseguenza il loro numero cambia la dimensione dell'oggetto proiettato nella viewport.


#### Fattore di scala k

Il fattore di scala k usato da d3-zoom è di tipo lineare ma potrebbe essere che il fattore di zoom originale del nostro oggetto sia espresso in una scala logaritmica.

Ad esempio si suppone di utilizzare una scala logaritmica in base 2 in cui si ha un numero **s** che rapprensenta il livello di scala e un default **d** che rappresenta il valore di default a cui l'oggetto è in dimensioni reali.

Il fattore k da usare in d3 sarà dato da:

```math
k = \frac{1}{2^{(s-d)}}
```

Quindi per calcolare dato k la scala corrente a cui si è avremo:

```math
s = d - log_2(k)
```

#### Vincoli sulla traslazione e scala

La trasformazione vista precedentemente (svg.call ....) si può sempre applicare ma non tiene conto di eventuali vincoli di zoom e pan che vogliamo imporre. Ad esempio vogliamo limitare il range di zoom e non vogliamo spostare l'ogetto visibile fuori dalla viewport.

Questi vincoli possono essere imposti attraverso le api **translateExtent** e **scaleExtent** di d3-zoom.

Per effettuare le tasformazioni rispettando tali vincoli si devono utilizzare le API **translateTo** o **translateBy** e **scaleTo** o **scaleBy** di d3-zoom.

La trasformazione generica è utile per imporre le condizioni iniziali su cosa si vuole visualizzare.

Nel caso di uso di d3-zoom semplice bisogna tenere conto che **translateTo** prende come riferimento il centro della viewport per posizionare il punto di interesse. Per utlizzare l'origine in alto a destra [0, 0] si deve calcolare la coordinata corrispondente dell'oggetto nel centro della viewport alla scala attuale senza traslazione e utilizzarla come offset.

La generica coordinata dell'oggetto si calcola:

```math
\bold{X_p = \frac{(X - tx)}{k}}
```

In questo caso avremo per le X:

$`\bold{X=Xv/2}`$

**Xv** larghezza vieport<br>
**k** fattore di scala corrente

analogamente si calcola per le Y; con le funzioni di d3-maps:

```javascript

    const p = calcCoords(
      viewPortSize.viewPortWidth / 2,
      viewPortSize.viewPortHeight / 2,
      0,
      0,
      transform.currentExpScale
    );
```


## d3-tile

E' il modulo che si occupa del calcolo degli indici delle tiles da visualizzare date le dimensioni della viewport, i parametri della matrice di trasformazioni applicata da d3-zoom e le dimensioni originali dell'oggetto.

Al variare del livello di zoom calcolato da d3-zoom da applicare all'oggetto renderizzato si raggiunge una soglia oltre la quale devono essere caricate nuove tiles con un diverso indice e non deve essere più applicato al rendering context lo zoom precendente ma quello ricalcolato in base alle nuove tiles. In tal modo si carica una nuova rapprensentazione dell'oggetto con le tiles associate al livello di zoom voluto e via così. Tale soglia è legata alle dimensioni dell'oggetto e alle dimesioni delle tiles.

Se ad esempio l'ogetto è zoomato al punto che le dimensioni risultanti nella viewport sono uguali a quelle della rappresentazione dell'oggetto stesso con tiles di livello superiore allora vengono caricate quelle nuove e il nuovo valore di zoom sarà riportato a quello di base. L'oggetto proiettato infatti avrà le dimensioni date dalle nuove tiles senza ulteriori correzioni di zoom applicate con il fattore di scala k.

Il processo si ripete sia nei casi di zoom-in che di zoom-out all'interno del range di scala consentito. Questo concetto è importante e va di pari passo con quanto detto in d3-zoom.

### Suddivisione dell'ogetto priettato o piano in tiles

Il numero di tiles con cui suddividere  un oggetto piano o una proiezione dipende dalla dimensione delle tile stesse. In questo caso sono usate tiles di 256x256 pixel. Si considera di suddividere l'oggetto in un numero di tiles uguale nelle due dimensioni (X e Y): in generale l'area massima rappresentabile dalle tiles è un quadrato con lato

$`L=Ntiles*Ltile`$

A questo punto si calcola il numero di tiles che sono necessarie per rappresentare l'oggetto considerando la dimensione massima dell'oggetto:

$`Lmax = Max(X, Y)`$

### Numerazione ed indicizzazione delle tiles e scala

Per rappresentare con tiles una superficie piana e poterla renderizzare è necessario identificare ciascuna tile da caricare e posizionare nel rendering context alle corrette coordinate, creando una sorta di griglia.
Per fare questo si possono usare diversi metodi; qui è stato adottato un sistema ad indici, tipo Sleepy Map di Google, usato anche per le rappresentazioni delle mappe terrestri.

Si parte definendo una dimensione delle tiles, ad esempio 256, e definendo due indici **X** e **Y** che rapprensentano le le tile nel piano cartesiano, una affiancata all'altra a formare un quadrato (ad esempio) di Xmax x Ymax Tiles.

Si considera Xmax = Ymax in modo e che il numero delle tile per lato sia nultiplo di 2.

Si definisce un terzo indice **z** che rapprenta il livello di zoom. Questo è legato al numero di tiles in questo modo:

$`\bold{Xmax = Ymax = 2^{z}}`$

Quindi ad esempio con z = 0 avremmo una sola tile, con z = 1 quattro tiles, due per lato, ecc.. Il numero totale di tiles infatti è dato da

$`\bold{Nmaxtiles = Xmax * Ymax = 2^{Nmaxtiles}}`$

Variando lo zoom in base alla richieste (zoom out o zoom in) l'indice varia.

Dal momento che l'elemento minimo è una tile di 256&times;256 ovvero $`2^{8}`$ conviene usare scala esponenziale per il rapporto tra l'immagine e ciò che viene renderizzato.

Al variare dell'indice z la scala varia quindi secondo la formula:

$`\bold{Nmaxtiles = Xmax * Ymax = 2^{Nmaxtiles}}`$

$`\bold{expScale = 2^{8 + z}}`$

**Note:** questa formula con z intero indica proprio i livelli di scala per diversi livelli di z di tiles; nei valori intermedi si applica invece uno zoom localmente al rendering context determinato da d3-zoom. Il numero 8 è un valore di base della scala spiegata in seguito.

### Calcolo dei paramtri di gestione delle tiles e zoom

Usiamo allora la scala esponenziale in base 2 per mettere in relazione la dimensione massima dell'oggetto e la dimenzione delle tiles: questo servirà per capire quante tiles ci vogliono per rappresentare l'oggetto.

Il numero delle tiles crescerà al variare degli indici delle tile come potenza di 2 e per questo motivo si usa una scala esponenziale in base 2. Il valore minimo della scala è dato propio dalla dimensione della tile che nel nostro caso è 256: questo perché devo usare almeno una tile per rappresentare l'oggetto!
Quindi il valore minimo della scala è:

$`\bold{expMin = \log_2(256) = 8}`$

A questo punto calcoliamo l'esponente della scala naturale con cui rappresentare l'oggetto suddiviso in tile con:

$`\bold{expScale = \log_2(Lmax / Ltile)}`$

Questo potrà non essere un numero intero dovuto al fatto che le dimensioni massime dell'oggetto potranno non essere in generale divisibili precisamente per Ltile. Per indicizzare le tile abbiamo bisogno di numeri interi e quindi consideriamo l'estremo superiore del valore calcolato che rappresenti il numero di tile minimo da contenere l'oggetto; questo deve essere almeno expMin.

$`\bold{expInt = \max(expMin, \lceil expScale\rceil)}`$

Con questi passaggi abbiamo calcolato l'esponenete della scala in base 2 che rappresenta il rapporto tra l'oggetto renderizzato suddiviso in tile e l'oggetto stesso.

Ci serve ancora conoscere il valore di scala che potremmo ancora applicare all'oggetto anche se rapprensentato in una singola tile fino ad occupare lo spazio minimo, ovvero 1px. Per tener conto di questo devo considerare la dimensione di un tile e capire quale sia la scala per ridurre al massimo l'oggetto ad 1px.

Questo valore è 256 volte (dimensione della tile stessa), ovvero 

$`\bold{expBase = 2^8}`$

A questo punto la scala esponenziale alle dimensioni naturali completa sarà:

$`\bold{scale = 2^{(expInt + expBase)}}`$

che successivamente chiameremo **expScaleDefault** e l'indice delle tile che dovranno essere utilizzate:

$`\bold{Zdefault = tileIndex = expInt - expMin}`$

con i tre valori **expInt**, **scale** e **tileIndex** abbiamo calcolato i valori necessari per rappresentare l'oggetto con le tile.
Quindi potremmo voler calcolare l'indice minimo **Zmin** e massimo **Zmax** per definire l'estensione dello zoom.

L'indice minimo possibile è $`exp_{min} = 8`$ e $`scale_{min} = 2^8 = 256`$

Il massimo in linea teorica potrebbe essere infinito potendo continuare a costruire tile sempre più dettagliate dell'oggetto; di fatto viene definito limite di massimo zoom e per calcolarlo bisogna conoscere il modello di partenza.

La scala che mette in relazione la dimensione naturale dell'oggetto con quella disegnata è una potenza di 2, la formula generale differisce a seconda che il parametro di "zoom" che utilizzeremo sia un numero che varia in modo lineare o esponenziale/logaritmico anch'esso (come in d3-zoom).

Nel caso di fattore di zoom lineare la formula sara, ovvero "ingrandisco" l'oggetto di **zoom** volte:

$`\bold{scale = 2^{(expInt + zoomFactor + expBase)}}`$

con

$`\bold{zoomFactor = \log_2(zoom)}`$

#### Esempio

Supponiamo di voler zoomare al massimo di **M** volte la dimensione dell'oggetto di partenza, in pratica applicando uno zoom lineare, e calcoliamo i valori che serviranno per le condizioni iniziali.

Calcoliamo il valore di default della scala, corrispondente alle dimensioni naturali dell'oggetto:

$`expScaleDefault = 2^{(expInt + expBase)}`$

perché con fattore di scala 1 zoomFactor = 0.

Calcoliamo il massimo valore della scala esponenziale:

$`\bold{zoomFactorMax = \log_2(zoomMax)}`$

$`\bold{expMaxDouble = 2^{(expInt + zoomFactorMax + expBase)}}`$

Successivamente dovremmo colare il valore minimo e quello iniziale: **expScaleMin** ed **expScaleInit**.

Con questi parametri possiamo porre le condizioni iniziali ed utilizzare d3-tile insieme a d3-zoom per gestire le tiles e lo zoom.

### Modello di scala esponenziale

Fin ora abbiamo considerato di rappersentare l'oggetto con un fattore di zoom lineare. Utilizziamo un fattore esponenziale/logaritmico con base 2 con un valore di default in questo modo:

$`\bold{factor = 2^{(myScaleDefault - myScale)}}`$

Le formule viste precedentemente non cambiano molto: rimane invariato il calcolo di **expInt** per definire il valore di scala naturale e il valore di scala di base delle tiles ma varia la formula generale di calcolo della scala esponenziale:

$`\bold{scale = 2^{(expInt - (myScale - myScaleDefault) + expBase)}}`$

Da questa si possono poi ricavare i valori iniziali necessari come nel caso precedente.

### Calcolo indice delle tiles

Gli indici delle tiles nel formato (z, x, y) SlippyMap è calcolato da d3-tile in base al valore delle scala esponenziale corrente e al valore della traslazione corrente.

L'indice z in particolare è legato alla **currentExpScale**. Considerato l'esponente della scala esponenziale, esso è dato da:

$`z = \lfloor\max(\log_2{(\cfrac{currentExpScale}{TILESIZE})}, 0)\rfloor`$

$`z = expInt + \lfloor{zoomFactorMax}\rfloor`$ nel caso di fattore lineare

$`z = expInt - (myScale - myScaleDefault)`$ nel caso di fattore esponenziale


### Posizionamento programmatico e spostamento dell'oggetto

Quanto spiegato precedentemente nel paragrafo "Spostamento e zoom programmatico con d3" vale esattamente anche nel caso delle tiles. La differenza sarà nel valore di scala k e nei valori spostamento dell'oggetto DX e DY.

Con d3-tile bisogna tenere conto che inizialmente posiziona l'oggetto con il centro nell'origine in alto a sinistra.

Dobbiamo tenere anche conto che le dimensioni reali del nostro oggetto corrispondono ad una precisa scala esponenenziale e che usando quella come scala di base rispetto alle dimensioni reali stiamo praticamente scalando le dimensioni dell'oggetto nel range [0,1].

$`\bold{expScaleDefault = scale = 2^{(expInt + expBase)}}`$

Perchè come abbiamo detto la scala è riferita al massimo zoom out che potremmo fare fino a portare l'oggetto ad occupare 1px.
Quindi avremo:

```javascript
    svg.call(this.zoom.transform, zoomIdentity
        .translate(vX, vY)
        .scale(expScale)
        .translate(DX, DY)
    );
```
con

- expScale: scala esponenziale voluta (la corrente se facciamo solo uno spostamento)
- DX, DY coorinate dell'oggetto in un sistema di riferimento in cui il range delle coordinate è [0, 1] perchè stiamo scalando prioprio di quanto è il rapporto delle dimensioni massime di dominio dell'oggetto rispetto a 1x1 pixel!!! Tendendo anche conto di un **fattore 0.5** nella taslazione scalata perché d3-tile già posiziona l'origine in alto a destra della viewport e i valori rappresentano delle taslazioni.

Prendiamo il caso di posizionamento iniziale e calcoliamo innanzi tutto la posizione normalizzata a [0,1]

$`\bold{scaledPos = \frac{pos}{expScaleDefault}}`$

Quindi la traslazione nello spazio scalato tenendo conto del centro, applicata di default da d3.

$`\bold{scaledTranslation = 0.5 - scaledPos}`$

Per costruire la matrice di trasformazione e applicarla con le API di d3-zoom si deve:

```javascript
svg.call(
  this.zoom.transform,
  zoomIdentity
    .translate(vX, vY)
    .scale(initScale)
    .translate(DX, DY)
);
```

Se fossi runtime e non in posizionamento iniziale occorre sostituire **initScale** con **currentScale**.

Dove 
- **svg** è l'oggetto js risultante dalla "select" di d3 dell'elemento HTML \<svg>
- **vX** e **vY** sono le traslazioni nel sistema di riferimento della viewport in cui posizionare il punto dell'oggetto voluto 
- **Dx** e **DY** sono le scaledTranslation, traslazioni dell'oggetto stesso

Ad esempio per posizionare in alto a sinistra l'origine dell'oggetto dovremo usare

```javascript
svg.call(
  this.zoom.transform,
  zoomIdentity
    .translate(0, 0)
    .scale(scale)
    .translate(0.5, 0.5)
);
```


### Limiti di pan e zoom

Le API qui esposte non tengono presente di vincoli di scala e traslazione che si possono imporre con translateExtent e scaleExtent di d3.
Per essere coerenti con questi vicoli occorre usare funzioni tipo

```javascript
zoom.translateBy
zoom.translate
...
```

Queste funzionano correttamente al momento per il rendering di un singolo svg e sono usate infatti nel componente **ZoomingSurface**. Per utilizzarle anche nel caso tile occorre investigare su come definire l'extent mediante funzioni al variare delle tiles.

Un altro spunto per la limitazione di pan e zoom potrebbe essere quello di bloccare la mouseDown di default di d3-zoom quando si è raggiunto il limite dello schema, già calcolato dai selector di boundary.

[1](https://marketplace.visualstudio.com/items?itemName=goessner.mdmath) Visual Studio Code  Markdown + Math
[2](https://github.com/d3/d3-tile) d3-tile
[3](https://github.com/d3/d3-zoom) d3-zoom
[4](https://github.com/d3/d3-selection) d3-selection
