var initSize = {width:2000,height:1000};
var canvasSize = {width:initSize.width,height:initSize.height};
var canvas;
var circles;

var drawTimeout = 40,
	moveTimeout = 40;

function canvasInit() {
	makeCircles();
	canvas = document.getElementById("pallet");
	paintPallet();
	window.onresize = paintPallet;
	setTimeout(moveCircles, moveTimeout);
	setTimeout(drawCircles, drawTimeout);
}

function makeCircles() {
	var browserSize = getSize();
	circles = new Array();
	var numCircles = 5+Math.floor(5*Math.random()+1);
	for(var i = 0; i < numCircles; i++) {
		var myr = 30+50*Math.random();
		var myx = myr+(browserSize.width-myr*2-20)*Math.random(),
			myy = myr+(browserSize.height-myr*2-20)*Math.random();
		var myd = Math.PI*2*Math.random(),
			mys = 5+5*Math.random();
		var myc = (Math.floor(0x7F*Math.random())<<16)
			+(Math.floor(0x7F*Math.random())<<8)
			+(Math.floor(0x7F*Math.random()));
		circles[i] = {r:myr,x:myx,y:myy,d:myd,s:mys,c:myc};
	}
}

var sideArr = [
	function() {return {ddif:0};},
	function() {return {ddif:Math.PI};}
];

var boundsArr = [
	null, //0000
	sideArr[0], // 0001
	sideArr[1], // 0010
	sideArr[1], // 0011
	sideArr[0], // 0100
	null, //0101
	sideArr[1], //0110
	null, //0111
	sideArr[1], //1000
	sideArr[1], //1001
	null, //1010
	null, //1011
	sideArr[1], //1100
	null, //1101
	null, //1110
	null  //1111
];

function moveCircles() {
	for(var i = 0; i < circles.length; i++) {
		moveCircle(circles[i]);
	}
	setTimeout(moveCircles, moveTimeout);
}

function moveCircle(circle) {
	var tempx = circle.x+circle.s*Math.cos(circle.d);
	var tempy = circle.y+circle.s*Math.sin(circle.d);
	
	var linesCrossed = checkBounds(tempx,tempy,circle.r)
	if (linesCrossed == 0) {
		circle.x = tempx;
		circle.y = tempy;
	} else {
		//alert(linesCrossed.toString(2));
		var boundFunct = boundsArr[linesCrossed];
		if (!boundFunct) {
			alert("bounds error: "+linesCrossed.toString(2));
		} else {
			var bounds = boundFunct();
			circle.d = (bounds.ddif-circle.d+2*Math.PI)%(2*Math.PI);
			circle.c = (Math.floor(0x7F*Math.random())<<16)
				+(Math.floor(0x7F*Math.random())<<8)
				+(Math.floor(0x7F*Math.random()));
		}
	}
}

function checkBounds(x, y, r) {
	return toN(y-r < 0) |
		(toN(x+r > canvas.width) << 1) |
		(toN(y+r > canvas.height) << 2) |
		(toN(x-r < 0) << 3);
}

function toN(b) {
	return b?1:0;
}

function paintPallet(e) {
	var browserSize = getSize();
	canvasSize.width = browserSize.width;
	canvasSize.height = browserSize.height;
	canvas.width = canvasSize.width;
	canvas.height = canvasSize.height;
}

function drawCircles() {
	if(!canvas.getContext){return;}
	var ctx = canvas.getContext("2d");
	
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	for(var i = 0; i < circles.length; i++) {
		ctx.beginPath();
		ctx.arc(circles[i].x,circles[i].y,circles[i].r,0,Math.PI*2,false);
		ctx.fillStyle = "#"+fillZeros(circles[i].c.toString(16));
		ctx.fill();
	}
	setTimeout(drawCircles, drawTimeout);
}

function fillZeros(str) {
	for(var i = str.length; i < 6; i++) 
		str = "0"+str;
	return str;
}