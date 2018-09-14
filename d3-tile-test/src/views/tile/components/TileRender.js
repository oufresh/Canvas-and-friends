//@flow
import React from 'react';
import { select, event } from 'd3-selection';
import { zoom as d3Zoom, zoomIdentity } from 'd3-zoom';
import { MIN_EXP_SCALE, 
    MAX_EXP_SCALE, 
    DEFALUT_SCALED_OBJ_TRANSLATION_X,
    DEFALUT_SCALED_OBJ_TRANSLATION_Y,
    DEFAULT_VIEWPORT_POSITION_X,
    DEFAULT_VIEWPORT_POSITION_Y,
    ANIMATION_MOVE_DURATION_DEFAULT,
    stringify,
    type TilesT,
    type RenderInfoT
 } from '../../../modules/maps';
import { SvgDiv }from '../../commons';

const svgStyle = {
    position: 'absolute',
    top: '0px',
    left: '0px',
    width: '100%',
    height: '100%'
};

export type RenderTileArg = {
    z: number,
    x: number,
    y: number
};

export type TileRenderPropsType = {
    uuid: string,
    width: number,
    height: number,
    top?: number,
    left?: number,
    renderInfo: RenderInfoT,
    scaledObjectTranslation?:Array<number>,
    viewportPosition?: Array<number>,
    translateExtent?: Array<Array<number>>,
    renderTile: (RenderTileArg, RenderInfoT) => React.Component<Object, Object>,
    onZoomed:(string,number,number,number)=>void,
    currentExpScale?: number,
    tiles: Array<TilesT>,
    onMouseMove: Function,
    onDoubleClick: Function
};

class TileRender extends React.Component<TileRenderPropsType>
{
    svgRef: React.RefObject;
    gLayer: React.RefObject;
	svg: Object;
    zoom: Object;
    expScaleCurrent: number;

    constructor(props:TileRenderPropsType)
    {
        super(props);
        this.svgRef = React.createRef();
        this.gLayer = React.createRef();
    }

    /**
     * 
     */
    zoomed = () =>
    {
        const transform = event.transform;
        //console.log(event.transform);
        const {onZoomed, uuid} = this.props;
        //non mi conviene calcolarlo qui, lo fa direttamente il selettore prendendolo dai dati di d3-tile
        //const z = calcZ(transform.k);
        onZoomed(uuid,transform.x, transform.y, transform.k);

        //cerchiamo di capire se ci spostiamo 
        //fuori dall'area della viewport
        //se si non azionaimo lo zoom così non si fa nulla ....
        /*let x = Math.min([transform.x, 0]);
        let y = Math.min([transform.y, 0]);
        const k = transform.k;
        let xx = Math.max([transform.x, (1-transform.k) * this.props.width]);
        let yy = Math.max([transform.y, (1-transform.k) * this.props.height]);*/

        //TODO bisogna calcolare la expScaleCurrent per poter muovere dove si vuole serve quella corrente che è data da transform.k
        //console.log('currentExpScale: ' + transform.k);
    }
    
    setSvgSize()
    {
        const width = this.svgRef.current.clientWidth;
        const height = this.svgRef.current.clientHeight;

        this.svgRef.current.setAttribute("width", ""+width);
        this.svgRef.current.setAttribute("height", ""+height);
    }

    dbclick = () => {
        if (event.toElement.id !== "svgcanvas") {
            const { onDoubleClick } = this.props;
            if (onDoubleClick)
                onDoubleClick(event.toElement);
        }
        else {
            const { scales } = this.props;
            console.log(scales);
            /*this.svg.call(this.zoom.transform, zoomIdentity
                .scale(scales.currentExpScale+1)
            );*/
        }
    }

    initZoomTile()
    {
        let expScaleExtent: Array<number> = [MIN_EXP_SCALE, MAX_EXP_SCALE];
        if (this.props.renderInfo && this.props.renderInfo.expScaleExtent)
            expScaleExtent = this.props.renderInfo.expScaleExtent;
        
        this.svg = select(this.svgRef.current);

        this.zoom = d3Zoom()
            //.translateExtent([[-1,-1], [1,1]])
            .scaleExtent(expScaleExtent)
            .on("zoom", this.zoomed);

        this.svg.call(this.zoom);
        this.svg.on("dblclick.zoom", this.dbclick);
    }


    initPosition()
    {
        //se voglio spostare il punto nella viewport teniamo conto che l'origine è
        //in alto a sinistra

        if (this.props.viewportPosition || this.props.scaledObjectTranslation) {
            const scaledObjectTranslation = this.props.scaledObjectTranslation ? this.props.scaledObjectTranslation : [DEFALUT_SCALED_OBJ_TRANSLATION_X, DEFALUT_SCALED_OBJ_TRANSLATION_Y];
            const viewportPosition = this.props.viewportPosition ? this.props.viewportPosition : [DEFAULT_VIEWPORT_POSITION_X, DEFAULT_VIEWPORT_POSITION_Y];
            const initExpScale = (this.props.renderInfo && this.props.renderInfo.initExpScale) ? this.props.renderInfo.initExpScale : MIN_EXP_SCALE;
            console.log("initPostion: objPos " + scaledObjectTranslation[0] + ", "+ scaledObjectTranslation[1] + "; viewportPos " + viewportPosition[0] + ", " + viewportPosition[1] + "; scale " + initExpScale);
            this.moveRenderTo(scaledObjectTranslation[0], scaledObjectTranslation[1], viewportPosition[0], viewportPosition[1], initExpScale);
        }
        else {
            const initExpScale = (this.props.renderInfo && this.props.renderInfo.initExpScale) ? this.props.renderInfo.initExpScale : MIN_EXP_SCALE;
            this.svg.call(this.zoom.transform, zoomIdentity.scale(initExpScale));
        }
    }

