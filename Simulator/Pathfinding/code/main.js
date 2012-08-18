var COLS, ROWS, CANVAS_WIDTH, CANVAS_HEIGHT, CELL_WIDTH, CELL_HEIGHT;
var problem;
var canvas, context;
var has_clicked = false, first_pos = null, last_pos = null;
var obstacle_grid = 
		[	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
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
			[1,0,0,0,1,0,1,1,0,1,0,0,0,0,0,1,1,1,1,0],			
			[0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],		
			[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],	];	

			
window.onload=function() {	
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	
	CANVAS_WIDTH = canvas.width;
	CANVAS_HEIGHT = canvas.height;
	COLS = obstacle_grid.length;
	ROWS = obstacle_grid[0].length;
	CELL_WIDTH = CANVAS_WIDTH/COLS;
	CELL_HEIGHT = CANVAS_HEIGHT/ROWS;
	
	problem = new SearchProblem(obstacle_grid);
	
	draw_grid(obstacle_grid, COLS, ROWS);
}

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
	
	if (obstacle_grid[cur_pos.x][cur_pos.y])
		return;
	
	if (!has_clicked) {
		first_pos = cur_pos;
		
		context.fillStyle = "lightBlue";
		context.fillRect(first_pos.x*CELL_WIDTH, first_pos.y*CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
			
		has_clicked = true;
	} else if (has_clicked) {
		last_pos = cur_pos;
		
		var data_grid = create_zeroed_grid(COLS, ROWS);
		var path = astar(first_pos, last_pos, problem, data_grid);
		draw_grid(obstacle_grid, COLS, ROWS);
		draw_search_result(data_grid, first_pos, last_pos, COLS, ROWS);
		if(path != null) {
			var point_list = to_point_list(problem, first_pos, path);
			draw_point_lists(point_list);
		}
		
		has_clicked = false;
	}
}

function to_point_list(problem, start_pos, path) {
	var point_list = new Array(path.length+1);
	
	point_list[0] = problem.create_pos(start_pos.x, start_pos.y, start_pos.dir);
	for(var i = 1; i < point_list.length; i++) {
		point_list[i] = problem.next_pos(point_list[i-1], path[i-1]);
	}
	for(var i = 0; i < point_list.length; i++) {
		point_list[i].x *= CELL_WIDTH;
		point_list[i].x += CELL_WIDTH/2;
		point_list[i].y *= CELL_HEIGHT;
		point_list[i].y += CELL_HEIGHT/2;
	}
	
	return point_list;
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

function create_zeroed_grid(cols, rows) {
	var grid = new Array(cols);
	for(var x = 0; x < cols; x++) {
		grid[x] = new Array(rows);
		for(var y = 0; y < rows; y++) {
			grid[x][y] = 0;
		}
	}
	return grid;
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






























