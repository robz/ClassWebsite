var stateObj;

function startup() {
	for(i = 0; i < 64; i++) {
		document.getElementById("sq"+i).onclick = sqclicked;
	}
	stateObj = new StateObj();
	stateObj.render();
}

function imgclicked(mouseEvent) {
  console.log("hi!");
}

function sqclicked(mouseEvent) {
	var source;	
	
	if (mouseEvent.target) source = mouseEvent.target;
	else if (mouseEvent.srcElement) source = mouseEvent.srcElement;
	
	var pieceName = source.innerHTML;
	
	pieceCoord = idToCoord(source.id);
	console.log("["+pieceName+"] @ "+pieceCoord);
	executeState({name:pieceName, coord:pieceCoord});
}

// (row,col) -> sqXX
function coordToID(coord) {
	return "sq"+(coord[0]*8+coord[1]);
}

// sqXX -> (row,col)
function idToCoord(id) {
	var sqnum = parseInt(id.substring(2, id.length));
	return [Math.floor(sqnum/8), sqnum%8];
}

function setDeselected(coord) {
	var id = coordToID(coord);
	var elem = document.getElementById(id);
	var num = parseInt(elem.id.substring(2, elem.id.length));
	elem.className = elem.className.replace( /(?:^|\s)selected(?!\S)/ , '' );
	if ( Math.floor(num/8)%2 == 0 )
		elem.className += " row1 ";
	else 
		elem.className += " row2 ";
}

function setSelected(coord) {
	var id = coordToID(coord);
	var elem = document.getElementById(id);
	elem.className = elem.className.replace( /(?:^|\s)row1(?!\S)/ , '' );
	elem.className = elem.className.replace( /(?:^|\s)row2(?!\S)/ , '' );
	elem.className += " selected ";
}
