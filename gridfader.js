'use strict';

var GridFader = function(canvasId) {
	this.palette = new Array();
	this.gridColor = null;	
	this.canvas;
	this.brush;
	this.boxSize;
	this.gridSize;

	var self = this;	

	var clock = 0;
	var clockCycle = 0;
	var clockSpeed = 500;

	this.BindEvents = function() {
		window.onload = Events.Init;
		window.onresize = Events.Resize;
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
			var refColor = palette[index];

			var color = new self.ColorManagement.Color();
			color.r = refColor.r;
			color.g = refColor.g;
			color.b = refColor.b;
			color.a = refColor.a;

			return color;
		}
	};

	var Environment = {
		SetCanvasSize: function() {
			self.canvas.height = window.innerHeight;
			self.canvas.width = window.innerWidth;
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
			self.SquareManagement.GetAllSquares();
			
			clock = setInterval(Events.Tick, clockSpeed);
		},

		Tick: function()  {
			if(clockCycle === 7) {
				var square = self.SquareManagement.GetRandomSquare();

				if(square.State === null) {
					square.FadeIn();
				}
				else if(square.State === square.States.Full) {
					square.FadeOut();
				}

				clockCycle = 0;
			}
			else
			{
				clockCycle++;
			}

			var i = 0;
			var squares = self.SquareManagement.Squares;

			while(i < squares.length) {
				var square = squares[i];

				if(square.State === square.States.FadingIn) {
					square.FadeIn();
					square.Draw();
				}
				else if(square.State === square.States.FadingOut) {
					square.FadeOut();
					if(square.State !== null) {
						square.Draw();
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
		var boxSize = self.boxSize;

		var i = 0;
		var startingPoint = 0;							

		brush.beginPath();

		brush.strokeStyle = gridColor.toString();
		brush.lineWidth = gridSize;

		while(startingPoint < canvas.height) {
			startingPoint = boxSize * i;						

			brush.moveTo(0, startingPoint);	

			brush.lineTo(canvas.width, startingPoint);						

			i++;
		}								

		i = 0;
		startingPoint = gridSize;

		while(startingPoint < canvas.width) {
			startingPoint = boxSize * i;

			brush.moveTo(startingPoint, 0);

			brush.lineTo(startingPoint, canvas.height);						

			i++;
		}

		brush.stroke();

		brush.closePath();									
	};

	this.SquareManagement = {
		Square: function() {
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
				var boxSize = self.boxSize;

				var grd = brush.createRadialGradient(
	      			this.X + this.Length / 2, this.Y + this.Length / 2, 0, 
	      			this.X + this.Length / 2, this.Y + this.Length / 2, boxSize);

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
				else if(this.Color.a >= 0.5) {
					this.State = this.States.Full;
				}
				else {
					this.Color.a += .01;
				}										
			};

			this.FadeOut = function() {
				if(this.Color.a >= .01)
				{
					this.State = this.States.FadingOut;
					this.Color.a -= .01;
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

		Squares: new Array(),

		GetAllSquares: function() {
			var boxSize = self.boxSize;
			var gridSize = self.gridSize;

			var xSquares = Math.ceil(window.innerWidth / boxSize);
			var ySquares = Math.ceil(window.innerHeight / boxSize);

			var ix = 0;
			var iy = 0;

			while(iy < ySquares)
			{
				while(ix < xSquares)
				{
					var box = new self.SquareManagement.Square();
					box.X = ix * boxSize + gridSize - 2;		// Subtract 2 since the border center overlaps on the middle pixel.
					box.Y = iy * boxSize + gridSize - 2;		// Subtract 2 since the border center overlaps on the middle pixel.
					box.Length = boxSize - gridSize * 2 + 4;	// Add 4 to compensate for 2 pixels on each side being lost to border overlap.

					self.SquareManagement.Squares.push(box);

					ix++;
				}

				iy++;
				ix = 0;
			}
		},

		GetRandomSquare: function() {
			var index = Math.floor(Math.random() * (self.SquareManagement.Squares.length - 1 - 0 + 1)) + 0;
			var randomSquare = self.SquareManagement.Squares[index];
			
			return randomSquare;
		}
	}
};