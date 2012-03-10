function ChessRules() {
	this.validMovements = {
		"WP" : {isBounded:true, 
				difs:[[-2,0],[-1,0],[-1,1],[-1,-1]]},
		"BP" : {isBounded:true,
				difs:[[2,0],[1,0],[1,1],[1,-1]]},
		"H" : {isBounded:true,
				difs:[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[-1,2],[1,-2],[-1,-2]]},
		"B"	: {isBounded:false,
				difs:[[1,1],[-1,1],[1,-1],[-1,-1]]},
		"R"	: {isBounded:false,
				difs:[[1,0],[-1,0],[0,1],[0,-1]]},
		"Q"	: {isBounded:false,
				difs:[[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]]},
		"K"	: {isBounded:true,
				difs:[[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1],[0,2],[0,-2]]}
	};
	
	this.getPieces = function(state, color) {
		var pieces = [];
		for(var r = 0; r < 8; r++) {
			for(var c = 0; c < 8; c++) {
				var str = state.boardAt([r,c]);
				if (str[0] == color)
					pieces.push({name:str,coord:[r,c]});
			}
		}
		return pieces;
	}
	
	this.getAllMoves = function(state, color) {
		// return for each move in state all moves
		var pieces = this.getPieces(state, color);
		var moves = []
		for(var i = 0; i < pieces.length; i++) {
			var pieceName = pieces[i].name;
			var pieceStart = pieces[i].coord;
			var pieceNextMoves = this.getPieceMoves(state, pieces[i]);
			for(var j = 0; j < pieceNextMoves.length; j++) {
				moves.push([pieceStart, pieceNextMoves[j]]);
			}
		}
		return moves;
	}

	this.getPieceMoves = function(state, piece) {
		var name = piece.name, start = piece.coord;
		if (name[1] !== "P")
			name = name.substring(1,2);
		var difs = this.validMovements[name].difs,
			bounded = this.validMovements[name].isBounded;
			
		var moves = [];
		for(var i = 0; i < difs.length; i++) {
			var scale = 1;
			var moved;
			var prevTmp = null;
			do {
				moved = false;
				var dif = difs[i];
				var tmpCoord = [start[0]+dif[0]*scale, start[1]+dif[1]*scale];
				if (this.validMove(state, piece, start, tmpCoord, prevTmp)) {
					moves.push(tmpCoord);
					moved = true;
				}
				prevTmp = tmpCoord;
				scale++;
			} while(!bounded && moved);
		} 
		
		return moves;
	}
	
	this.validMove = function(state, piece, start, end, prevend) {
		// check bounds
		if (end[0] < 0 || end[1] < 0 || end[0] > 7 || end[1] > 7)
			return false;
		
		endpiece = state.boardAt(end);
		dif = [end[0]-start[0],end[1]-start[1]];
		
		// can't capture own piece
		if (endpiece != "" && piece.name[0] == endpiece[0])
			return false;
			
		// can't jump enemy pieces 
		// (above constaint disables jumping own pieces except pawn)
		if (prevend != null) {
			// the piece previously tried a move in this direction, was it on 
			//	anther piece? (using induction)
			if (state.boardAt(prevend) != "")
				return false;
		} else if (piece.name[1] == 'P') { // handle pawn's special case
			if (dif[0] > 1 || dif[0] < -1) {
				if (state.boardAt([start[0]+dif[0]/2, start[1]]) != "")
					return false;
			}
		} else if (piece.name[1] == 'K') { // handle castling special case
			if (dif[1] > 1) {
				if (state.boardAt([start[0], start[1]+1]) != "" 
					  || state.boardAt([start[0], start[1]+2]) != "") {
					return false;
				}
			} else if (dif[1] < -1) {
				if (state.boardAt([start[0], start[1]-1]) != "" 
					  || state.boardAt([start[0], start[1]-2]) != ""
					  || state.boardAt([start[0], start[1]-3]) != ""){
					return false;
				}
			}
		}
		
		// other:
		//	pawns can't go diagonally unless capturing something
		//	pawns can't take pieces the conventional way
		//	pawns can't move two squares unless on home row
		if (piece.name[1] == 'P') {
			if (Math.abs(dif[0]) == Math.abs(dif[1])) {
				if (endpiece == "") return false;
			} else {
				if (endpiece !== "") return false;
			}
				
			if (dif[0] == 2 && start[0] != 1) // black
				return false;
			if (dif[0] == -2 && start[0] != 6) // white
				return false;
		}
		
		// 	castling?
		if (piece.name[1] == 'K' && Math.abs(dif[1]) > 1) {
		  // only backrow (quick case)
			if ((piece.name[0] == 'B' && start[0] != 0) ||
				(piece.name[0] == 'W' && start[0] != 7))  
				return false;
			 
		  // relavent pieces shouldn't have moved
			if ((piece.name[0] == 'B' && dif[1] < -1 && (state.moveHistory & BLC_MASK))
			  ||(piece.name[0] == 'B' && dif[1] > 1 && (state.moveHistory & BRC_MASK))
			  ||(piece.name[0] == 'W' && dif[1] < -1 && (state.moveHistory & WLC_MASK))
			  ||(piece.name[0] == 'W' && dif[1] > 1 && (state.moveHistory & WRC_MASK)))
					return false;
		}
		
		//	en passant?
		//	are you in check? (also: can't castle out of check or thru check)
		//	checkmate?
		
		return true;
	}
}