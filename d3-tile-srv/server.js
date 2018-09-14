var express = require("express");
var cors = require('cors');
var reload = require('reload');
var PNG = require('pngjs').PNG;
var symbols = require('./symbols');
 
var app = express();
app.use(cors());
 

/* serves main page */
app.get("/", function(req, res) {
    res.sendFile('index.html')
});

/* svg tiles */
app.get("/tiles/:z/:x/:y", function(request, response) { 
	var z = request.params.z;
	var x = request.params.x;
	var y = request.params.y;
	var tileId = `${z}, ${x}, ${y}`;
	
    response.writeHead(200, {
		'Content-Type': 'text/plain'
    });
	
	var t = `
		<g>
			<rect fill="#e1f7f7" id="canvas_background" height="256" width="256" y="0" x="0"/>
			<text stroke="#000" xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="24" id="svg_3" y="100" x="96" fill-opacity="null" stroke-opacity="null" stroke-width="0" fill="#000000">server</text>
			<text stroke="#000" xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="24" id="svg_3" y="125" x="96" fill-opacity="null" stroke-opacity="null" stroke-width="0" fill="#000000">${tileId}</text>
			<rect stroke="#000" id="svg_1" height="254" width="254" y="1" x="1" stroke-width="1.5" fill="rgba(0,0,0,0)"/>
		</g>
	`;
	
	t = t.replace(/\s+/g, ' ').trim();
	
	response.write(t);
    response.end();
});

function calcLenghtSymbols(syms)
{
	let lenght = syms.lenght * symbols.symbolsWidth + (symbols.symbolsSpacing * syms.lenght - 1);
}

function writeSymbols(png, symbolArray, offset)
{
	let usedSpace = 0;
	for (let i = 0; i < symbolArray.length; i++)
	{
		let symbol = symbolArray[i];
		let deltaW = i * (symbols.symbolsWidth + symbols.symbolsSpacing);
		for (let y = 0; y < symbols.symbolsHeight; y++) {
			for (let x = 0; x < symbols.symbolsWidth; x++) {
				let idx = (png.width * (y+offset[1]) + (x+offset[0] + deltaW)) << 2;
				let p = symbols.getPixel(symbol, x, y);
				if (p === 1) {
					png.data[idx] = 0x00;
					png.data[idx + 1] = 0x00;
					png.data[idx + 2] = 0x00;
					png.data[idx + 3] = 0xff;
				}
			}
		}

		usedSpace = symbols.symbolsWidth + deltaW;
	}

	return usedSpace;
}

/* png tiles */
app.get("/rastertiles/:z/:x/:y", function(request, response) { 
	var z = request.params.z;
	var x = request.params.x;
	var y = request.params.y;
	var tileId = `${z}, ${x}, ${y}`;
	
	var newfile = new PNG({width:256,height:256});

	for (let y = 0; y < newfile.height; y++) {
		for (let x = 0; x < newfile.width; x++) {
			let idx = (newfile.width * y + x) << 2;

			let col = x < (newfile.width >> 1) ^ y < (newfile.height >> 1) ? 0xe5 : 0xff;

			newfile.data[idx] = col;
			newfile.data[idx + 1] = col;
			newfile.data[idx + 2] = col;
			newfile.data[idx + 3] = 0xff;
		}
	}

	let xOffest = 100;
	const yoffest = 100;
	let usedSpace = writeSymbols(newfile, symbols.getSymbols(''+z), [xOffest, yoffest]);
	xOffest += usedSpace + symbols.symbolsSpacing;
	usedSpace = writeSymbols(newfile, symbols.getSymbols('-'), [xOffest, yoffest]);
	xOffest += usedSpace + symbols.symbolsSpacing;
	usedSpace = writeSymbols(newfile, symbols.getSymbols(''+x), [xOffest, yoffest]);
	xOffest += usedSpace + symbols.symbolsSpacing;
	usedSpace = writeSymbols(newfile, symbols.getSymbols('-'), [xOffest, yoffest]);
	xOffest += usedSpace + symbols.symbolsSpacing;
	usedSpace = writeSymbols(newfile, symbols.getSymbols(''+y), [xOffest, yoffest]);
	
	var options = { colorType: 4 };
	var buffer = PNG.sync.write(newfile, options);

	response.writeHead(200, {
		'Content-Type': 'image/png',
		'Content-Length': buffer.byteLength
	});
	
	response.write(buffer);
    response.end();
});


/* serves all the static files */
app.get(/^(.+)$/, function(req, res){ 
     console.log('static file request : ' + req.params);
     res.sendfile( __dirname + req.params[0]); 
});

// Reload code here
reload(app);

 var port = process.env.PORT || 5000;
 app.listen(port, function() {
   console.log("Listening on " + port);
 })