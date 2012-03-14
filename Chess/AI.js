function AI() {
	/*********** RANDOM!!! *************/
	this.randomMove = function(state) {
		var moves = rules.getAllMoves(state, 'B');
		if (moves.length == 0) {
			console.log("out of moves!");
			state = 0;
			return;
		}
		return moves[Math.floor(Math.random()*moves.length)];
	}
	
	var expanded, visited;
	
	/*********** APHA-BETA!!! *************/
	this.alphabeta_decision = function(state, depth) {
		this.expanded = 0;
		this.visited = 0;
		var result = this.alphabeta_max_value(state, depth, -Infinity, Infinity);
		//console.log("alphabeta:: depth "+depth+"; "+this.expanded+" states expanded ; "+this.visited+" states evaluated");
		return {action:result.action, exp:expanded, eva:visited};
	}
	
	this.alphabeta_max_value = function(state, depth, alpha, beta) {
		if (depth == 0 || state.isWin() || state.isLose()) {
			this.visited++;
			return {action:null, value:state.evaluate('B')};
		}
		
		var argmaxa = null;
		var argmaxv = -Infinity;
		
		var possibleActions = state.getLegalActions('B');
		this.expanded++;
		if (possibleActions.length == 0) {
			// lose
			return {action:null, value:-1000};
		}
		
		for(var i = 0; i < possibleActions.length; i++) {
			var nextAction = possibleActions[i];
			
			var patch = state.becomeSuccessor('B', nextAction);
			var v = this.alphabeta_min_value(state, depth, alpha, beta);
			state.revertToPredecessor(patch);
			
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
	
	this.alphabeta_min_value = function(state, depth, alpha, beta) {
		if (state.isWin() || state.isLose()) {
			this.visited++;
			return state.evaluate('B');
		}
		
		var argminv = Infinity;
		
		var possibleActions = state.getLegalActions('W');
		this.expanded++;
		
		if (possibleActions.length == 0) {
			// win
			return 1000;
		}
		
		for(var i = 0; i < possibleActions.length; i++) {
			var nextAction = possibleActions[i];
			
			var patch = state.becomeSuccessor('W', nextAction);
			var v = this.alphabeta_max_value(state, depth-1, alpha, beta).value;
			state.revertToPredecessor(patch);
			
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
}

