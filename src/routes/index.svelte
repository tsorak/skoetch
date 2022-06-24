<script>
	import { onMount } from 'svelte';

	onMount(() => {
		let socket = new WebSocket('ws://' + window.location.hostname + ':8080');

		socket.addEventListener('message', (e) => {
			const parsedData = JSON.parse(e.data);
			console.dir(parsedData);
			if (Array.isArray(parsedData)) {
				initialRedraw(parsedData);
			} else if (typeof parsedData === 'object') {
				// console.dir(linesArray[linesArray.length - 1]);
				drawIncomingLine(parsedData);
			} else {
				console.error('wtf is this? -->', parsedData);
			}
		});

		socket.addEventListener('open', (e) => {
			console.log(e);
		});

		socket.addEventListener('close', (e) => {
			console.log('CLOSED:', e);
		});

		function sendLineOverSocket(line) {
			socket.send(JSON.stringify(line));
		}

		// SETTING ALL VARIABLES

		let isMouseDown = false;
		let canvas = document.getElementById('canvas');
		let body = document.getElementsByTagName('body')[0];
		let ctx = canvas.getContext('2d');
		let linesArray = [];
		let currentSize = 5;
		let currentColor = 'rgb(0,0,255)';
		let currentBg = 'white';

		let updateRate = 15;
		let allowedToDraw = true;

		// INITIAL LAUNCH

		createCanvas();

		// BUTTON EVENT HANDLERS

		document.getElementById('canvasUpdate').addEventListener('click', function () {
			createCanvas();
			// redraw();
		});
		document.getElementById('colorpicker').addEventListener('change', function () {
			currentColor = this.value;
		});
		document.getElementById('bgcolorpicker').addEventListener('change', function () {
			// ctx.fillStyle = this.value;
			// ctx.fillRect(0, 0, canvas.width, canvas.height);
			// redraw();
			// currentBg = ctx.fillStyle;
		});
		document.getElementById('controlSize').addEventListener('change', function () {
			currentSize = this.value;
			document.getElementById('showSize').innerHTML = this.value;
		});
		document.getElementById('saveToImage').addEventListener(
			'click',
			(e) => {
				downloadCanvas(e.target, 'canvas', 'masterpiece.png');
			},
			false
		);
		document.getElementById('eraser').addEventListener('click', eraser);
		document.getElementById('clear').addEventListener('click', createCanvas);
		// document.getElementById('save').addEventListener('click', save);
		// document.getElementById('load').addEventListener('click', load);
		// document.getElementById('clearCache').addEventListener('click', function () {
		// 	localStorage.removeItem('savedCanvas');
		// 	linesArray = [];
		// 	console.log('Cache cleared!');
		// });

		// REDRAW

		function redraw() {
			for (let i = 1; i < linesArray.length; i++) {
				ctx.beginPath();
				ctx.moveTo(linesArray[i - 1].x, linesArray[i - 1].y);
				ctx.lineWidth = linesArray[i].size;
				ctx.lineCap = 'round';
				ctx.strokeStyle = linesArray[i].color;
				ctx.lineTo(linesArray[i].x, linesArray[i].y);
				ctx.stroke();
			}
		}

		function initialRedraw(data) {
			for (let i = 1; i < data.length; i++) {
				ctx.beginPath();
				ctx.moveTo(data[i - 1].x, data[i - 1].y);
				ctx.lineWidth = data[i].size;
				ctx.lineCap = 'round';
				ctx.strokeStyle = data[i].color;
				ctx.lineTo(data[i].x, data[i].y);
				ctx.stroke();
			}
			linesArray = data;
		}

		function drawIncomingLine(line) {
			const lastLine = linesArray[linesArray.length - 1] ? linesArray[linesArray.length - 1] : {};

			if (line !== {}) {
				if (Object.keys(lastLine).length === 0) {
					//WE'RE STARTING A NEW LINE (INCOMING SOCKET HAS CLICKED AND IS HOLDING MOUSE0 DOWN)
					ctx.beginPath();
					ctx.moveTo(line.x, line.y);
					ctx.lineWidth = line.size;
					ctx.lineCap = 'round';
					ctx.strokeStyle = line.color;
				} else if (Object.keys(lastLine).length === 4) {
					ctx.lineTo(line.x, line.y);
					ctx.stroke();
				}
			}

			linesArray.push(line);
			// if (Object.keys(line).length === 4) {
			// 	ctx.lineTo(line.x, line.y);
			// 	ctx.stroke();
			// }
			// if (line === {}) {
			// 	//SOCKET HAS LET GO OF MOUSE0
			// }
			// if (Object.keys(line).length == 0) {
			// 	if (linesArray.length > 0) {

			// 	}
			// } else {
			// 	let currentPosition = getMousePos(canvas, evt);
			// 	// ctx.moveTo(currentPosition.x, currentPosition.y);
			// 	// ctx.beginPath();
			// 	// ctx.lineWidth = currentSize;
			// 	// ctx.lineCap = 'round';
			// 	// ctx.strokeStyle = currentColor;

			// 	// ctx.lineTo(currentPosition.x, currentPosition.y);
			// 	// ctx.stroke();
			// }
		}

		// DRAWING EVENT HANDLERS

		canvas.addEventListener('mousedown', function () {
			mousedown(canvas, event);
		});
		canvas.addEventListener('mousemove', function () {
			mousemove(canvas, event);
		});
		canvas.addEventListener('mouseup', mouseup);

		// CREATE CANVAS

		function createCanvas() {
			canvas.id = 'canvas';
			canvas.width = parseInt(document.getElementById('sizeX').value);
			canvas.height = parseInt(document.getElementById('sizeY').value);
			// canvas.style.zIndex = 8;
			// canvas.style.position = 'absolute';
			canvas.style.border = '1px solid';
			ctx.fillStyle = currentBg;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			// body.appendChild(canvas);
		}

		// DOWNLOAD CANVAS

		function downloadCanvas(link, canvas, filename) {
			link.href = document.getElementById(canvas).toDataURL();
			link.download = filename;
		}

		// SAVE FUNCTION

		function save() {
			localStorage.removeItem('savedCanvas');
			// localStorage.setItem('savedCanvas', JSON.stringify(linesArray));
			console.log('Saved canvas!');
		}

		// LOAD FUNCTION

		function load() {
			if (localStorage.getItem('savedCanvas') != null) {
				linesArray = JSON.parse(localStorage.savedCanvas);
				let lines = JSON.parse(localStorage.getItem('savedCanvas'));
				for (let i = 1; i < lines.length; i++) {
					ctx.beginPath();
					ctx.moveTo(linesArray[i - 1].x, linesArray[i - 1].y);
					ctx.lineWidth = linesArray[i].size;
					ctx.lineCap = 'round';
					ctx.strokeStyle = linesArray[i].color;
					ctx.lineTo(linesArray[i].x, linesArray[i].y);
					ctx.stroke();
				}
				console.log('Canvas loaded.');
			} else {
				console.log('No canvas in memory!');
			}
		}

		// ERASER HANDLING

		function eraser() {
			currentSize = 50;
			currentColor = ctx.fillStyle;
		}

		// GET MOUSE POSITION

		function getMousePos(canvas, evt) {
			let rect = canvas.getBoundingClientRect();
			return {
				x: evt.clientX - rect.left,
				y: evt.clientY - rect.top
			};
		}

		// ON MOUSE DOWN

		function mousedown(canvas, evt) {
			// let mousePos = getMousePos(canvas, evt);
			isMouseDown = true;
			// let currentPosition = getMousePos(canvas, evt);
			// ctx.moveTo(currentPosition.x, currentPosition.y);
			// ctx.beginPath();
			// ctx.lineWidth = currentSize;
			// ctx.lineCap = 'round';
			// ctx.strokeStyle = currentColor;
		}

		// ON MOUSE MOVE

		function mousemove(canvas, evt) {
			if (isMouseDown && allowedToDraw) {
				allowedToDraw = false;
				let currentPosition = getMousePos(canvas, evt);
				// ctx.lineTo(currentPosition.x, currentPosition.y);
				// ctx.stroke();
				// store(currentPosition.x, currentPosition.y, currentSize, currentColor);

				// console.log(linesArray);

				sendLineOverSocket(
					compileLine(currentPosition.x, currentPosition.y, currentSize, currentColor)
				);

				setTimeout(() => {
					allowedToDraw = true;
					// console.log("XD");
				}, 1000 / updateRate);
			}
		}

		// STORE DATA

		function store(x, y, s, c) {
			let line = {
				x: x,
				y: y,
				size: s,
				color: c
			};
			linesArray.push(line);
		}

		//COMPILE LINE DATA

		function compileLine(x, y, s, c) {
			const line = {
				x: x,
				y: y,
				size: s,
				color: c
			};
			return line;
		}

		// ON MOUSE UP

		function mouseup() {
			isMouseDown = false;
			store();
			sendLineOverSocket({});
		}

		document.getElementById('save')?.addEventListener('click', () => save());
		document.getElementById('load')?.addEventListener('click', () => load());
		document.getElementById('clearCache')?.addEventListener('click', function () {
			localStorage.removeItem('savedCanvas');
			linesArray = [];
			console.log('Cache cleared!');
		});
	});
