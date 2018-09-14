# stweb-d3

Libreria per il rendering di geometrie con tile attraverso svg e raster.

## Tile rendering di oggetti piani

Per realizzare il rendering a tile sono stati utilizzati i moduli d3-zoom e d3-tile. Questi non presuppongono nulla sul contesto di rendering: ci permettono di effettuare i calcoli necessari per gestire zoom e pan con le trsformazioni matriciali associate e gestire le tile nelle varie scale in cui si vuole rappresentare l'oggetto.

### d3-zoom

E' il modulo di d3 che si occupa di gestire lo zoom e il pan del nostro rendering e calcolare le trasformazioni da applicare a seguito di tali eventi.

Di default il pan si effettua tenendo premuto il pulsante sinistro del mouse e muovendo nelle 4 direzioni il mouse stesso.

Lo zoom di default si effettua con la rotella del mouse (zoom-in e zoom-out) e con doppio click del tasto sinistro (zoom-in).

A seguoti di queste gesture d3-zoom ci fornisce i parametri della matrice di trasformazione. Tralasciando per semplicità d3-tile e le scale delle tile, nel caso di rendering **svg** devono essere applicati al gruppo svg che utilizziamo come layer per la rappresenatzione:

```html
    <g transform="translate(transform.x, transform.y) scale(transform.k)">
```

Nel caso di rendering con il **canvas** si avrebbe invece:

```javascript
    context.translate(transform.x, transform.y);
    context.scale(transform.k, transform.k);
```

dove **context** è il contesto 2D associato al canvas che stiamo utilizzando.

**Note:** E' fonfamentale dichiarare le dimensioni dell'area di disegno sia nel caso dell'svg sia nel caso del canvas attraverso gli attributi html width ed height. E' diverso utilizzare gli attributi css: queti ultimi determinano solo uno scalamento a posteriori dell'oggetto e, in caso si voglia fare è meglio usare la proprietà scale. Per ridimensionare usare comunque gli attributi che determinano la dimensione del contesto di disegno.

Questo modulo può essere utilizzato senza d3-tile se vogliamo visualizzare un oggetto e poterlo trasformare a seguito di pan e zoom.

Quando si utilizza d3-zoom insieme a d3-tile i livelli di zoom intermedi al passaggio di due scale diverse di tile sono gestiti proprio da d3-zoom. Quando vengono caricate le tile della nuova scala d3-zoom agisce su un nuovo oggetto di dimensioni diverse. Questo perchè variando l'indice delle tile e di conseguenza il loro numero cambia la dimensione dell'oggetto proiettato nella viewport.

### d3-tile

E' il modulo che si occupa del calcolo degli indici delle tiles da visualizzare date le dimensioni della viewport, i parametri della matrice di trasformazioni applicata da d3-zoom e le dimensioni originali dell'oggetto.

Al variare del livello di zoom calcolato da d3-zoom da applicare all'oggetto renderizzato si raggiunge una soglia oltre la quale devono essere caricate nuove tiles con un diverso indice e non deve essere più applicato al rendering context lo zoom precendente ma quello ricalcolato in base alle nuove tiles. In tal modo si carica una nuova rapprensentazione dell'oggetto con le tiles associate al livello di zoom voluto e via così. Tale soglia è legata alle dimensioni dell'oggetto e alle dimesioni delle tiles.

Se ad esempio l'ogetto è zoomato al punto che le dimensioni risultanti nella viewport sono uguali a quelle della rappresentazione dell'oggetto stesso con tiles di livello superiore allora vengono caricate quelle nuove e il nuovo valore di zoom sarà riportato a quello di base. L'oggetto proiettato infatti avrà le dimensioni date dalle nuove tiles senza ulteriori correzioni di zoom applicate con il fattore di scala k.

Il processo si ripete sia nei casi di zoom-in che di zoom-out all'interno del range di scala consentito. Questo concetto è importante e va di pari passo con quanto detto in d3-zoom.

### Suddivisione dell'ogetto priettato o piano in tiles

Il numero di tiles con cui suddividere l'oggetto piano o una proiezione dipende dalla dimensione delle tile stesse. In questo caso sono usate tiles di 256x256 pixel. Si considera di suddividere l'oggetto in un numero di tiles uguale nelle due dimensioni (X e Y): in generale l'area massima rappresentabile dalle tiles è un quadrato con lato

$$L=Ntiles*Ltile$$

<!--
$$e^{i\pi}+1=0$$

$$log_2(8)$$-->


A questo punto si calcola il numero di tiles che sono necessarie per rappresentare l'oggetto considerando la dimensione massima dell'oggetto:

$$Lmax = Max(X, Y)$$


### Numerazione ed indicizzazione delle tiles

Per rappresentare con delle tile una superficie piana e poterla renderizzare è necessario identificare ciascuna tile da caricare e posizionare nel rendering context in modo corretto.

Per fare questo si possono usare diversi metodi; qui è stato adottato un sistema ad indici, tipo Sleepy Map di Google, usato anche per le rappresentazioni delle mappe terrestri.

