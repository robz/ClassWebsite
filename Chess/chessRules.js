var validMovements = {
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
			difs:[[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]]}
};

// color = false :: black
// returns [{name:"XX",coord:(X,X)}, ...]
/*
state.getName([row,col])
*/
function getPieces(state, color) {
	var pre = (color) ? 'W' : 'B';

	var pieces = [];
	for(var r = 0; r < 8; r++) {
		for(var c = 0; c < 8; c++) {
			var str = state.getName([r,c]);
			if (str[0] == pre)
				pieces.push({name:str,coord:[r,c]});
		}
	}
	return pieces;
}

// color = false :: black
// returns [move, move, ..., move]
//	where move = {name:"XX", coord:(r,c)}
/* Dependencies:
getPieces(state, color)
getPieceMoves(state, piece)
*/
function getAllMoves(state, color) {
	// return for each move in state all moves
	var pieces = getPieces(state, color);
	var moves = []
	for(var i = 0; i < pieces.length; i++) {
		var pieceName = pieces[i].name;
		var pieceStart = pieces[i].coord;
		var pieceNextMoves = getPieceMoves(state, pieces[i]);
		for(var j = 0; j < pieceNextMoves.length; j++) {
			moves.push([pieceStart, pieceNextMoves[j]]);
		}
	}
	return moves;
}

// expects {name:"XX", coord:[X,X]}
// returns [(r,c),(r,c),...,(r,c)]
/* Dependencies:
validMove(state, piece, start, end, prevend)
*/
function getPieceMoves(state, piece) {
	var name = piece.name, start = piece.coord;
	if (name[1] !== "P")
		name = name.substring(1,2);
	var difs = validMovements[name].difs,
		bounded = validMovements[name].isBounded;
		
	var moves = [];
	for(var i = 0; i < difs.length; i++) {
		var scale = 1;
		var moved;
		var prevTmp = null;
		do {
			moved = false;
			var dif = difs[i];
			var tmpCoord = [start[0]+dif[0]*scale, start[1]+dif[1]*scale];
			if (validMove(state, piece, start, tmpCoord, prevTmp)) {
				moves.push(tmpCoord);
				moved = true;
			}
			prevTmp = tmpCoord;
			scale++;
		} while(!bounded && moved);
	} 
	
	return moves;
}

/* Dependencies:
state.getName([row, col])
*/
function validMove(state, piece, start, end, prevend) {
	// check bounds
	if (end[0] < 0 || end[1] < 0 || end[0] > 7 || end[1] > 7)
		return false;
	
	endpiece = state.getName(end);
	dif = [end[0]-start[0],end[1]-start[1]];
	
	// can't capture own piece
	if (endpiece != "" && piece.name[0] == endpiece[0])
		return false;
		
	// can't jump enemy pieces 
	// (above constaint disables jumping own pieces except pawn)
	if (prevend != null) {
		// the piece previously tried a move in this direction, was it on 
		//	anther piece? (using induction)
		if (state.getName(prevend) != "")
			return false;
	} else if (piece.name[1] == 'P') { // handle pawn's special case
		if (dif[0] > 1 || dif[0] < -1) {
			if (state.getName([start[0]+dif[0]/2, start[1]]) != "")
				return false;
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
	
	//	en passant?
	// 	castling?
	//	are you in check?
	//	checkmate?
	
	return true;
}


