</script>

<div class="bg-neutral-200 min-h-screen">
	<div id="sidebar" class="px-2 flex gap-4 bg-gray-600 text-neutral-200">
		<div class="">
			<h3>Colour</h3>
			<input type="color" id="colorpicker" value="#c81464" class="" />
		</div>
		<div class="">
			<h3>Bg Color</h3>
			<input type="color" value="#ffffff" id="bgcolorpicker" class="" />
		</div>

		<div class="">
			<h3>Tools</h3>
			<button id="eraser" class="">➖<span class="" aria-hidden="true" /></button>
			<button id="clear" class="">🚮<span class="" aria-hidden="true" /></button>
		</div>

		<div class="">
			<h3>Size (<span id="showSize">5</span>)</h3>
			<input type="range" min="1" max="50" value="5" step="1" id="controlSize" />
		</div>

		<div class="">
			<h3>Canvas</h3>
			<div class="flex">
				<div class="">
					<label for="sizeX" class="">X</label>
					<input type="number" id="sizeX" class="w-14" placeholder="sizeX" value="800" />
				</div>
				<div class="">
					<label for="sizeY" class="">Y</label>
					<input type="number" id="sizeY" class="w-14" placeholder="sizeY" value="800" />
				</div>
				<input type="button" class="" value="Update" id="canvasUpdate" />
			</div>
		</div>
		<div class="">
			<h3>Storage</h3>
			<input type="button" value="Save" class="cursor-pointer" id="save" />
			<input type="button" value="Load" class="cursor-pointer" id="load" />
			<input type="button" value="Clear" class="cursor-pointer" id="clearCache" />
		</div>
		<div class="">
			<!-- <h3>Extra</h3> -->
			<a id="saveToImage" class="">Download</a>
		</div>
	</div>
	<canvas id="canvas" class="m-2" />
	<p id="linesDebug">xd</p>
</div>
