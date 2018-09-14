//@flow
import React from 'react';
import { select, event, mouse } from 'd3-selection';
import { zoom as d3Zoom, zoomIdentity } from 'd3-zoom';
import { 
    SINGLE_MIN_SCALE,
    SINGLE_MAX_SCALE,
    DEFALUT_SCALED_OBJ_TRANSLATION_X,
    DEFALUT_SCALED_OBJ_TRANSLATION_Y,
    DEFAULT_VIEWPORT_POSITION_X,
    DEFAULT_VIEWPORT_POSITION_Y
} from '../../modules/maps/utils/constants';
import { SvgCanvas } from '../commons/SvgCanvas';
import { SvgDiv } from '../commons/SvgDiv';
import { LayerGroup } from '../commons/LayerGroup';
import { moveRenderTo } from '../utils/transforms';

export type SingleTilePropsType = {
    uuid: string,
    width: number,
    height: number,
    top?: number,
    left?: number,
    renderInfo: any,
    scaledObjectTranslation?:Array<number>,
    viewportPosition?: Array<number>,
    translateExtent?: Array<Array<number>>,
    onZoomed:(string,number,number,number)=>void,
    scale: number,
    translate: Array<number>,
    svgContent: string
};

function calcCoords(scale, translate, x, y)
{
    const cx = (x - translate[0]) / scale;
    const cy = (y - translate[1]) / scale;
    return [cx, cy];
}

class SingleTile extends React.Component<SingleTilePropsType>
{
    svgRef: React.RefObject;
	svg: Object;
    zoom: Object;

    constructor(props:SingleTilePropsType)
    {
        super(props);
        this.svgRef = React.createRef();
    }

    /**
     * 
     */
    zoomed = () =>
    {
        const transform = event.transform;
        const {onZoomed, uuid} = this.props;
        onZoomed(uuid, transform.x, transform.y, transform.k);
    }
    
    setSvgSize()
    {
        const width = this.svgRef.current.clientWidth;
        const height = this.svgRef.current.clientHeight;

        this.svgRef.current.setAttribute("width", ""+width);
        this.svgRef.current.setAttribute("height", ""+height);
    }

    initZoom()
    {
        let scaleExtent: Array<number> = [SINGLE_MIN_SCALE, SINGLE_MAX_SCALE];
        if (this.props.renderInfo && this.props.renderInfo.scaleExtent)
        scaleExtent = this.props.renderInfo.scaleExtent;
        
        this.svg = select(this.svgRef.current);

        this.zoom = d3Zoom()
            //.translateExtent([[-1,-1], [1,1]])
            .scaleExtent(scaleExtent)
            .on("zoom", this.zoomed);

        this.svg.call(this.zoom);

        /*
        * Per non mettere tanti listenr ne metto uno poi sfrutto il bubbling degli eventi per capire a chi sono sopra ....
        * */
        this.svg.on("mousemove", () => {
            //ok fa la mousemouve
            //coordinate nel canvas svg
            //console.log(event);
            const coordinates = mouse(this.svgRef.current);
            //console.log(coordinates);
            //console.log(this.props.translate);
            const coords = calcCoords(this.props.scale, this.props.translate, coordinates[0], coordinates[1]);
            console.log(coords);
            const el = event.target || event.srcElement;
            const found = el.nodeType === 1? el : el.parentNode;
            console.log(found);
        });
    }


    initPosition()
    {
        //se voglio spostare il punto nella viewport teniamo conto che l'origine è
        //in alto a sinistra

        if (this.props.viewportPosition || this.props.scaledObjectTranslation) {
            const scaledObjectTranslation = this.props.scaledObjectTranslation ? this.props.scaledObjectTranslation : [DEFALUT_SCALED_OBJ_TRANSLATION_X, DEFALUT_SCALED_OBJ_TRANSLATION_Y];
            const viewportPosition = this.props.viewportPosition ? this.props.viewportPosition : [DEFAULT_VIEWPORT_POSITION_X, DEFAULT_VIEWPORT_POSITION_Y];
            const initScale = (this.props.renderInfo && this.props.renderInfo.initScale) ? this.props.renderInfo.initScale : MIN_SCALE;
            moveRenderTo(this.svg, scaledObjectTranslation[0], scaledObjectTranslation[1], viewportPosition[0], viewportPosition[1], initScale);
        }
        else {
            const initScale = (this.props.renderInfo && this.props.renderInfo.initScale) ? this.props.renderInfo.initScale : MIN_SCALE;
            this.svg.call(this.zoom.transform, zoomIdentity.scale(initScale));
        }
    }

    componentDidMount()
    {
        if (this.props.width > 0 && this.props.height > 0 && this.props.renderInfo)
        {
            this.setSvgSize();
            this.initZoom();
            this.initPosition();
        }
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

    componentDidUpdate(prevProps: SingleTilePropsType)
    {
        if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
            this.setSvgSize();
        }
        if (!this.svg && !this.zoom && this.props.renderInfo) {
            this.initZoom();
            this.initPosition();
        }
        /*if (this.isMoved(this.props.viewportPosition, prevProps.viewportPosition, this.props.scaledObjectTranslation, prevProps.scaledObjectTranslation) === true)
        {
            this.moveRenderTo(this.props.scaledObjectTranslation[0], this.props.scaledObjectTranslation[1], this.props.viewportPosition[0], this.props.viewportPosition[1], this.currentExpScale);
        }*/

        if (this.svg) {
            this.dbNodes = this.svg.selectAll('[data-id="2"]');
            this.dbNodes.on("dblclick", () => {
                console.log("Double click data-id = 2")
                console.log(event);
                event.stopPropagation();
            })
        }
    }

    render()
    {
        const { scale, translate } = this.props;
        const svgContent = (scale && translate) ? this.props.svgContent : '';
        return <SvgDiv width={this.props.width} height={this.props.height} top={this.props.top?this.props.top:0} left={this.props.left?this.props.left:0}>
                <SvgCanvas r={this.svgRef}>
                    <LayerGroup translate={translate} scale={scale} svgContent={svgContent}/>
                </SvgCanvas>
            </SvgDiv>;
    }
}

export default SingleTile;
