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
	setHoverAction();
}

function setHoverAction() {
	for(var i = 0; i < 64; i++) {
		var id = "sq"+i;
		document.getElementById(id).onmouseover = handleHoverOn;
		document.getElementById(id).onmouseout = handleHoverOff;
	}
}

function handleHoverOn(event) {
	utils.setHoveredOn(utils.getSquareData(event).coord);
}

function handleHoverOff(event) {
	utils.setHoveredOff(utils.getSquareData(event).coord);
}

function setHandlers() {
	for(var i = 0; i < 64; i++) {
		var id = "sq"+i;
		document.getElementById(id).onclick = handleClick;
	}
}

function handleClick(event) {
	stateMachine.handleInput(utils.getSquareData(event));
}

























