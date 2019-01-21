//@flow

/**
 * Dati per la costruzione url del servizio delle tiles.
 */
export type TileUrlBuilderParam = {|
  baseUrl: string, //url base del servizio di tiles
  width: number, //dimensioni mappa
  height: number,
  x: number, //indice x tiles
  y: number, //indice y tiles
  zoomIndex: number //indice z tiles o specifico del server
|};