Si parte definendo una dimensione delle tiles, ad esempio 256, e definendo due indici **X** e **Y** che rapprensentano le le tile nel piano cartesiano, una affiancata all'altra a formare un quadrato (ad esempio) di Xmax x Ymax Tiles.

Per semplicità si considera Xmax = Ymax in modo e che il numero delle tile per lato sia nultiplo di 2.

Si definisce un terzo indice **z** che rapprenta il livello di zoom. Questo è legato al numero di tiles in questo modo:

<!--**Xmax = Ymax = Math.pow(2, z)**-->

$$Xmax = Ymax = 2^{z}$$

Quindi ad esempio con z = 0 avremmo una sola tile, con z = 1 quattro tiles, due per lato, ecc.. Il numero totale di tiles infatti è dato da 

$$Nmaxtiles = Xmax * Ymax = 2^{Nmaxtiles}$$

Variando lo zoom in base alla richieste (zoom out o zoom in) l'indice varia ed è nel nostro caso calcolato da d3-tile proprio come detto sopra.

Dal momento che l'elemento minimo è una tile di 256&times;256 ovvero con Math.pow(2, 8) si usa quindi la scala esponenziale per il rapporto tra l'immagine e ciò che viene renderizzato.

Al variare dell'indice z la scala varia quindi secondo la formula:

$$Nmaxtiles = Xmax * Ymax = 2^{Nmaxtiles}$$

$$expScale = 2^{8 + z}$$

**Note:** questa formula con z intero indica proprio i livelli di scala per diversi livelli di z di tiles; nei valori intermedi si applica invece uno zoom localmente al rendering determinato partendo da d3-zoom. 8 è la base della scala spiegata dopo.


### Calcolo dei paramtri di gestione delle tiles e zoom


Usiamo allora la scala esponenziale in base 2 per mettere in relazione la dimensione massima dell'oggetto e la dimenzione delle tiles: questo mi servirà per capire quante tiles ci vogliono per rappresentare l'oggetto.

Il numero delle tiles crescerà al variare degli indici delle tile come potenza di 2 per qusto si usa una scala esponenziale in base 2. Il valore minimo della scala è dato propio da Ltile che nel nostro caso è 256: questo perché devo usare almeno una tile per rappresentare l'oggetto. Quindi:

$$expMin = \log_2(256) = 8$$

A questo punto calcoliamo l'esponente della scala naturale con cui rappresentare l'oggetto suddiviso in tile con:

$$expScale = \log_2(Lmax / Ltile)$$

Questo potrà non essere un numero intero dovuto al fatto che le dimensioni massime dell'oggetto potranno non essere in generale divisibili precisamente per Ltile. Per indicizzare le tile abbiamo bisogno di numeri interi e quindi consideriamo l'estremo superiore che rappresenti il numero di tile minimo da contenere l'oggetto:

$$expInt = \max(expMin, \lceil expScale\rceil)$$

Con questi passaggi abbiamo calcolato l'esponenete della scala in base 2 che rappresenta il rapporto tra l'oggetto renderizzato suddiviso in tile e l'oggetto stesso.

Ci serve ancora conoscere il valore della scala da utilizzare perché l'oggetto può essere ulteriormente scalato (anche quando sono in una singola tile) fino ad occupare lo spazio minimo, ovvero 1px. Per tener conto di questo devo considerare la dimensione di un tile e capire quale sia la scala per ridurre al massimo l'oggetto ad 1px.

Questo valore è 256 volte, ovvero 

$$expBase = 2^8$$

A questo punto la scala esponenziale sarà:

$$scale = 2^{(expInt + expBase)}$$

e l'indice delle tile che dovranno essere utilizzate:

$$Zdefault = tileIndex = expInt - expMin$$

con i tre valori **expInt**, **scale** e **tileIndex** abbiamo calcolato i valori di base per rappresentare l'oggetto con le tile ci serve calcolare l'indice minimo **Zmin** e massimo **Zmax** che vorremmo poi utilizzare per definire l'estensione dello zoom.

L'indice minimo possibile è $exp_{min} = 8$ e $scale_{min} = 2^8 = 256$

Il massimo in linea teorica potrebbe essere infinito potendo continuare a costruire tile sempre più dettagliate dell'oggetto.
Di fatto viene definito limite di massimo zoom e per calcolarlo bisogna conoscere il modello di partenza.

**Esempio** Supponiamo di voler zoomare al massimo di **M** volte la dimensione dell'oggetto di partenza:

TODO DA METTERE I CALC EXP SCALE CORRETTI DI d3-maps

Calcoliamo il massimo valore dell'esponente della scala:

$$expMaxDouble = \log_2(\frac {M*dimension}{Ltile})$$

Calcoliamo l'esponente intero che approssima per eccesso:

$$expMaxInt =  \max(expInt, ceil(expMaxDouble))$$

Quindi il massimo valore della scala:

$$expScaleMax = 2^{(expMaxInt + expBase)}$$

