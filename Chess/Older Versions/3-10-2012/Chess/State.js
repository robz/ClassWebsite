/* TODO:
state.isWin()
state.isLose()
state.getLegalActions('W'/'B')
state.generateSuccessor('W'/'B', action)
state.evaluate()
*/
var mycount123 = 0;

var piecescores = {
	'P':1,
	'R':5,
	'H':3,
	'B':3,
	'K':999,
	'Q':9,
}

var piecesIcons = {
  "BP":"black-pawn.png",
  "BR":"black-rook.png",
  "BH":"black-knight.png",
  "BB":"black-bishop.png",
  "BK":"black-king.png",
  "BQ":"black-queen.png",
  "WP":"white-pawn.png",
  "WR":"white-rook.png",
  "WH":"white-knight.png",
  "WB":"white-bishop.png",
  "WK":"white-king.png",
  "WQ":"white-queen.png",
}

function isCastle(state, action) {
  var start = action[0], end = action[1];
  if (state.board[start[0]][start[1]][0] != 'K')
    return false;
  if (Math.abs(start[1]-end[1]) > 1) 
    return true;
}

function setMovesIfCastle(state, action) {
  if (!isCastle(state, action)) return 0;
  
  var resultIndex = 0;
  var coldif = action[0][1]-action[0][0];
  
  if (state.board[start[0]][start[1]][1] == 'B') {
    if (coldif == 2) {
      resultIndex = 1;
    } else if (coldif == -3) {
      resultIndex = 2;
    } else {
		  console.log("ERROR: bad action--isCastle guard failed!");
		  resultIndex = -1;
    }
  } else if (state.board[start[0]][start[1]][1] == 'W') {
    if (coldif == 2) {
      resultIndex = 3;
    } else if (coldif == -3) {
      resultIndex = 4;
    } else {
		  console.log("ERROR: bad action--isCastle guard failed!");
		  resultIndex = -1;
    }
  } else {
		console.log("ERROR: bad action--isCastle guard failed!");
		resultIndex = -1;
  }
  
  return resultIndex;
}

function unsetMovesIfCastle(state, index) {
  if (index == 0) return;
  if (index == 1) {
      state.importantMoves.blackKing = false;
      state.importantMoves.rightBlackRook = false;
  } else if (index == 2) {
      state.importantMoves.blackKing = false;
      state.importantMoves.leftBlackRook = false;
  } else if (index == 3) {
      state.importantMoves.whiteKing = false;
      state.importantMoves.rightWhiteRook = false;
  } else if (index == 4) {
      state.importantMoves.whiteKing = false;
      state.importantMoves.leftWhiteRook = false;
  } else {
    console.log("ERROR: someone fucked up a castle.");
  }
}


