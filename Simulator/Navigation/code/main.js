var REPLACE_ROBOT_DYNAMICALLY = false;

var COLS = 50, ROWS = 40, 
	CANVAS_WIDTH, CANVAS_HEIGHT, CELL_WIDTH, CELL_HEIGHT,
	SCALE = .5, WHEEL_WIDTH = 4*SCALE, WHEEL_LENGTH = 15*SCALE,
	PI = Math.PI, MAX_ALPHA_ACKERMAN = PI/4, MAX_V = .1, DELTA_V = .04;

var canvas, context;
var grid, polygon, problem, path_lines, robot;
var has_clicked = false, first_pos, last_pos;

window.onload = function() 
{
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	CANVAS_WIDTH = canvas.width;
	CANVAS_HEIGHT = canvas.height;
	CELL_WIDTH = CANVAS_WIDTH/COLS;
	CELL_HEIGHT = CANVAS_HEIGHT/ROWS;
	
	polygons = [
		create_polygon(	
			[{x:385,y:238},
			{x:548,y:222},
			{x:677,y:426},
			{x:301,y:496}]
		),
		create_polygon(
			[{x:103,y:108},
			{x:94,y:380},
			{x:232,y:195}]
		),
		create_polygon(
			[{x:697,y:60},
			{x:665,y:130},
			{x:762,y:294},
			{x:879,y:329},
			{x:911,y:206}] 
		)
	];
	
	circles = [
		create_circle({x:400,y:100}, 50),
		create_circle({x:192,y:434}, 20),
		create_circle({x:64,y:496}, 30),
		create_circle({x:189,y:559}, 15)
	];
	
	grid = new Array(COLS);
	for(var x = 0; x < COLS; x++) {
		grid[x] = new Array(ROWS);
		for(var y = 0; y < ROWS; y++) {
			grid[x][y] = 0;
		}
	}
	
	fillGrid(grid, polygons, circles);
	problem = new BigGridSearchProblem(grid);
	
	robot = ackerman_robot(10*CELL_WIDTH+CELL_WIDTH/2, 
				5*CELL_HEIGHT+CELL_HEIGHT/2, 0, 0, 0, 40*SCALE, 40*SCALE, 0);
	
	setInterval(paintCanvas, 40);
	setInterval(followPath, 100);
};

function clicked(event) {
	var mouseX, mouseY;

    if(event.offsetX) {
        mouseX = event.offsetX;
        mouseY = event.offsetY;
    }
    else if(event.layerX) {
        mouseX = event.layerX-canvas.offsetLeft;
        mouseY = event.layerY-canvas.offsetTop;
    }

	var cur_pos = problem.create_pos(
		Math.round(mouseX/CELL_WIDTH - .5), 
		Math.round(mouseY/CELL_HEIGHT - .5),
		0
	);
	
	if (grid[cur_pos.x][cur_pos.y])
		return;
	
	if (!has_clicked) {
		last_pos = cur_pos;
		
		first_pos = problem.create_pos(
			Math.round(robot.x/CELL_WIDTH - .5), 
			Math.round(robot.y/CELL_HEIGHT - .5),
			0
		);
		
		var path = astar(first_pos, last_pos, problem);
		
		if(path != null) {
			point_list = smooth_path(to_point_list(problem, first_pos, path));
			path_lines = create_lines(point_list);
			
			//has_clicked = true;
		}
	}
}

function fillGrid(grid, polygons, circles) {
	for (var x = 0; x < COLS; x++) {
		for (var y = 0; y < ROWS; y++) {			
			var box = create_polygon([ 
				create_point(x*CELL_WIDTH, y*CELL_HEIGHT),
				create_point(x*CELL_WIDTH, y*CELL_HEIGHT + CELL_HEIGHT),
				create_point(x*CELL_WIDTH + CELL_WIDTH, y*CELL_HEIGHT + CELL_HEIGHT),
				create_point(x*CELL_WIDTH + CELL_WIDTH, y*CELL_HEIGHT) 
			]);
		
			for (var i = 0; i < polygons.length; i++) {
				if (polyIntersectsPoly(box, polygons[i])) {
					grid[x][y] = 1;
					break;
				}
			}
			if (grid[x][y] == 0) {
				for (var i = 0; i < circles.length; i++) {
					if (polyIntersectsCircle(box, circles[i])) {
						grid[x][y] = 1;
						break;
					}
				}
			}
		}
	}
}

function paintCanvas() {
	context.fillStyle = "white";
	context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	
	drawGrid(grid);
	
	context.strokeStyle = "brown";
	for (var i = 0; i < polygons.length; i++) {
		drawPoly(polygons[i]);
	}
	for (var i = 0; i < circles.length; i++) {
		drawCircle(circles[i]);
	} 
	if(path_lines) {
		context.strokeStyle = "purple";
		drawLines(path_lines);
	}
	
	robot.update();
	robot.draw(context);
}

/*
var points = [];

function clicked(event) {
	console.log(event);
	points.push({x:event.offsetX, y:event.offsetY});
	printPoints(points);
}

function printPoints(points) {
	var prefix = "";
	var str = "[";
	for (var i = 0; i < points.length; i++) {
		str += prefix+"{x:"+points[i].x+",y:"+points[i].y+"}";
		prefix = ",\n";
	}
	str += "]";
	console.log(str);
}
*/
