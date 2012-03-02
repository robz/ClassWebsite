// returns {start:(X,X), end:(X,X)}
function randomMove() {
	var moves = getAllMoves(false);
	if (moves.length == 0) {
		console.log("out of moves!");
		state = 0;
		return;
	}
	return moves[Math.floor(Math.random()*moves.length)];
}


/* TODO:
state.isWin()
state.isLose()
state.getLegalActions('W'/'B')
state.generateSuccessor('W'/'B', action)
state.evaluate()
*/

function minimax_decision(state) {
	var result = minimax_max_value(state, 1);
	return result.action;
}

function minimax_max_value(state, depth) {
	if (depth == 0 || state.isWin() || state.isLose()) {
		return state.evaluate();
	}
	
	var argmaxa = null;
	var argmaxv = -Infinity;
	
	var possibleActions = state.getLegalActions('B');
	for(var i = 0; i < possibleActions.length; i++) {
		var nextAction = possibleActions[i];
		var resultState = state.generateSuccessor('B', nextAction);
      	var v = minimax_min_value(resultState, depth);
      	if (v > argmaxv) {
       		argmaxa = nextAction;
        	argmaxv = v;
        }
	}
	
	return {action:argmaxa, value:argmaxv};
}

function minimax_min_value(state, depth) {
	if (state.isWin() || state.isLose()) {
		return state.evaluate();
	}
	
	var argminv = Infinity;
	
	var possibleActions = state.getLegalActions('W');
	for(var i = 0; i < possibleActions.length; i++) {
		var nextAction = possibleActions[i];
		var resultState = state.generateSuccessor('W', nextAction);
		var v = minimax_max_value(resultState, depth-1).value;
      	if (v < argminv) { 
        	argminv = v;
        }
	}
	
	return argminv;
}





















