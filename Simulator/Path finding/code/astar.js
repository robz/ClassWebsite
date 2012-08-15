var step_cost = 1; // uniform for now
var actions = [ [ 1,  0],
				[ 0,  1],
				[-1,  0],
				[ 0, -1] ];

function search(start_pos, goal_pos, obstacle_grid) 
{
	var cur = create_state(start_pos, 0, heuristic(start_pos, goal_pos), []);
	var visited_grid = create_grid(),
		color_grid = create_grid();
	expanded_grid = create_grid();
	var queue = [];
	
	visited_grid[cur.x][cur.y] = 1;
	expanded_grid[cur.x][cur.y] = cur.cost;
	
	var failed = false;
	
	while(!isGoal(cur, goal_pos)) 
	{
		for(var i = 0; i < actions.length; i++) 
		{
			var adj_pos = [ cur.x + actions[i][0], 
							cur.y + actions[i][1] ];
							
			if (adj_pos[0] >= 0 && adj_pos[1] >= 0 
				&& adj_pos[0] < COLS && adj_pos[1] < ROWS
				&& 0 == visited_grid[adj_pos[0]][adj_pos[1]]
				&& 0 == obstacle_grid[adj_pos[0]][adj_pos[1]]) 
			{
				var adj = create_state( adj_pos,
										cur.cost + step_cost,
										heuristic(adj_pos, goal_pos),
										copy_path(cur.path) );
				adj.path.push(i);
				queue.push(adj);
			}
		}
		
		queue.sort(function (a,b) { return a.totalCost - b.totalCost; });
		
		if (0 == queue.length) {
			failed = true;
			break;
		} 
		
		cur = queue.shift();
		visited_grid[cur.x][cur.y] = 1;
		expanded_grid[cur.x][cur.y] = cur.cost;
	}
	
	if (failed) {
		console.log("ahhhhh");
		return null;
	}
	
	console.log("done!");
	paint(to_point_list(start_pos, cur.path));
	
	return cur.path;
}

function to_point_list(start_pos, path) 
{
	var point_list = new Array(path.length+1);
	point_list[0] = { 
		x: start_pos[0]*CELL_WIDTH + CELL_WIDTH/2,
		y: start_pos[1]*CELL_HEIGHT + CELL_HEIGHT/2
	};
	
	for(var i = 1; i < point_list.length; i++) {
		point_list[i] = {
			x: point_list[i-1].x + actions[path[i-1]][0]*CELL_WIDTH,
			y: point_list[i-1].y + actions[path[i-1]][1]*CELL_HEIGHT
		};
	}
	
	return point_list;
}

function copy_path(path) {
	var new_path = new Array(path.length);
	for (var i = 0; i < path.length; i++) {
		new_path[i] = path[i];
	}
	return new_path;
}

function isGoal(cur, goal) {
	return cur.x == goal[0] && cur.y == goal[1];
}

function heuristic(pos, goal) {
	return Math.abs(pos[0]-goal[0]) + Math.abs(pos[1]-goal[1]);
}

function create_state(pos, cost, heuristicVal, path) 
{
	return {
		x: pos[0],
		y: pos[1],
		totalCost: cost + heuristicVal,
		cost: cost,
		path: path
	};
}

function create_grid() {
	var grid = new Array(COLS);
	for(var x = 0; x < COLS; x++) {
		grid[x] = new Array(ROWS);
		for(var y = 0; y < ROWS; y++) {
			grid[x][y] = 0;
		}
	}
	return grid;
}