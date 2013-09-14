function GameState(board, moveHistory, score) {
	if(board) {
		this.board = board;
		this.moveHistory = moveHistory;
		this.score = {black:score.black, white:score.white};
	} else {
		this.board = 
			[["BR","BH","BB","BQ","BK","BB","BH","BR"],
			 ["BP","BP","BP","BP","BP","BP","BP","BP"],
			 ["","","","","","","",""],
			 ["","","","","","","",""],
			 ["","","","","","","",""],
			 ["","","","","","","",""],
			 ["WP","WP","WP","WP","WP","WP","WP","WP"],
			 ["WR","WH","WB","WQ","WK","WB","WH","WR"]];
		this.moveHistory = 0;
		this.score = {black:0, white:0};
	}
	
	this.isWin = function() {
		return false;
	}
	
	this.isLose = function() {
		return false;
	}
	
	this.evaluate = function(color) {
		if (color == 'W') {
			return this.score.white-this.score.black;
		} else if (color == 'B') {
			return this.score.black-this.score.white;
		} else {
			console.log("ERROR: unexpected color "+color);
		}
		return 0;
	}
	
	this.getLegalActions = function(color) {
		return rules.getAllMoves(this, color);
	}
	
	// expecting [[startRow, startCol], [endRow, endCol]]
	this.becomeSuccessor = function(color, action) {
		var start = action[0], end = action[1];
		var takenName = this.board[end[0]][end[1]];
		var oldHistory = this.moveHistory;
		var oldScore = {black:this.score.black, white:this.score.white};
		var raction = utils.checkForCastling(this, action);
		
		this.move(start, end);
		
		return {move:action, taken:takenName, history:oldHistory, score:oldScore, rook:raction};
	}
	
	// expecting {move, rook, taken, history}
	this.revertToPredecessor = function(patch) {
		var start = patch.move[0], end = patch.move[1];
		this.board[start[0]][start[1]] = this.board[end[0]][end[1]];
		this.board[end[0]][end[1]] = patch.taken;
		this.moveHistory = patch.history;
		this.score = {black:patch.score.black, white:patch.score.white};
		if (patch.rook) {
			var rstart = patch.rook[0], rend = patch.rook[1];
			this.board[rstart[0]][rstart[1]] = this.board[rend[0]][rend[1]];
			this.board[rend[0]][rend[1]] = "";
		}
	}
	
	// expecting [r,c],[r,c]
	this.move = function(start, end) {
		var taken = this.board[end[0]][end[1]];
		if (taken != "") {
			var gain = utils.charToPoints(taken[1]);
			if (taken[0] == 'W') 
				this.score.black += gain;
			else if (taken[0] == 'B')
				this.score.white += gain;
			else
				console.log("ERROR: unexpected color in taken piece "+taken);
		}
		
		var moved = this.board[start[0]][start[1]];
		if (moved == "WK") {
			if (end[1]-start[1] == 2) {
				this.board[7][5] = this.board[7][7];
				this.board[7][7] = "";
			} else if (end[1]-start[1] == -2) {
				this.board[7][3] = this.board[7][0];
				this.board[7][0] = "";
			}
			this.moveHistory |= WK_M;
		} else if (moved == "BK") {
			if (end[1]-start[1] == 2) {
				this.board[0][5] = this.board[0][7];
				this.board[0][7] = "";
			} else if (end[1]-start[1] == -2) {
				this.board[0][3] = this.board[0][0];
				this.board[0][0] = "";
			}
			this.moveHistory |= BK_M;
		} else if (moved == "BR") {
			if (start[0] == 0 && start[1] == 0) {
				this.moveHistory |= BRL_M;
			} else if (start[0] == 0 && start[1] == 7) {
				this.moveHistory |= BRR_M;
			}
		} else if (moved == "WR") {
			if (start[0] == 7 && start[1] == 0) {
				this.moveHistory |= WRL_M;
			} else if (start[0] == 7 && start[1] == 7) {
				this.moveHistory |= WRR_M;
			}
		}
		
		this.board[end[0]][end[1]] = this.board[start[0]][start[1]];
		this.board[start[0]][start[1]] = "";
	}
	
	// expecting [r,c]
	this.boardAt = function(coord) {
		return this.board[coord[0]][coord[1]];
	}

	this.render = function() {
		for(var r = 0; r < this.board.length; r++) {
			var str = "";
			for(var c = 0; c < this.board[r].length; c++) {
				var imgName = utils.textToImgName(this.board[r][c]);
				var id = utils.coordToId([r,c]);
				if (imgName) {
					var url = "PieceIcons/"+imgName;
					utils.setImage(id, url, "img_"+r+"_"+c);
				} else {
					utils.clear(id);
				}
			}
		}
	}
	
	this.log = function() {
		for(var r = 0; r < this.board.length; r++) {
			var str = "";
			for(var c = 0; c < this.board[r].length; c++) {
				str += this.board[r][c]+" ";
			}
			console.log(str);
		}
	}
}