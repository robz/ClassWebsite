var REPLACE_ROBOT_DYNAMICALLY = false;

var COLS = 50, ROWS = 40, 
	CANVAS_WIDTH, CANVAS_HEIGHT, CELL_WIDTH, CELL_HEIGHT,
	SCALE = .5, WHEEL_WIDTH = 4*SCALE, WHEEL_LENGTH = 15*SCALE,
	PI = Math.PI, MAX_ALPHA_ACKERMAN = PI/3, MAX_V = .1;

var canvas, context;
var grid, polygon, problem, path_lines, robot, point_list;
	
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
	
	robot = ackerman_robot(10*CELL_WIDTH+CELL_WIDTH/2, 5*CELL_HEIGHT+CELL_HEIGHT/2, 0, 0, 0, 40*SCALE, 40*SCALE, 0);
	
	//drawGrid(grid);
	for (var i = 0; i < polygons.length; i++) {
		drawPoly(polygons[i]);
	}
	for (var i = 0; i < circles.length; i++) {
		drawCircle(circles[i]);
	} 
	
	setInterval(paintCanvas, 30);
	setInterval(lineFollow, 100);
};

function paintCanvas() {
	context.fillStyle = "white";
	context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	
	for (var i = 0; i < polygons.length; i++) {
		drawPoly(polygons[i]);
	}
	for (var i = 0; i < circles.length; i++) {
		drawCircle(circles[i]);
	} 
	if(point_list) {
		draw_point_lists(point_list);
	}
	
	if (REPLACE_ROBOT_DYNAMICALLY) {
		robot = robot.update();
	} else {
		robot.update();
	}
	
	robot.draw(context);
}

var old_error;
var accelerated = false;
function lineFollow() {
	var p = 1, d = 1;
	if(path_lines) {
		var dest = path_lines[path_lines.length-1].p2;
		if (euclidDist(create_point(robot.x, robot.y), dest) < 20) {
			path_lines = null;
			robot.accelerate(-MAX_V);
			accelerated = false;
			return;
		}
	
		if (!accelerated) {
			robot.accelerate(MAX_V);
			accelerated = true;
		}
		
		var error = getLineError(robot, path_lines);
		if(!error) return;
		
		if(!old_error)
			old_error = error;
		
		var delta_steering_angle = -p*error + -d*(error - old_error);
		old_error = error;
		
		if (delta_steering_angle != 0) {
			robot.steer(delta_steering_angle);
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

function drawCircle(circle) {
	context.lineWidth = 3;
	context.strokeStyle = "orange";
	context.beginPath();
	context.arc(circle.c.x, circle.c.y, circle.r, 0, 2*Math.PI, true);
	context.stroke();
}

function drawGrid(grid) {
	for (var x = 0; x < COLS; x++) {
		for (var y = 0; y < ROWS; y++) {
			if (grid[x][y]) {
				context.fillStyle = "lightGray";
				context.fillRect(x*CELL_WIDTH, y*CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
			} else {
				context.fillStyle = "white";
				context.fillRect(x*CELL_WIDTH, y*CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
			}
		}
	}

	context.lineWidth = 1;
	context.strokeStyle = "lightGray";
	
	for (var x = 0; x <= COLS; x++) {
		context.moveTo(x*CELL_WIDTH, 0);
		context.lineTo(x*CELL_WIDTH, CANVAS_HEIGHT);
		context.stroke();
	}
	
	for (var y = 0; y <= ROWS; y++) {
		context.moveTo(0, y*CELL_HEIGHT);
		context.lineTo(CANVAS_WIDTH, y*CELL_HEIGHT);
		context.stroke();
	}
}

function drawPoly(polygon) {
	var points = polygon.points;
	context.lineWidth = 3;
	context.strokeStyle = "orange";
	context.beginPath();
	context.moveTo(points[0].x, points[0].y);
	for (i = 1; i < points.length; i++) {
		context.lineTo(points[i].x, points[i].y);
	}
	context.closePath();
	context.stroke();
}

function draw_point_lists(point_list) 
{
	context.lineWidth = 2;
	context.strokeStyle = "green";
	draw_lines(smooth_path(point_list));
}

function draw_lines(point_list) 
{
	context.beginPath();
	context.moveTo(point_list[0].x, point_list[0].y);
	for(var i = 1; i < point_list.length; i++) {
		context.lineTo(point_list[i].x, point_list[i].y);
	}
	context.stroke();
}

var has_clicked = false, first_pos, last_pos;
	
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
		
		//drawGrid(grid);
		for(var i = 0; i < polygons.length; i++) {
			drawPoly(polygons[i]);
		}
		
		if(path != null) {
			context.fillStyle = "lightBlue";
			context.beginPath();
			context.arc(cur_pos.x*CELL_WIDTH+CELL_WIDTH/2, 
						cur_pos.y*CELL_HEIGHT+CELL_HEIGHT/2, 
						(CELL_WIDTH+CELL_HEIGHT)/2, 
						0, 2*Math.PI, true);
			context.fill();
			
			point_list = to_point_list(problem, first_pos, path);
			draw_point_lists(point_list);
			path_lines = create_lines(smooth_path(point_list));
			
			//has_clicked = true;
		}
	}
}

function getLineError(robot) {
	var radius = CELL_HEIGHT*2;
	var circle = create_circle(create_point(robot.x, robot.y), radius);
	var p = false;
	for(var i = 0; i < path_lines.length; i++) {
		var p = dirLineSegCircleIntersection(path_lines[i], circle);
		if (p) {
			break;
		}
	}
	
	if (!p) {
		return false;
	}
	
	var line_heading = my_atan(p.y-robot.y, p.x-robot.x);
	var res = robot.heading - line_heading;
	if (res > Math.PI) {
		res = res - 2*Math.PI;
	} else if (res < -Math.PI) {
		res = res + 2*Math.PI;
	}
	return res;
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
