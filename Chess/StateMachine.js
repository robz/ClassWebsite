function StateMachine() {
	this.state = 0;
	this.prevCoord = null;
	this.prevPieceMoves = null;
	
	this.handleInput = function(piece) {
		if (this.state == 0 && piece) {
			if (piece.name == "" || piece.name[0] == 'B') return;
			utils.setSelected(piece.coord);
			this.prevCoord = piece.coord;
			prevPieceMoves = rules.getPieceMoves(gameState, piece);
			console.log("setting prevCoord to "+this.prevCoord);
			this.state = 1;
		} else if (this.state == 1 && piece) {
			if (this.prevCoord[0] == piece.coord[0] && this.prevCoord[1] == piece.coord[1]) {
				utils.setDeselected(this.prevCoord);
				this.state = 0;
			} else if (utils.containsCoord(prevPieceMoves, piece.coord)){
				utils.setDeselected(this.prevCoord);
				gameState.move(this.prevCoord, piece.coord);
				gameState.render();
				this.state = 2;
				this.prevCoord = null;
				setTimeout(function(){stateMachine.handleInput(null);}, 100);
			}
		} else if (this.state == 2) {
			//var move = agent.randomMove(gameState);
		  var move = agent.alphabeta_decision(gameState, 2).action;
      if (move == null) {
        alert("checkmate! you win!");
        this.state = 4;
      }
			gameState.move(move[0], move[1]);
			gameState.render();
			this.state = 3;
			setTimeout(function(){stateMachine.handleInput(null);}, 0);
		} else if (this.state == 3) {
			if (rules.inCheck(gameState, 'W')) {
				if (rules.getAllMoves(gameState, 'W').length == 0)
					alert("checkmate! you lose!");
				else
					alert("check!");
			}
			this.state = 0;
		}
	}
}
