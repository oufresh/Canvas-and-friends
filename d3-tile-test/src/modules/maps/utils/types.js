//@flow
export type ExpRenderInfoT = {|
    expScaleExtent: Array<number>,
    initExpScale: number,
    maxScaleConv: number,
    schemaWidth: number,
    schemaHeight: number,
    scaleExtent: Array<number>
|};

export type LinearRenderInfoT = {|
    expScaleExtent: Array<number>,
    initExpScale: number,
|}

export type SingleRenderInfoT = {|
    scaleExtent: Array<number>,
    initScale: number,
|}

export type RenderInfoT = ExpRenderInfoT | LinearRenderInfoT;