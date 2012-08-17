
function SearchProblem(obstacle_grid) 
{
	this.obstacle_grid = obstacle_grid;
	this.COLS = obstacle_grid.length;
	this.ROWS = obstacle_grid[0].length;
	
	// up, down, left, right, diagonals
	this.actions = [ { deltax: 0, deltay:-1, cost:1 },
					 { deltax: 0, deltay: 1, cost:1 },
					 { deltax:-1, deltay: 0, cost:1 },
					 { deltax: 1, deltay: 0, cost:1 },
					 { deltax: 1, deltay: 1, cost:Math.sqrt(2), other_valid_deltas:[{deltax: 1, deltay: 0}, {deltax: 0, deltay: 1}] },
					 { deltax:-1, deltay: 1, cost:Math.sqrt(2), other_valid_deltas:[{deltax:-1, deltay: 0}, {deltax: 0, deltay: 1}] },
					 { deltax: 1, deltay:-1, cost:Math.sqrt(2), other_valid_deltas:[{deltax: 1, deltay: 0}, {deltax: 0, deltay:-1}] },
					 { deltax:-1, deltay:-1, cost:Math.sqrt(2), other_valid_deltas:[{deltax:-1, deltay: 0}, {deltax: 0, deltay:-1}] },];
	
	this.next_pos = function(pos, action_index) {
		var action = this.actions[action_index];
	
		var new_pos = this.create_pos(pos.x + action.deltax, 
									  pos.y + action.deltay);
		
		if (this.is_valid_pos(new_pos)) {
			var deltas = action.other_valid_deltas;
			if (deltas) {
				for(var i = 0; i < deltas.length; i++) {
					var other_pos = this.create_pos(pos.x + deltas[i].deltax, 
													pos.y + deltas[i].deltay);
					if (!this.is_valid_pos(other_pos)) {
						return null;
					}
				}
			}
			return new_pos;
		} 
		
		return null;
	};

	this.is_valid_pos = function(pos) {
		return pos.x >= 0 && pos.y >= 0 && pos.x < this.COLS && pos.y < this.ROWS
			&& 0 == this.obstacle_grid[pos.x][pos.y];
	};
	
	this.create_pos = function(x, y) {
		return {
			x: x,
			y: y,
			ID: x + y*this.COLS
		};
	}
	
	this.create_state = function(pos, cost, heuristicVal) {
		return {
			pos: pos,
			heuristicVal: heuristicVal,
			cost: cost,
			totalCost: cost + heuristicVal,
			path: []
		};
	};
	
	this.is_goal = function(state, goal) {
		return state.pos.x == goal.x && state.pos.y == goal.y;
	};
	
	this.heuristic1 = function(pos, goal) {
		return Math.abs(pos.x - goal.x) + Math.abs(pos.y - goal.y);
	};

	this.heuristic2 = function(pos, goal) {
		return Math.sqrt((pos.x - goal.x)*(pos.x - goal.x) 
					   + (pos.y - goal.y)*(pos.y - goal.y));
	};

	this.heuristic3 = function(pos, goal) {
		return (Math.abs(pos.x - goal.x) + Math.abs(pos.y - goal.y))/2;
	};
	
	this.heuristic = this.heuristic2;
}

function astar(start_pos, goal_pos, problem, disp_grid) 
{
	var cur_state = problem.create_state(start_pos, 0, problem.heuristic(start_pos, goal_pos));
	var visited = {}, queue = [];
	
	visited[cur_state.pos.ID] = cur_state.totalCost;
	if (disp_grid) {
		disp_grid[cur_state.pos.x][cur_state.pos.y] = { c: cur_state.cost, h: cur_state.heuristicVal };
	}
	
	while (!problem.is_goal(cur_state, goal_pos)) 
	{
		for (var index = 0; index < problem.actions.length; index++)
		{
			var new_pos = problem.next_pos(cur_state.pos, index);
							
			if (new_pos) 
			{
				var new_state = problem.create_state(
									new_pos, 
									cur_state.cost + problem.actions[index].cost, 
									problem.heuristic(new_pos, goal_pos) );
									
				if (!visited[new_pos.ID] || visited[new_pos.ID] > new_state.totalCost) 
				{
					visited[new_pos.ID] = new_state.totalCost;
					new_state.path = copy_path(cur_state.path);
					new_state.path.push(index);
					queue.push(new_state);
				}
			}
		}
		
		queue.sort(function (a,b) { return a.totalCost - b.totalCost; });
		
		if (0 == queue.length) {
			return null;
		} 
		cur_state = queue.shift();
		
		if (disp_grid) {
			disp_grid[cur_state.pos.x][cur_state.pos.y] = { c: cur_state.cost, h: cur_state.heuristicVal };
		}
	}
	
	return cur_state.path;
}

//
// Logistics functions
//

function copy_path(path) {
	var new_path = new Array(path.length);
	for (var i = 0; i < path.length; i++) {
		new_path[i] = path[i];
	}
	return new_path;
}