//@flow
//durata movimento animato di default in ms
export const ANIMATION_MOVE_DURATION_DEFAULT = 500;

//dimensione tile fissata a 256 per compatibilità
export const TILE_SIZE = 256;

//esponente della scala esponeziale di base usato in d3
export const MIN_D3TILE_EXPONENT = 8;

//valore minimo della scala esponenziale corrisponde a 2^8
//non è aggiunta la parte di scala corrente: exp = 2^(8+z)
//corrisponde a z = 0 per il primo livello di tile (0x0x0)
export const MIN_EXP_SCALE = 256;

//ne metto una abbastanza grande che corrisponde a 2^(8 + 12), z = 12
export const MAX_EXP_SCALE = 1048576;

//Di default d3 posiziona l'oggetto al centro quindi per riposizionarlo dove voglio devo
//tener conto del centro come offset
export const DEFALUT_SCALED_OBJ_TRANSLATION_X = 0.5;
export const DEFALUT_SCALED_OBJ_TRANSLATION_Y = 0.5;

//come posizione di default della viewport usiamo l'origine in alto a sinistra
export const DEFAULT_VIEWPORT_POSITION_X = 0;
export const DEFAULT_VIEWPORT_POSITION_Y = 0;

export const MIN_MOVE_SCHEMA = 2;
export const MAP_STEP_SCALE = 0.15;
export const MAP_STEP_X_Y = 100;
export const DRAW_STEP_X_Y = 15;

export const SINGLE_MIN_SCALE = 0.25;
export const SINGLE_MAX_SCALE = 4;
export const SIGNLE_DEFAULT_SCALE = 1;
export const SINGLE_DEFALUT_SCALED_OBJ_TRANSLATION_X = 0;
export const SINGLE_DEFALUT_SCALED_OBJ_TRANSLATION_Y = 0;

export const EXTRA_RANGE_SCALE = 0.49;

/* Costanti per zooming surface */
export const ZOOMINGSURFACE_DEFAULT_SCALE = 1;
export const ZOOMINGSURFACE_MIN_SCALE = 0.25;
export const ZOOMINGSURFACE_MAX_SCALE = 4;

/* Constanti per spostamento attraverso pulsanti */
export const DEFAULT_SCHEMA_SHIFT = 100;
export const DEFAULT_SINGLE_SCHEMA_SHIFT = 50;