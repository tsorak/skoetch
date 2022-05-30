<script>
	import { onMount } from 'svelte';

	onMount(() => {
		// SETTING ALL VARIABLES

		let isMouseDown = false;
		let canvas = document.getElementById('canvas');
		let body = document.getElementsByTagName('body')[0];
		let ctx = canvas.getContext('2d');
		let linesArray = [];
		let currentSize = 5;
		let currentColor = 'rgb(0,0,255)';
		let currentBg = 'white';

		// INITIAL LAUNCH

		createCanvas();

		// BUTTON EVENT HANDLERS

		document.getElementById('canvasUpdate').addEventListener('click', function () {
			createCanvas();
			redraw();
		});
		document.getElementById('colorpicker').addEventListener('change', function () {
			currentColor = this.value;
		});
		document.getElementById('bgcolorpicker').addEventListener('change', function () {
			ctx.fillStyle = this.value;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			redraw();
			currentBg = ctx.fillStyle;
		});
		document.getElementById('controlSize').addEventListener('change', function () {
			currentSize = this.value;
			document.getElementById('showSize').innerHTML = this.value;
		});
		document.getElementById('saveToImage').addEventListener(
			'click',
			function () {
				downloadCanvas(this, 'canvas', 'masterpiece.png');
			},
			false
		);
		document.getElementById('eraser').addEventListener('click', eraser);
		document.getElementById('clear').addEventListener('click', createCanvas);
		document.getElementById('save').addEventListener('click', save);
		document.getElementById('load').addEventListener('click', load);
		document.getElementById('clearCache').addEventListener('click', function () {
			localStorage.removeItem('savedCanvas');
			linesArray = [];
			console.log('Cache cleared!');
		});

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
			canvas.style.zIndex = 8;
			canvas.style.position = 'absolute';
			canvas.style.border = '1px solid';
			ctx.fillStyle = currentBg;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			body.appendChild(canvas);
		}

		// DOWNLOAD CANVAS

		function downloadCanvas(link, canvas, filename) {
			link.href = document.getElementById(canvas).toDataURL();
			link.download = filename;
		}

		// SAVE FUNCTION

		function save() {
			localStorage.removeItem('savedCanvas');
			localStorage.setItem('savedCanvas', JSON.stringify(linesArray));
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
			let mousePos = getMousePos(canvas, evt);
			isMouseDown = true;
			let currentPosition = getMousePos(canvas, evt);
			ctx.moveTo(currentPosition.x, currentPosition.y);
			ctx.beginPath();
			ctx.lineWidth = currentSize;
			ctx.lineCap = 'round';
			ctx.strokeStyle = currentColor;
		}

		// ON MOUSE MOVE

		function mousemove(canvas, evt) {
			if (isMouseDown) {
				let currentPosition = getMousePos(canvas, evt);
				ctx.lineTo(currentPosition.x, currentPosition.y);
				ctx.stroke();
				store(currentPosition.x, currentPosition.y, currentSize, currentColor);
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

		// ON MOUSE UP

		function mouseup() {
			isMouseDown = false;
			store();
		}
	});
</script>

<div id="sidebar">
	<div class="colorButtons">
		<h3>Colour</h3>
		<input type="color" id="colorpicker" value="#c81464" class="colorpicker" />
	</div>
	<div class="colorButtons">
		<h3>Bg Color</h3>
		<input type="color" value="#ffffff" id="bgcolorpicker" class="colorpicker" />
	</div>

	<div class="toolsButtons">
		<h3>Tools</h3>
		<button id="eraser" class="btn btn-default"
			>➖<span class="glyphicon glyphicon-erase" aria-hidden="true" /></button
		>
		<button id="clear" class="btn btn-danger"
            >🚮<span class="glyphicon glyphicon-repeat" aria-hidden="true" /></button
		>
	</div>

	<div class="buttonSize">
		<h3>Size (<span id="showSize">5</span>)</h3>
		<input type="range" min="1" max="50" value="5" step="1" id="controlSize" />
	</div>

	<div class="canvasSize">
		<h3>Canvas</h3>
		<div class="input-group">
			<span class="input-group-addon">X</span>
			<input type="number" id="sizeX" class="form-control size" placeholder="sizeX" value="800" />
		</div>
		<div class="input-group">
			<span class="input-group-addon">Y</span>
			<input type="number" id="sizeY" class="form-control size" placeholder="sizeY" value="800" />
		</div>
		<input type="button" class="updateSize btn btn-success" value="Update" id="canvasUpdate" />
	</div>
	<div class="Storage">
		<h3>Storage</h3>
		<input type="button" value="Save" class="btn btn-warning" id="save" />
		<input type="button" value="Load" class="btn btn-warning" id="load" />
		<input type="button" value="Clear" class="btn btn-warning" id="clearCache" />
	</div>
	<div class="extra">
		<h3>Extra</h3>
		<a id="saveToImage" class="btn btn-warning">Download</a>
	</div>
</div>
<canvas id="canvas" />