function StateMachine() {
	this.state = 0;
	this.prevCoord = null;
	this.prevPieceMoves = null;
	
	this.handleInput = function(piece) {
		if (this.state == 0) {
			if (piece.name == "") return;
			utils.setSelected(piece.coord);
			prevCoord = piece.coord;
			prevPieceMoves = rules.getPieceMoves(gameState, piece);
			this.state = 1;
		} else if (this.state == 1) {
			if (prevCoord[0] == piece.coord[0] && prevCoord[1] == piece.coord[1]) {
				utils.setDeselected(prevCoord);
				this.state = 0;
			} else if (utils.containsCoord(prevPieceMoves, piece.coord)){
				utils.setDeselected(prevCoord);
				gameState.move(prevCoord, piece.coord);
				gameState.render();
				this.state = 2;
				
				//var move = agent.randomMove(gameState);
				var move = agent.alphabeta_decision(gameState, 2).action;
				gameState.move(move[0], move[1]);
				gameState.render();
				this.state = 0;
			}
		} else if (this.state == 2) {
		}
	}
}