function StateObj(b, oldscore, oldImpMoves) {
	if (!b && !oldscore) {
		this.board = 
		[["BR","BH","BB","BQ","BK","BB","BH","BR"],
		 ["BP","BP","BP","BP","BP","BP","BP","BP"],
		 ["","","","","","","",""],
		 ["","","","","","","",""],
		 ["","","","","","","",""],
		 ["","","","","","","",""],
		 ["WP","WP","WP","WP","WP","WP","WP","WP"],
		 ["WR","WH","WB","WQ","WK","WB","WH","WR"]];
		this.score = [0,0];
		this.importantMoves = {
		  blackKing:false, rightBlackRook:false, leftBlackRook:false,
	    whiteKing:false, rightWhiteRook:false, leftWhiteRook:false}
	} else if (b && oldscore) {
		this.board = b;
		this.score = [oldscore[0], oldscore[1]];
		this.importantMoves = {
		  blackKing:oldImpMoves.blackKing, 
		  rightBlackRook:oldImpMoves.rightBlackRook, 
		  leftBlackRook:oldImpMoves.leftWhiteRook,
	    whiteKing:oldImpMoves.whiteKing, 
	    rightWhiteRook:oldImpMoves.rightWhiteRook, leftWhiteRook:oldImpMoves.leftWhiteRook}
	} else {
		console.log("ERROR: bad stateobj constructor!");
	}
		 
	this.isWin = function() {
		return false;
	}
	
	this.isLose = function() {
		return false;
	}
	
	this.getLegalActions = function(side) {
		if (side == 'B') {
			return getAllMoves(this, false);
		} else if (side == 'W') {
			return getAllMoves(this, true);
		} else {
			console.log("error: incorrect side "+side);
		}
	}
	
	/*
	this.generateSuccessor = function(side, action) {
		var newstate = new StateObj(copy2DArr(this.board), this.score);
		newstate.move(side, action);
		return newstate;
	}
	*/
	
	this.generateSuccessor = function(side, action) {
		var scoretemp = [this.score[0],this.score[1]];
		var st = action[0], fi = action[1];
		
		var movedPiece = {name:this.board[st[0]][st[1]], coord:[st[0],st[1]]};
		var removedPiece = {name:this.board[fi[0]][fi[1]], coord:[fi[0],fi[1]]};
		
		var index = setMovesIfCastle(this, action);
	
		this.move(side, action);
		
		var dif = [scoretemp[0]-this.score[0], scoretemp[1]-this.score[1]];
		
		return {scoredif:dif, premd:removedPiece, pmovd:movedPiece, impMovesIndex:index};
	}
	
	this.degenerateSuccessor = function(undo) {
		this.score = [this.score[0]+undo.scoredif[0], this.score[1]+undo.scoredif[1]];
		this.board[undo.pmovd.coord[0]][undo.pmovd.coord[1]] = undo.pmovd.name;
		this.board[undo.premd.coord[0]][undo.premd.coord[1]] = undo.premd.name;
		unsetMovesIfCastle(this, undo.impMovesIndex);
	}
	
	this.evaluate = function(side) {
		if (side == 'B') {
			return this.score[0]-this.score[1];
		} else if (side == 'W') {
			return this.score[1]-this.score[0];
		} else {
			console.log("error: incorrect side "+side);
		}
	}
	
	this.getName = function(coord){
		return this.board[coord[0]][coord[1]];
	}
	
	this.log = function() {
		for(var r = 0; r < this.board.length; r++) {
			var str = "";
			for(var c = 0; c < this.board[r].length; c++) {
				if (this.board[r][c] == "")
					str += "   ";
				else
					str += this.board[r][c]+" ";
			}
			console.log(str);
		}
	}
	
	this.render = function() {
		for(var r = 0; r < this.board.length; r++) {
			for(var c = 0; c < this.board[r].length; c++) {
			  var elem = document.getElementById(coordToID([r,c]));
				elem.innerHTML = this.board[r][c];
			}
		}
	}
	
	this.move = function(side, action) {
		var start = action[0];
		var end = action[1];
		
		var sideIndex = {'B':0,'W':1}[side];
		var str = this.board[end[0]][end[1]]
		if (str != "")
			this.score[sideIndex] += piecescores[str[1]];
	  
	  var txt = this.board[start[0]][start[1]]
		this.importantMoves.blackKing = this.importantMoves.blackKing || txt == "BK";
		this.importantMoves.rightBlackRook = this.importantMoves.rightBlackRook || (txt == "BR" && start[0] == 0 &&  start[1] == 7); 
		this.importantMoves.leftBlackRook = this.importantMoves.leftBlackRook || (txt == "BR" && start[0] == 0 &&  start[1] == 0);
	  this.importantMoves.whiteKing = this.importantMoves.whiteKing || txt == "WK";
	  this.importantMoves.rightWhiteRook = this.importantMoves.rightWhiteRook || (txt == "WR" && start[0] == 7 &&  start[1] == 7);
	  this.importantMoves.leftWhiteRook = this.importantMoves.leftWhiteRook || (txt == "WR" && start[0] == 7 &&  start[1] == 0);
		
		this.board[end[0]][end[1]] = this.board[start[0]][start[1]];
		this.board[start[0]][start[1]] = "";
	}
}

function copy2DArr(arr) {
	var copy = new Array(arr.length);
	for(var r = 0; r < arr.length; r++) {
		var rowarr = new Array(arr[r].length);
		for(var c = 0; c < arr[r].length; c++) 
			rowarr[c] = arr[r][c];
		copy[r] = rowarr;
	}
	return copy;
}
