//@flow

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

export type ViewportObjectPositionByUuid = Map<string, ViewportObjectPosition>;

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

export type MapSize = {|
  width: number,
  height: number
|};
export type ScalesByUuid = Map<string, Scales>;

export interface ReferenceSystemScales {
  currentScale: number;
  defaultScale: ?number;
  currentScaleInt: number;
  maxScale: number;
  minScale: number;
}

export type ReferenceSystemScalesByUuid = Map<string, ReferenceSystemScales>;

export type IntegerScalesArrayByUuid = Map<string, Array<number>>;
