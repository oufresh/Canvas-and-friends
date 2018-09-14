# layoutMaps Module

## Descrizione

Modulo che si occupa di gestire il layout di schemi multipli. Sfruttando questo modulo lato View, sarà possibile avere, ad esempio, uno schema di sfondo e uno schema all'interno di un popup, oppure una visualizzazione a tabs degli schemi.

## Gestione istanze multiple

### Reducer

Ogni reducer del modulo layoutMaps deve essere istanziato passando come parametro un **namespace** che lo identifica univocamente.

```js
//reducers.js
import { layoutMaps,NAMESPACE_LIST,NAMESPACE_POPUP} from '../../../src/modules/layoutMaps';

const reducersMap:ReducersMap = {
    layoutMapsList: layoutMaps(NAMESPACE_LIST),
    layoutMapsPopup: layoutMaps(NAMESPACE_POPUP),
};
```

**NB:**
Da notare che in questo caso non viene settato il *setRoot* dei selettori in quanto quest'ultimi sono gestiti diversamente dal solito, verrà spiegato in seguito.

### Actions

Tutte le actionCreator del modulo hanno come primo parametro il **namespace** in modo da poter associare la action all'istanza desiderata di reducer.

```js
//actionCreators.js
import {type Action, createAction} from 'stweb-redux-helper';
import { INIT_LAYOUT_MAPS, ADD_MAP_TO_LAYOUT, ADD_SELECTED_MAP} from './actionDefinitions';

export const initLayoutMap = (namespace:string, uuids:Array<string>):Action<InitLayoutMapT> ={
    return createAction(INIT_LAYOUT_MAPS, { namespace,uuids });
}
export const addMapToLayout = (namespace:string, uuid:string):Action<AddMapToLayoutT> =>{
    return createAction(ADD_MAP_TO_LAYOUT, { namespace,uuid });
}
export const addSelectedMap = (namespace:string, uuid:string):Action<AddSelectedMapT> =>{
    return createAction(ADD_SELECTED_MAP, { namespace,uuid });
}
```

### Selectors

Per quanto riguarda i selettori è necessario modificare l'approccio finora utilizzato per la loro creazione (descritto nello documentazione di *stweb-redux-helper*) in quanto devono essere condivisi tra istanze multiple di componenti di view.
L'obiettivo è far si che ogni istanza abbia il proprio insieme di selettori.

#### Descrizione approccio per i selettori

Di seguito è riportato il *nuovo approccio* per selettori.

```js
//selectors.js
import {createSelector} from 'reselect';
import { type State } from 'stweb-redux-helper';
import { type LayoutMapsT} from './types';

const getRootDefault = (state:State):?LayoutMapsT => state;

export const getRootByNameDeclaration = (rootState:string ) => (state:( state:State )=>?LayoutMapsT) => state.get(rootState);

export function selectorFactory(getRoot:( state:State )=>?LayoutMapsT = getRootDefault){
    const getLayoutMapsRoot = state => getRoot(state);
    const getSelectedMaps = createSelector([getLayoutMapsRoot], (layoutMaps:(layoutMaps:LayoutMapsT)=>Set<string>) => layoutMaps.selectedMaps);
    const getLayoutMapUuids = createSelector([getLayoutMapsRoot], (layoutMaps:(layoutMaps:LayoutMapsT)=>Array<string>) => layoutMaps.mapUuids);
    const getLayoutMapNamespace = createSelector([getLayoutMapsRoot], (layoutMaps:(layoutMaps:LayoutMapsT)=>string) => layoutMaps.namespace);

    return { getLayoutMapsRoot, getSelectedMaps, getLayoutMapUuids, getLayoutMapNamespace };
}

```

Di seguito vi è un *esempio* di come sfruttare le varie funzioni di selectors.js

```js
//reducers.js
import { layoutMaps,NAMESPACE_LIST,NAMESPACE_POPUP, selectorFactory, getRootByNameDeclaration } from '../../../src/modules/layoutMaps';

const reducersMap:ReducersMap = {
    layoutMapsList: layoutMaps(NAMESPACE_LIST),
    layoutMapsPopup: layoutMaps(NAMESPACE_POPUP),
};

export const selectorLayoutMapsList = selectorFactory(getRootByNameDeclaration('layoutMapsList'));
export const selectorLayoutMapsPopup = selectorFactory(getRootByNameDeclaration('layoutMapsPopup'));

```

Il file *selectors.js* esporta due metodi pricipali:

- **getRootByNameDeclaration** : metodo di utily per settare l'istanza corretta. Prende come parametro una stringa corrispondente alla porzione di stato di interesse (definito nell'oggetto reducersMap) e ritorna la porzione di stato relativa.

- **selectorFactory**: è una funzione che ha come parametro in ingresso lo stato. All'interno  devono essere definiti i selettori (è possibile utilizzare la versione di selettori con o senza *createSelector*). Il valore di ritorno è un oggetto costituito dai selettori appena creati.

Il file *reducers.js* esporta due istanze di selettori ciascuna relativa alla propria porzione di stato:

- **selectorLayoutMapsList**

- **selectorLayoutMapsPopup**

#### Utilizzo dei selettori nei componenti di View

I componenti di View devono sfruttare i selettori esportati dal file **reducers.js** all'interno del *mapStateToProps*.

```js
//ViewContainer.js
import { selectorLayoutMapsList, selectorLayoutMapsPopup } from './store/reducers';

const mapStateToProps = (state) =>{
    return {
        selectedMapsList: selectorLayoutMapsList.getSelectedMaps(state),
        selectedMapsPopup: selectorLayoutMapsPopup.getSelectedMaps(state)
    }
}

```