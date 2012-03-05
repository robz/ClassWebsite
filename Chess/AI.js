/*********** RANDOM!!! *************/

function randomMove() {
	var moves = getAllMoves(stateObj, false);
	if (moves.length == 0) {
		console.log("out of moves!");
		state = 0;
		return;
	}
	return moves[Math.floor(Math.random()*moves.length)];
}


/*********** MINIMAX!!! *************/

function minimax_decision(state, depth) {
	var result = minimax_max_value(state, depth);
	return result.action;
}

/*
function minimax_max_value(state, depth) {
	if (depth == 0 || state.isWin() || state.isLose()) {
		return {action:null, value:state.evaluate('B')};
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
*/

function minimax_max_value(state, depth) {
	if (depth == 0 || state.isWin() || state.isLose()) {
		return {action:null, value:state.evaluate('B')};
	}
	
	var argmaxa = null;
	var argmaxv = -Infinity;
	
	var possibleActions = state.getLegalActions('B');
	for(var i = 0; i < possibleActions.length; i++) {
		var nextAction = possibleActions[i];
		
		var undo = state.generateSuccessor('B', nextAction);
      	var v = minimax_min_value(state, depth);
      	state.degenerateSuccessor(undo);
      	
      	if (v > argmaxv) {
       		argmaxa = nextAction;
        	argmaxv = v;
        }
	}
	
	return {action:argmaxa, value:argmaxv};
}

function minimax_min_value(state, depth) {
	if (state.isWin() || state.isLose()) {
		return state.evaluate('B');
	}
	
	var argminv = Infinity;
	
	var possibleActions = state.getLegalActions('W');
	for(var i = 0; i < possibleActions.length; i++) {
		var nextAction = possibleActions[i];
		
		var undo = state.generateSuccessor('W', nextAction);
		var v = minimax_max_value(state, depth-1).value;
      	state.degenerateSuccessor(undo);
		
      	if (v < argminv) { 
        	argminv = v;
        }
	}
	
	return argminv;
}





















