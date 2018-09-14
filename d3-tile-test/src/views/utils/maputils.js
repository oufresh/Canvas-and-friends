import * as MathEx from './mathEx';

export const TILE_SIZE = 256;
export const MIN_MOVE_SCHEMA = 2;
export const MAP_STEP_SCALE = 0.15;
export const MAP_STEP_X_Y = 100;
export const DRAW_STEP_X_Y = 15;
export const MIN_D3TILE_EXPONENT = 8;

export const getFactorForScale = (newScale, scaleDefault) => {
	return Math.pow(2, newScale - scaleDefault);
}

export const scaleValueFromScreenToMap = (value, factor) => value * factor;

export const scaleValuesFromScreenToMap = (values, newScale, scaleDefault) => {
	const factor = getFactorForScale(newScale, scaleDefault);
	return values.map(value => scaleValueFromScreenToMap(value, factor));
}

export const getSchemaCoordsFromScreenToMapWithScale=(coord_x, coord_y, viewPort, scaleCurrent, scaleDefault,newScale)=>{
	const [currWidth, currHeight] = scaleValuesFromScreenToMap([viewPort.width, viewPort.height], scaleCurrent, scaleDefault);
	const [newWidth, newHeight] = scaleValuesFromScreenToMap([viewPort.width, viewPort.height], newScale, scaleDefault);
	const x = coord_x + (currWidth / 2) - (newWidth / 2);
	const y = coord_y + (currHeight / 2) - (newHeight / 2);
	return [x,y];
}

export const convertCoordFromScreenToMap = (schemaCoordX, schemaCoordY, scale, scaleDefault, coordX, coordY) => {
	const factor = getFactorForScale(scale, scaleDefault);
	const x = schemaCoordX + (coordX * factor);
	const y = schemaCoordY + (coordY * factor);
	return {
		x,
		y,
		factor
	};
}

export const scaleValueFromMapToScreen = (value, factor) => value / factor;

export const scaleValuesFromMapToScreen = (values, newScale, scaleDefault) => {
	const factor = getFactorForScale(newScale, scaleDefault);
	return values.map(value => scaleValueFromMapToScreen(value, factor));
}

export const convertCoordFromMapToScreen = (schemaCoordX, schemaCoordY, scale, scaleDefault, coordX, coordY) => {
	const factor = getFactorForScale(scale, scaleDefault);
	const x = (coordX - schemaCoordX) / factor;
	const y = (coordY - schemaCoordY) / factor;
	return {
		x,
		y,
		factor
	};
}

export const getCoordByEvent = e => {
	const x = e.pageX || e.x;
	const y = e.pageY || e.y;
	return {x, y};
}

export const getPositionOffsetParent = (refs, e) => {
	const coord = getCoordByEvent(e);
	
	const offsetParent = refs.offsetParent().offset();
	return {
		x: coord.x - offsetParent.left,
		y: coord.y - offsetParent.top
	};
}

export const isMoveEnough = (startX, startY, newX, newY) => {
	const deltaX = startX - newX;
	const deltaY = startY - newY;
	return isDeltaMoveEnough(deltaX, deltaY);
}

export const isDeltaMoveEnough = (deltaX, deltaY) => {
	return  Math.abs(deltaX) >= MIN_MOVE_SCHEMA && Math.abs(deltaY) >= MIN_MOVE_SCHEMA;
}

const rectifyShape = (x1,y1,x2,y2, isLine, isSymbol=false) => {
	if(isSymbol || (window.event && window.event.shiftKey)) {
		const width = Math.abs(x2 - x1);
		const height = Math.abs(y2 - y1);
		const factor = (height === 0) ? Number.MAX_SAFE_INTEGER : width / height;
		const lineFactorDelta = 0.3;
		if(factor > 1) {
			if(factor < (1 + lineFactorDelta) || !isLine) {
				y2 = y1+(y2-y1) * factor;
			}
			else {
				y2 = y1;
			}
		}
		else {
			if(factor > (1 - lineFactorDelta) || !isLine) {
				x2 = x1+ (x2-x1) / factor;
			}
			else {
				x2 = x1;
			}
		}
	}
	return {x1,y1,x2,y2};
}


//prese da mapchoroplethcontainer, vedere se son duplicate con quelle sopra
export const pixels2coords = (coords, expScaleCurrent, expScaleDefault) => {
	return coords.map(coord => ((expScaleDefault / 2) - coord) * expScaleCurrent / expScaleDefault );
}

export const coords2pixels = (coords, scale, expScaleDefault) => {
	return coords.map(coord => ((scale / 2) - coord) * expScaleDefault / scale);
}

export const computeScale = (exp, scale, scaleDefault) => {
	return Math.pow(2,(exp - (scale-scaleDefault)) + MathEx.log2int(TILE_SIZE));
}

export const computeScaleInv = (exp, scale, scaleDefault) => {
	return (exp + scaleDefault + MathEx.log2int(TILE_SIZE) - MathEx.log2(scale));
}

export const scaleViewPort = (viewPortWidth, viewPortHeight, scale, expScaleDefault) => {
	return {
		width: viewPortWidth * expScaleDefault / scale, 
		height: viewPortHeight * expScaleDefault / scale
	};
}


// *****************************************************
// NOTA: da qui in giù forse si possono cancellare tutte
// *****************************************************
export const getPositionOffsetParent2 = (refs, e) => {
	const coord = getCoordByEvent(e);
	
	const offsetParent = refs.parent().offsetParent().offset();
	return {
		x: coord.x - offsetParent.left,
		y: coord.y - offsetParent.top
	};
}


const getFactor = (schema, scale) => {
	scale = scale || schema.scaleCurrent;
	return Math.pow(2, scale - schema.scaleDefault);
}

const convertCoordScreenToMap = (schema,coordX,coordY) => {
	const factor = getFactor(schema);
	const coordMap = {
		x: schema.coord_x + (coordX * factor),
		y: schema.coord_y + (coordY * factor)
	}
	return coordMap;
}

const getPositionWithoutParentOffset = (refs, e) => {
	const x = e.pageX || e.x;
	const y = e.pageY || e.y;
	if(!refs.parent){
		return {x, y};
	}

	const offsetParent = refs.parent().offsetParent().offset();
	return {
		x: x - offsetParent.left,
		y: y - offsetParent.top
	};
}

export {convertCoordScreenToMap, getFactor, getPositionWithoutParentOffset, rectifyShape};