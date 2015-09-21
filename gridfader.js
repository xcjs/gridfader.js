var GridFader = function(canvasId) {
	'use strict';

	this.palette = new Array();
	this.gridColor = null;	
	this.canvas = null;
	this.brush = null;
	this.cellSize = 0;
	this.maxCellOpacity = 1.0;
	this.gridSize = 0;
	this.clockSpeed = 500;
	this.fadeStep = .001;
	this.cycleSize = 7;

	var self = this;	

	var clock = 0;
	var clockCycle = 0;

	this.BindEvents = function() {
		window.addEventListener('load', Events.Init, false);
		window.addEventListener('resize', Events.Resize, false)
	};

	this.ColorManagement = {
		Color: function(obj) {
			this.r = 0;
			this.g = 0;
			this.b = 0;
			this.a = 1;

			if(typeof obj !== 'undefined')
			{
				this.r = obj.r;
				this.g = obj.g;
				this.b = obj.b;
				this.a = typeof obj.a === 'undefined' ? this.a : obj.a;
			}					

			this.Darken = function(amount) {
				var darkerColor = new self.ColorManagement.Color();

				darkerColor.r = Math.floor(this.r - amount >= 0 ? this.r - amount : 0);
				darkerColor.g = Math.floor(this.g - amount >= 0 ? this.g - amount : 0);
				darkerColor.b = Math.floor(this.b - amount >= 0 ? this.b - amount : 0);

				darkerColor.a = this.a;

				return darkerColor;
			};

			this.toString = function() {
				return 'rgba(' + Math.floor(this.r) + ', ' + Math.floor(this.g) + ', ' + Math.floor(this.b) + ', ' + this.a + ')';
			};	
		},

		GetRandomColor: function() {
			var palette = self.palette;

			var index = Math.floor(Math.random() * (palette.length - 1 - 0 + 1)) + 0;
			return palette[index];
		}
	};

	var Environment = {
		SetCanvasSize: function() {
			self.canvas.height = self.canvas.clientHeight;
			self.canvas.width = self.canvas.clientWidth;
		}
	};

	var Events = {
		Init: function() {
			self.canvas = document.getElementById(canvasId);
			self.brush = self.canvas.getContext('2d');

			Events.Resize();
		},

		Resize: function() {
			clearInterval(clock);

			Environment.SetCanvasSize();
			self.DrawGrid();
			self.CellManagement.GetAllCells();
			
			clock = setInterval(Events.Tick, self.clockSpeed);
		},

		Tick: function()  {
			if(clockCycle === self.cycleSize) {
				var cell = self.CellManagement.GetRandomCell();

				if(cell.State === null) {
					cell.FadeIn();
				}
				else if(cell.State === cell.States.Full) {
					cell.FadeOut();
				}

				clockCycle = 0;
			}
			else
			{
				clockCycle++;
			}

			var i = 0;
			var cells = self.CellManagement.Cells;

			while(i < cells.length) {
				var cell = cells[i];

				if(cell.State === cell.States.FadingIn) {
					cell.FadeIn();
					cell.Draw();
				}
				else if(cell.State === cell.States.FadingOut) {
					cell.FadeOut();
					if(cell.State !== null) {
						cell.Draw();
					}
				}

				i++;
			}
		}
	};

	this.DrawGrid = function() {	
		var brush = self.brush;
		var canvas = self.canvas;
		var gridColor = self.gridColor;
		var gridSize = self.gridSize;
		var cellSize = self.cellSize;

		var i = 0;
		var startingPoint = 0;							

		brush.beginPath();

		brush.strokeStyle = gridColor.toString();
		brush.lineWidth = gridSize;

		while(startingPoint < canvas.height) {
			startingPoint = cellSize * i;						

			brush.moveTo(0, startingPoint);	

			brush.lineTo(canvas.width, startingPoint);						

			i++;
		}								

		i = 0;
		startingPoint = gridSize;

		while(startingPoint < canvas.width) {
			startingPoint = cellSize * i;

			brush.moveTo(startingPoint, 0);

			brush.lineTo(startingPoint, canvas.height);						

			i++;
		}

		brush.stroke();

		brush.closePath();									
	};

	this.CellManagement = {
		Cell: function() {
			this.Color = null;
			this.Length = 0;
			this.X = 0;
			this.Y = 0;

			this.State = null;

			this.Clear = function() {
				self.brush.clearRect(this.X, this.Y, this.Length, this.Length);
			};

			this.Destroy = function() {							
				this.Clear();
				this.Color = null;
				this.State = null;
			};

			this.Draw = function() {
				var brush = self.brush;
				var cellSize = self.cellSize;

				var grd = brush.createRadialGradient(
	      			this.X + this.Length / 2, this.Y + this.Length / 2, 0, 
	      			this.X + this.Length / 2, this.Y + this.Length / 2, cellSize);

				this.Clear();
					
				brush.beginPath();

				grd.addColorStop(0, this.Color);
				grd.addColorStop(1, this.Color.Darken(64));
		    	
				brush.fillStyle = grd;
				brush.fillRect(this.X, this.Y, this.Length, this.Length);	
				
				brush.stroke();

				brush.closePath();
				brush.fillStyle = null;
			}

			this.FadeIn = function() {
				this.State = this.States.FadingIn;

				if(this.Color === null) {
					this.Color = self.ColorManagement.GetRandomColor();
					this.Color.a = 0.0;
				}
				else if(this.Color.a >= self.maxCellOpacity) {
					this.State = this.States.Full;
				}
				else {
					this.Color.a += self.fadeStep;
				}										
			};

			this.FadeOut = function() {
				this.State = this.States.FadingOut;

				if(this.Color.a >= self.fadeStep)
				{
					this.Color.a -= self.fadeStep;
				}
				else
				{
					this.Destroy();
				}														
			};

			this.States = {
				FadingIn: 'FadingIn',
				FadingOut: 'FadingOut',
				Full: 'Full'
			};
		},

		Cells: new Array(),

		GetAllCells: function() {
			var cellSize = self.cellSize;
			var gridSize = self.gridSize;

			var xCells = Math.ceil(window.innerWidth / cellSize);
			var yCells = Math.ceil(window.innerHeight / cellSize);

			var ix = 0;
			var iy = 0;

			while(iy < yCells)
			{
				while(ix < xCells)
				{
					var cell = new self.CellManagement.Cell();
					cell.X = ix * cellSize + gridSize - 2;		// Subtract 2 since the border center overlaps on the middle pixel.
					cell.Y = iy * cellSize + gridSize - 2;		// Subtract 2 since the border center overlaps on the middle pixel.
					cell.Length = cellSize - gridSize * 2 + 4;	// Add 4 to compensate for 2 pixels on each side being lost to border overlap.

					self.CellManagement.Cells.push(cell);

					ix++;
				}

				iy++;
				ix = 0;
			}
		},

		GetRandomCell: function() {
			var index = Math.floor(Math.random() * (self.CellManagement.Cells.length - 1 - 0 + 1)) + 0;
			var randomCell = self.CellManagement.Cells[index];
			
			return randomCell;
		}
	}
};
