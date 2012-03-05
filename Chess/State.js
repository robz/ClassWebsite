/* TODO:
state.isWin()
state.isLose()
state.getLegalActions('W'/'B')
state.generateSuccessor('W'/'B', action)
state.evaluate()
*/

var piecescores = {
	'P':1,
	'R':5,
	'H':3,
	'B':3,
	'K':999,
	'Q':9,
}

function StateObj(b, oldscore) {
	
	alert("hi...?");
	if (!b && !oldscore) {
		this.board = 
		[["BR","BH","BB","BK","BQ","BB","BH","BR"],
		 ["BP","BP","BP","BP","BP","BP","BP","BP"],
		 ["","","","","","","",""],
		 ["","","","","","","",""],
		 ["","","","","","","",""],
		 ["","","","","","","",""],
		 ["WP","WP","WP","WP","WP","WP","WP","WP"],
		 ["WR","WH","WB","WK","WQ","WB","WH","WR"]];
		this.score = [0,0];
	} else if (b && oldscore) {
		this.board = b;
		this.score = [oldscore[0], oldscore[1]];
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
	
		this.move(side, action);
		
		var dif = [scoretemp[0]-this.score[0], scoretemp[1]-this.score[1]];
		
		return {scoredif:dif, premd:removedPiece, pmovd:movedPiece};
	}
	
	this.degenerateSuccessor = function(undo) {
		this.score = [this.score[0]+undo.scoredif[0], this.score[1]+undo.scoredif[1]];
		this.board[undo.pmovd.coord[0]][undo.pmovd.coord[1]] = undo.pmovd.name;
		this.board[undo.premd.coord[0]][undo.premd.coord[1]] = undo.premd.name;
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
	
	this.render = function(){
		for(var r = 0; r < this.board.length; r++) {
			for(var c = 0; c < this.board[r].length; c++) {
				document.getElementById(coordToID([r,c])).innerHTML = this.board[r][c];
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