    componentDidMount()
    {
        console.log("TileRender componentDidMount");
        if (this.props.width > 0 && this.props.height > 0 && this.props.renderInfo)
        {
            this.setSvgSize();
            this.initZoomTile();
            this.initPosition();
        }
    }

    /**
     * Muove lo schema in modo programmatico data la traslazione rispetto al centro di default di d3 in coordinate scalate
     * nel punto della viewport specificato alla scala voluta.
     * @param {*} dx 
     * @param {*} dy 
     * @param {*} vX 
     * @param {*} vY 
     * @param {*} expScale 
     */
    moveRenderTo(dx: number, dy: number, vX: number, vY: number, expScale: number)
    {
        this.svg.call(this.zoom.transform, zoomIdentity
            .translate(vX, vY) //con questa sposto il centro nel mezzo della viewport definisco i tx e non moltiplicati per k
            .scale(expScale)
            .translate(dx, dy) // calcolo le dimensioni in proporzione a [-1, 1] esattamente come in opengl si trasla tra 0 e 1 nella matrice di proiezione
        );
    }

    animatedMoveRenderTo(dx: number, dy: number, vX: number, vY: number, expScale: number, duration?: number)
    {
        const dt = duration ? duration : ANIMATION_MOVE_DURATION_DEFAULT;
        this.svg.transition().duration(dt).call(this.zoom.transform, zoomIdentity
            .translate(vX, vY) //con questa sposto il centro nel mezzo della viewport definisco i tx e non moltiplicati per k
            .scale(expScale)
            .translate(dx, dy) // calcolo le dimensioni in proporzione a [0, 1] esattamente come in opengl si trasla tra 0 e 1 nella matrice di proiezione
        );
    }

    isMoved(viewportPosition: Array<number>, prevViewPortPosition: Array<number>, scaledObjectTranslation: Array<number>, prevScaledObjectTranslation: Array<number>): boolean
    {
        if (viewportPosition && scaledObjectTranslation)
        {
            if (viewportPosition[0] !== prevViewPortPosition[0] || viewportPosition[1] !== prevViewPortPosition[1] ||
                scaledObjectTranslation[0] !== prevScaledObjectTranslation[0] || scaledObjectTranslation[1] !== prevScaledObjectTranslation[1])
                return true;
            else
                return false;
        }
        else
            return false;
    }

    componentDidUpdate(prevProps: TileRenderPropsType)
    {
        if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
            this.setSvgSize();
        }
        if (!this.svg && !this.zoom && this.props.renderInfo) {
            this.initZoomTile();
            this.initPosition();
        }
        /*if (this.isMoved(this.props.viewportPosition, prevProps.viewportPosition, this.props.scaledObjectTranslation, prevProps.scaledObjectTranslation) === true)
        {
            this.moveRenderTo(this.props.scaledObjectTranslation[0], this.props.scaledObjectTranslation[1], this.props.viewportPosition[0], this.props.viewportPosition[1], this.currentExpScale);
        }*/
    }

    onMouseMove = (e) => {
        //console.log(e);
        const rect = this.svgRef.current.getBoundingClientRect();
        const x = e.pageX - rect.left;
        const y = e.pageY - rect.top;

        if (this.props.onMouseMove)
            this.props.onMouseMove([x,y]);
    }

    render()
    {
        let transform = null;
        let tiles = [];

        if (this.props.tiles && this.props.tiles.length > 0)
        {
            transform = stringify(this.props.tiles.scale, this.props.tiles.translate);
            tiles = this.props.tiles.map(t => this.props.renderTile(t, this.props.renderInfo));
        }

        return <SvgDiv width={this.props.width} height={this.props.height} top={this.props.top?this.props.top:0} left={this.props.left?this.props.left:0}>
                <svg id="svgcanvas" ref={this.svgRef} style={svgStyle} onMouseMove={this.onMouseMove}>
                {
                    <g ref={this.gLayer} transform={transform}>
                        {tiles}
                    </g>
                }
                <g>
                    <line x1={0} y1={0} x2={this.props.width} y2={this.props.height} style={{stroke:'rgb(255,0,0)',strokeWidth:1}} />
                    <line x1={0} y1={this.props.height} x2={this.props.width} y2={0} style={{stroke:'rgb(255,0,0)',strokeWidth:1}} />
                </g>
                </svg>
            </SvgDiv>;
    }
}

export default TileRender;