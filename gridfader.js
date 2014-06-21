var GridFader = function(canvasId) {
	var canvas;
	var brush;				

	var boxSize;

	var gridSize;
	var gridColor;

	var palette = new Array();				

	var clock = 0;
	var clockCycle = 0;
	var clockSpeed = 500;

	this.Init = function() {
		boxSize = 50;

		gridSize = 5;
		gridColor = new ColorManagement.Color({ r: 255, g: 255, b: 255, a: .1 });

		palette.push(new ColorManagement.Color({ r: 228, g: 77, b: 38 }));	// HTML5 Orange
		palette.push(new ColorManagement.Color({ r: 2, g: 112, b: 187 }));	// CSS3 Blue
		palette.push(new ColorManagement.Color({ r: 214, g: 186, b: 51 }));	// JavaScript Yellow

		window.onload = Events.Init;
		window.onresize = Events.Resize;
	};

	var ColorManagement = {
		Color: function(obj) {
			var self = this;

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
				darkerColor = new ColorManagement.Color();

				darkerColor.r = Math.floor(self.r - amount >= 0 ? self.r - amount : 0);
				darkerColor.g = Math.floor(self.g - amount >= 0 ? self.g - amount : 0);
				darkerColor.b = Math.floor(self.b - amount >= 0 ? self.b - amount : 0);

				darkerColor.a = self.a;

				return darkerColor;
			};

			this.toString = function() {
				return 'rgba(' + self.r + ', ' + self.g + ', ' + self.b + ', ' + self.a + ')';
			};	
		},

		GetRandomColor: function() {
			var index = Math.floor(Math.random() * (palette.length - 1 - 0 + 1)) + 0;
			var refColor = palette[index];

			var color = new ColorManagement.Color();
			color.r = refColor.r;
			color.g = refColor.g;
			color.b = refColor.b;
			color.a = refColor.a;

			return color;
		}
	};

	var Environment = {
		SetCanvasSize: function() {
			canvas.height = window.innerHeight;
			canvas.width = window.innerWidth;
		}
	};

	var Events = {
		Init: function() {
			canvas = document.getElementById(canvasId);
			brush = canvas.getContext('2d');

			Events.Resize();
		},

		Resize: function() {
			clearInterval(clock);

			Environment.SetCanvasSize();
			DrawGrid();
			SquareManagement.GetAllSquares();
			
			clock = setInterval(Events.Tick, clockSpeed);
		},

		Tick: function()  {
			if(clockCycle === 7) {
				var square = SquareManagement.GetRandomSquare();

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
			var squares = SquareManagement.Squares;

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

	var DrawGrid = function() {	
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

	var SquareManagement = {
		Square: function() {
			var self = this;

			this.Color = null;
			this.Length = 0;
			this.X = 0;
			this.Y = 0;

			this.State = null;

			this.Clear = function() {
				brush.clearRect(self.X, self.Y, self.Length, self.Length);
			};

			this.Destroy = function() {							
				self.Clear();
				self.Color = null;
				self.State = null;
			};

			this.Draw = function() {
				var grd = brush.createRadialGradient(
	      			self.X + self.Length / 2, self.Y + self.Length / 2, 0, 
	      			self.X + self.Length / 2, self.Y + self.Length / 2, boxSize);

				self.Clear();
					
				brush.beginPath();

				grd.addColorStop(0, self.Color);
      			grd.addColorStop(1, self.Color.Darken(64));
		    	
		    	brush.fillStyle = grd;
		    	brush.fillRect(self.X, self.Y, self.Length, self.Length);	
				
				brush.stroke();

				brush.closePath();
				brush.fillStyle = null;
			}

			this.FadeIn = function() {
				self.State = self.States.FadingIn;

				if(self.Color === null) {
					self.Color = ColorManagement.GetRandomColor();
					self.Color.a = 0.0;
				}
				else if(self.Color.a >= 0.5) {
					self.State = self.States.Full;
				}
				else {
					self.Color.a += .01;
				}										
			};

			this.FadeOut = function() {
				if(self.Color.a >= .01)
				{
					self.State = self.States.FadingOut;
					self.Color.a -= .01;
				}
				else
				{
					self.Destroy();
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
			var xSquares = Math.ceil(window.innerWidth / boxSize);
			var ySquares = Math.ceil(window.innerHeight / boxSize);

			ix = 0;
			iy = 0;

			while(iy < ySquares)
			{
				while(ix < xSquares)
				{
					box = new SquareManagement.Square();
					box.X = ix * boxSize + gridSize - 2;		// Subtract 2 since the border center overlaps on the middle pixel.
					box.Y = iy * boxSize + gridSize - 2;		// Subtract 2 since the border center overlaps on the middle pixel.
					box.Length = boxSize - gridSize * 2 + 4;	// Add 4 to compensate for 2 pixels on each side being lost to border overlap.

					SquareManagement.Squares.push(box);

					ix++;
				}

				iy++;
				ix = 0;
			}
		},

		GetRandomSquare: function() {
			var index = Math.floor(Math.random() * (SquareManagement.Squares.length - 1 - 0 + 1)) + 0;
			var randomSquare = SquareManagement.Squares[index];
			
			return randomSquare;
		}
	}
};