E infine il massimo indice delle tiles **z**

$$tileIndexMax = expMaxInt - 8$$

Con questi parametri possiamo porre le condizioni iniziali ed utilizzare d3-tile insieme a d3-zoom per gestire le tiles e lo zoom (vedi in seguito).


### Posizionamento dell'immagine, centratura e spostamento

Per arrivare a posizionare l'oggetto o un punto di esso nella view port bisogna innanzi tutto calcolare le coordinate nella viewport del punto di origine passando attraverso la scala e poi tenere conto delle coordinate usate nella viewport.

Per effettuare questa trasformazione si deve tener conto di diversi aspetti (non per forza tutti necessari):

1. La traslazione dell'oggetto renderizzazto nelle coordinate della viewport
2. La scala esponenziale da applicare
3. La translazione dell'oggetto scalato in coordinate reali o normalizzate nel caso tiles.

Questo insieme di trasformazioni va a definire la matrice di trasformazione che viene applicata. In generale questa è una matrice 3x3 che utilizza coordinate omogee per effettuare la trasformazione tra gli spazi di coordinate (non è una tasformazione lineare ma affine).

Matrice di tasformazione generica:

 $$
    \begin{bmatrix} 
    k & 0 & tx \\
    0 & k & ty \\
    0 & 0 & 1
    \end{bmatrix}
$$

**k** è il fattore di scala applicato poi al canvas svg, direttamente così nel caso di d3-zoom soltanto, ricalcolato sulla base delle tile con d3-tile.

**tx** e **ty** sono le taslazioni.

Con le API di d3-zoom si parte dall'oggetto **zoomIdentity** a cui si applicano le funzioni **translate**, **scale** e infine **translate** per concatenare le tre trasformazioni precedenti (prodotto righe per colonne banale).

Supponiamo di utilizzare nel nostro modello delle coordinate cartesiane (X,Y) con l'origine in alto a sinistra come nel caso del canvas svg.

Infine bisogna tenere conto che d3-zoom inizialmente posiziona l'oggetto con il centro nell'origine in alto a sinistra, per cui avremo un fattore 0.5 nella taslazione scalata.

Nel caso si utilizzasse sono d3-zoom senza d3-tiles la traslazione di coordinate nelle coordinate reali per posizionare l'oggetto si applica usando proprio lo spostamento desiderato dell'oggetto. In questo caso infatti la scala a cui sono associate le dimensioni naturali è proprio $k = 1$ usato nella trasformazione.

Se usiamo anche d3-tile dobbiamo tenere conto che le dimensioni reali del nostro oggetto corrispondono ad una precisa scala esponenenziale e che usando quella come scala di base rispetto alle dimensioni reali stiamo praticamente scalando le dimensioni dell'oggetto nel range [0,1].

Nella trasformazione composta da

**translate()scale(expScaleDefault)translate()**

con

$$expScaleDefault = scale = 2^{(expInt + expBase)}$$

ci portiamo in un sistema di riferimento in cui il range delle coordinate è [0, 1] perchè stiamo scalando prioprio di quanto è il rapporto delle dimensioni massime di dominio dell'oggetto rispetto a 1x1 pixel!!! In questo dominio si deve ragionare per avere i dati corretti.

Chiaramente volta per volta cambierà il parametro **scale** della tasformazione perché è il valore attuale di scala esponenziale ma comunque ci riporta nel dominio [0,1].


Prendiamo il caso di posizionamento iniziale e calcoliamo innanzi tutto la posizione normalizzata a [0,1]

$$scaledPos = \frac{pos}{expScaleDefault}$$

Quindi la traslazione nello spazio scalato tenendo conto del centro, applicata di default da d3.

$$scaledTranslation = 0.5 - scaledPos$$

Per costruire la matrice di trasformazione e applicarla con le API di d3-zoom si deve:

```javascript
    svg.call(this.zoom.transform, zoomIdentity
        .translate(vX, vY)
        .scale(initScale)
        .translate(DX, DY)
    );
```

Se fossi runtime e non in posizionamento iniziale occorre sostituire **initScale** con **currentScale**.

Dove **svg** è l'oggetto js risultante dalla "select" di d3 dell'elemento HTML \<svg>, **vX** e **vY** sono le coordinate in cui posizionare il punto dell'oggetto voluto scalato e riporatato rispetto all'origine nel centro con la formula **scaledTranslation**; **scale** è lòa scala a cui staiamo renderizzando.

Ad esempio per posizionare in alto a sinistra l'origine dell'oggetto dovremo usare

```javascript
    svg.call(this.zoom.transform, zoomIdentity
        .translate(0, 0)
        .scale(scale)
        .translate(0.5, 0.5)
    );
```

### Modello di scala esponenziale

Le considerazioni fatte fin ora hanno preso in considerazione di rappersentare l'oggetto di base con una scala lineare: un fattore di zoom moltiplicativo semplice.

Se si utilizza invece un fatto esponenziale con base 2 .... TODO
