// console.log(getAllMoves(newPiece.name[0] == 'W'));

var state = 0;
var prevPiece = null;
var nextMoves = null;

function executeState(newPiece) {
	[state0, state1][state](newPiece);
}

function state0(newPiece) {
	if (newPiece.name == "" || newPiece.name[0] == 'B') return;
	setSelected(newPiece.coord);
	prevPiece = newPiece;
	nextMoves = getPieceMoves(newPiece);
	state = 1;
}

function state1(newPiece) {
	if (contains(nextMoves, newPiece.coord)) {
		executeMove(prevPiece.coord, newPiece.coord);
		setDeselected(prevPiece.coord);
		prevPiece = null;
		state = 2;
		executeAIMove();
	} else {
		if (newPiece.coord[0] == prevPiece.coord[0] 
				&& newPiece.coord[1] == prevPiece.coord[1]) {
			setDeselected(newPiece.coord);
			state = 0;
		}
	}
}

function executeMove(start, end) {
	move(start, end);
}

function executeAIMove() {
	var move = randomMove();
	executeMove(move.start, move.end);
	state = 0;
}

// checking if a move is in an array of moves 
function contains(arr, obj) {
    var i = arr.length;
    while (i--) {
       if (arr[i][0] == obj[0] && arr[i][1] == obj[1]) {
           return true;
       }
    }
    return false;
}
