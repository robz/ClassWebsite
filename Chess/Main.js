var utils;
var gameState;
var stateMachine;
var rules;
var agent;

function startup() {
	utils = new Utils();
	gameState = new GameState();
	gameState.render();
	stateMachine = new StateMachine();
	rules = new ChessRules();
	agent = new AI();
	
	setHandlers();
}

function setHandlers() {
	for(var i = 0; i < 64; i++) {
		var id = "sq"+i;
		document.getElementById(id).onclick = handleClick;
	}
}

function handleClick(event) {
	var elem = utils.getEventElement(event);
	var typeName = utils.getTypeName(elem);
	var c, n;
		
	if (typeName == "HTMLImageElement") {
		c = utils.imgIDToCoord(elem.id);
		n = utils.imgNameToText(utils.getElemSrcFileName(elem));
	} else if (typeName == "HTMLTableCellElement") {
		c = utils.idToCoord(elem.id);
		if(elem.childNodes[0]) {
			n = utils.imgNameToText(utils.getElemSrcFileName(
				elem.childNodes[0]));
		} else {
			n = "";
		}
	} else {
		console.log("ERROR: unexpected typeName \""+typeName+"\"!!!");
	}
	
	//console.log("["+n +"] @ "+c);
	stateMachine.handleInput({name:n, coord:c});
}

























