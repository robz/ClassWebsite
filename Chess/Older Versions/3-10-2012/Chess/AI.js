/*********** RANDOM!!! *************/

function randomMove(state) {
	var moves = getAllMoves(state, false);
	if (moves.length == 0) {
		console.log("out of moves!");
		state = 0;
		return;
	}
	return moves[Math.floor(Math.random()*moves.length)];
}


/*********** MINIMAX!!! *************/
var expanded, visited;
function minimax_decision(state, depth) {
	expanded = 0;
	visited = 0;
	var result = minimax_max_value(state, depth);
	console.log("minimax: "+expanded+";"+visited);
	return result.action;
}

function minimax_max_value(state, depth) {
	if (depth == 0 || state.isWin() || state.isLose()) {
		visited++;
		return {action:null, value:state.evaluate('B')};
	}
	
	var argmaxa = null;
	var argmaxv = -Infinity;
	
	var possibleActions = state.getLegalActions('B');
	expanded++;
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
		visited++;
		return state.evaluate('B');
	}
	
	var argminv = Infinity;
	
	var possibleActions = state.getLegalActions('W');
	expanded++;
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


/*********** APHA-BETA!!! *************/

function alphabeta_decision(state, depth) {
	expanded = 0;
	visited = 0;
	var result = alphabeta_max_value(state, depth, -Infinity, Infinity);
	console.log("alphabeta: "+depth+";"+expanded+";"+visited);
	return {action:result.action, exp:expanded, eva:visited};
}

function alphabeta_max_value(state, depth, alpha, beta) {
	if (depth == 0 || state.isWin() || state.isLose()) {
		visited++;
		return {action:null, value:state.evaluate('B')};
	}
	
	var argmaxa = null;
	var argmaxv = -Infinity;
	
	var possibleActions = state.getLegalActions('B');
	expanded++;
	for(var i = 0; i < possibleActions.length; i++) {
		var nextAction = possibleActions[i];
		
		var undo = state.generateSuccessor('B', nextAction);
      	var v = alphabeta_min_value(state, depth, alpha, beta);
      	state.degenerateSuccessor(undo);
      	
      	if (v > argmaxv) {
       		argmaxa = nextAction;
        	argmaxv = v;
        }
        
        if (argmaxv >= beta) {
        	return {action:argmaxa, value:argmaxv};
      	} else if (argmaxv > alpha) {
        	alpha = argmaxv;
        }
	}
	
	return {action:argmaxa, value:argmaxv};
}

function alphabeta_min_value(state, depth, alpha, beta) {
	if (state.isWin() || state.isLose()) {
		visited++;
		return state.evaluate('B');
	}
	
	var argminv = Infinity;
	
	var possibleActions = state.getLegalActions('W');
	expanded++;
	for(var i = 0; i < possibleActions.length; i++) {
		var nextAction = possibleActions[i];
		
		var undo = state.generateSuccessor('W', nextAction);
		var v = alphabeta_max_value(state, depth-1, alpha, beta).value;
      	state.degenerateSuccessor(undo);
		
      	if (v < argminv) { 
        	argminv = v;
        }
        
        if (argminv <= alpha) {
        	return argminv;
      	} else if (argminv < beta) {
        	beta = argminv;
        }
	}
	
	return argminv;
}




















