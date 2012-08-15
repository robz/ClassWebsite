// action is [deltax, deltay, cost]
var actions = [ [ 1,  0, 1],
				[ 0,  1, 1],
				[-1,  0, 1],
				[ 0, -1, 1] ];
var heuristic = heuristic1;

function search(start_pos, goal_pos, obstacle_grid) 
{
	// used for debugging (will contain numbers displayed on webpage)
	disp_grid = create_zeroed_grid(); 
	
	var cur_state = create_state(start_pos, 0, heuristic(start_pos, goal_pos), []);
	
	var visited_grid = create_zeroed_grid(),
		queue = [];
	
	visited_grid[cur_state.x][cur_state.y] = cur_state.totalCost;
	disp_grid[cur_state.x][cur_state.y] = 
		{ 	c: cur_state.cost,
			h: heuristic(cur_state, goal_pos) };
	
	var failed = false;
	
	while (!isGoal(cur_state, goal_pos)) 
	{
		for (var index = 0; index < actions.length; index++) 
		{
			var new_pos = {x: cur_state.x + actions[index][0],
						   y: cur_state.y + actions[index][1]};
							
			if (is_valid_pos(new_pos, obstacle_grid)) 
			{
				var new_totalCost = cur_state.cost + actions[index][2] 
									+ heuristic(new_pos, goal_pos);
				
				if (visited_grid[new_pos.x][new_pos.y] == 0
					|| visited_grid[new_pos.x][new_pos.y] > new_totalCost) 
				{
					var new_state = create_state( 
										new_pos,
										cur_state.cost + actions[index][2],
										heuristic(new_pos, goal_pos),
										copy_path(cur_state.path) 
										);
											
					visited_grid[new_pos.x][new_pos.y] = new_totalCost;
					new_state.path.push(index);
					queue.push(new_state);
				}
			}
		}
		
		queue.sort(function (a,b) { return a.totalCost - b.totalCost; });
		
		if (0 == queue.length) {
			failed = true;
			break;
		} 
		
		cur_state = queue.shift();
		
		disp_grid[cur_state.x][cur_state.y] = 
			{ 	c: cur_state.cost,
				h: heuristic(cur_state, goal_pos) };
	}
	
	if (failed) {
		console.log("couldn't find it!");
		paint(null);
		return null;
	}
	
	console.log("found it!");
	paint(to_point_list(start_pos, cur_state.path));
	
	return cur_state.path;
}

function is_valid_pos(pos, obstacle_grid) {
	return pos.x >= 0 && pos.y >= 0 && pos.x < COLS && pos.y < ROWS
		&& 0 == obstacle_grid[pos.x][pos.y];
}

function isGoal(pos, goal) {
	return pos.x == goal.x && pos.y == goal.y;
}

function heuristic1(pos, goal) {
	return Math.abs(pos.x - goal.x) + Math.abs(pos.y - goal.y);
}

function heuristic2(pos, goal) {
	return Math.sqrt((pos.x - goal.x)*(pos.x - goal.x) 
				   + (pos.y - goal.y)*(pos.y - goal.y));
}

function create_state(pos, cost, heuristicVal, path) {
	return {
		x: pos.x,
		y: pos.y,
		totalCost: cost + heuristicVal,
		cost: cost,
		path: path
	};
}

//
// Logistics functions
//

function to_point_list(start_pos, path) {
	var point_list = new Array(path.length+1);
	point_list[0] = { 
		x: start_pos.x*CELL_WIDTH + CELL_WIDTH/2,
		y: start_pos.y*CELL_HEIGHT + CELL_HEIGHT/2
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