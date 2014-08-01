gridfader.js
============
gridfader.is is a JavaScript object that creates a grid of cells on a provided canvas element that randomly fade in using one random color from a provided palette.

Demo
----
A viewable demo is available at [http://xcjs.github.com/gridfader.js/](http://xcjs.github.com/gridfader.js/)


Usage
-----
The object is designed to handle all of its own event bindings itself once initialized:

    (function() {
		var fader = new GridFader('gridfader');

		fader.palette.push(new fader.ColorManagement.Color({ r: 32, g: 48, b: 51 }));		
		fader.palette.push(new fader.ColorManagement.Color({ r: 95, g: 104, b: 84 }));		
		fader.palette.push(new fader.ColorManagement.Color({ r: 115, g: 142, b: 165 }));		
		fader.palette.push(new fader.ColorManagement.Color({ r: 202, g: 178, b: 161 }));		
		fader.palette.push(new fader.ColorManagement.Color({ r: 236, g: 238, b: 244 }));		

		fader.gridColor = new fader.ColorManagement.Color({ r: 0, g: 0, b: 0, a: .5 });

		fader.cellSize = 48;
		fader.gridSize = 5;
		fader.fadeStep = .001;

		fader.clockSpeed = 3;

		fader.BindEvents();
	})();

Once all of the required properties are assigned, BindEvents will need to be called.

Constructor Arguments
---------------------

    var fader = new GridFader('canvasId');
    
The constructor only takes the ID of the affected canvas element.

Public Properties
-----------------

<table>
    <thead>
        <tr>
            <th style="text-align: left;">Property</th>
            <th style="text-align: left;">Type</th>
            <th style="text-align: left;">Required?</th>
            <th style="text-align: left;">About</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="vertical-align: top;">
                palette
            </td>
            <td style="vertical-align: top;">
                Array&lt;GridFader.ColorManager.Color&gt;
            </td>
            <td style="text-align: center; vertical-align: top;">
                ✓
            </td>
            <td style="vertical-align: top;">
                <p>
                    An array of colors that gridfader.js will randomly select from.
                </p>
            
                <p>
                    palette is already an array and simply needs items pushed onto it.
                </p>
                
                <p>
                    Items should be from gridfader.js's ColorManagement.Color object.
                </p>
                <p>
                    Example:
                </p>                
<pre><code>
fader.palette.push(new gridFaderObject.ColorManagement.Color({ r: 32, g: 48, b: 51 }));
</code></pre>
            </td>
        </tr>
        <tr>
            <td style="vertical-align: top;">
                gridColor
            </td>
            <td style="vertical-align: top;">
                GridFader.ColorManagement.Color
            </td>
            <td style="text-align: center; vertical-align: top;">
                ✓
            </td>
            <td style="vertical-align: top;">
                Grid color drawn onto the gridfader.js canvas.
            </td>
        </tr>
        <tr>
            <td style="vertical-align: top;">
                cellSize
            </td>
            <td style="vertical-align: top;">
                Integer
            </td>
            <td style="text-align: center; vertical-align: top;">
                ✓
            </td>
            <td style="vertical-align: top;">
                The length/width of each grid cell to be filled with color.
            </td>
        </tr>
        <tr>
            <td style="vertical-align: top;">
                gridSize
            </td>
            <td style="vertical-align: top;">
                Integer
            </td>
            <td style="text-align: center; vertical-align: top;">
                ✓
            </td>
            <td style="vertical-align: top;">
                The width of the grid drawn by gridfader.js. Keep in mind that the center
                pixel(s) overlap in even widths, so the grid width may not be the intended
                width.
            </td>
        </tr>
        <tr>
            <td style="vertical-align: top;">
                fadeStep
            </td>
            <td style="vertical-align: top;">
                Float
            </td>
            <td style="text-align: center; vertical-align: top;">
                
            </td>
            <td style="vertical-align: top;">
                Any decimal between 0.0 and 1.0 - this is translated to as the CSS RGBA
                alpha value for the cell color added or subtracted during each tick of
                the clock. The default value is .001.
            </td>
        </tr>
        <tr>
            <td style="vertical-align: top;">
                clockSpeed
            </td>
            <td style="vertical-align: top;">
                Integer
            </td>
            <td style="text-align: center; vertical-align: top;">
                
            </td>
            <td style="vertical-align: top;">
                The animation clock speed in milliseconds - gridfader.js attempts to animate                 
                every cell in the grid within this amount of time. The default value is 500.
            </td>
        </tr>
    </tbody>
</table>

Public Methods
--------------

<table>
    <thead>
        <tr>
            <th style="text-align: left;">Method</th>
            <th style="text-align: left;">About</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                BindEvents()
            </td>
            <td>
                Once all of the properties have been set, call
                BindEvents() to start gridfader.js.
            </td>
        <tr>
   </tbody>
</table>
