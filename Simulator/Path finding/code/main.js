var COLS = 20, ROWS = 20, CANVAS_WIDTH = -1, CANVAS_HEIGHT = -1, 
	CELL_WIDTH = -1, CELL_HEIGHT = -1;

var has_clicked = false, temp_pos = null, expanded_grid, 
	obstacle_grid = 
[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
[0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,1,1,1],
[0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,1,1,0],
[0,0,0,0,1,0,0,0,1,1,1,1,0,0,0,0,1,0,1,0],
[0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,0],
[0,0,0,0,0,0,0,0,1,1,1,1,1,0,1,0,1,0,0,0],
[0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1],
[0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,1,1,0,0,0],
[0,0,0,0,1,0,1,1,1,1,1,0,0,1,0,1,0,0,1,0],
[0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0],
[0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,1,0,0,1,0],
[0,0,1,1,1,1,1,0,0,1,0,1,1,1,0,1,1,0,0,0],
[0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1],
[0,0,0,0,1,0,1,1,0,1,0,0,0,0,0,1,1,1,1,0],
[0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

window.onload=function() {
	var canvas = document.getElementById("canvas");
	CANVAS_WIDTH = canvas.width;
	CANVAS_HEIGHT = canvas.height;
	CELL_WIDTH = CANVAS_WIDTH/COLS;
	CELL_HEIGHT = CANVAS_HEIGHT/ROWS;
	
	expanded_grid = create_grid();
	drawGrid(canvas.getContext("2d"));
}

function drawGrid(context) {
	context.strokeStyle = "white";
	context.fillStyle = "white";
	for(var x = 0; x < COLS; x++) {
		context.beginPath();
		context.moveTo(x*CELL_WIDTH, 0);
		context.lineTo(x*CELL_WIDTH, CANVAS_HEIGHT);
		for(var y = 0; y < ROWS; y++) {
			if(obstacle_grid[x][y] == 1) {
				context.fillStyle = "white";
				context.fillRect(x*CELL_WIDTH, y*CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
			}
			if(expanded_grid[x][y]) {
				context.fillStyle = "black";
				context.fillText(
					""+expanded_grid[x][y], 
					x*CELL_WIDTH + CELL_WIDTH/2, 
					y*CELL_HEIGHT + CELL_HEIGHT/2);
			}
		}
		context.stroke();
	}	
	context.fill();
	for(var y = 0; y < ROWS; y++) {
		context.beginPath();
		context.moveTo(0, y*CELL_HEIGHT);
		context.lineTo(CANVAS_WIDTH, y*CELL_HEIGHT);
		context.stroke();
	}	
}

function drawLine(context, point_list) 
{
	context.beginPath();
	context.moveTo(point_list[0].x, point_list[0].y);
	for(var i = 1; i < point_list.length; i++) {
		context.lineTo(point_list[i].x, point_list[i].y);
	}
	context.stroke();
}

function paint(point_list) {
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	
	context.fillStyle = "lightGray";
	context.fillRect(0,0,canvas.width,canvas.height);
	
	drawGrid(context);
	context.strokeStyle = "blue";
	drawLine(context, point_list);
	context.strokeStyle = "green";
	drawLine(context, smooth_path(point_list));
}

function create_obstacle_grid() {
	var grid = create_grid();
	return grid;
}

function smooth_path(path) {
	var newpath = new Array(path.length);
	for (i = 0; i < path.length; i++) {
		newpath[i] = {x:path[i].x,y:path[i].y};
	}
	
	var weight_data = .5, weight_smooth = .2;
	var tolerance = .0001, delta = 1;
    while (delta > tolerance) {
        delta = 0;
        for (i = 1; i < path.length-1; i++) { 
            var old1 = newpath[i].x,
				old2 = newpath[i].y;
            
            newpath[i].x += weight_data*(path[i].x - newpath[i].x);
            newpath[i].y += weight_data*(path[i].y - newpath[i].y);
            
            newpath[i].x += weight_smooth*(newpath[i-1].x + newpath[i+1].x - 2*newpath[i].x);
            newpath[i].y += weight_smooth*(newpath[i-1].y + newpath[i+1].y - 2*newpath[i].y);
            
            delta += Math.abs(old1 - newpath[i].x);
            delta += Math.abs(old2 - newpath[i].y);
		}
	}
	return newpath;
}

function clicked(event) {
	var cur_pos = [
		Math.round(event.offsetX/CELL_WIDTH - .5),
		Math.round(event.offsetY/CELL_HEIGHT - .5)
	];
	
	/*
	if (event.which == 1) {
		console.log(cur_pos);
		obstacle_grid[cur_pos[0]][cur_pos[1]] = 1;
	} else {
		print_grid();
	}
	drawGrid(document.getElementById("canvas").getContext("2d"));
	*/
	if (!has_clicked) {
		temp_pos = cur_pos;
		has_clicked = true;
	} else if (has_clicked) {
		
		search(temp_pos, cur_pos, obstacle_grid);
		has_clicked = false;
	}
	
}

function print_grid() {
	var prefix1 = "";
	var str = "[";
	for(var x = 0; x < COLS; x++) {
		str += prefix1+"[";
		var prefix2 = "";
		for(var y = 0; y < ROWS; y++) {
			str += prefix2+obstacle_grid[x][y];
			prefix2 = ",";
		}
		str += "]";
		prefix1 = ",\n";
	}
	str += "]";
	console.log(str);
}






























