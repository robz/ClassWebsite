var PI = Math.PI;
var WHEEL_WIDTH = 10, NUM_TREDS = 5, W_INC = .1;
var KEY_d = 100, KEY_e = 101, KEY_f = 102, KEY_r = 114;
var SIZEX = 600, SIZEY = 600;
var ROBOT_DIM = 60;

var state;
var vel1 = 0, vel2 = 0;

function main() {
	var canvas = document.getElementById("myCanvas");
	
	getBrowserWindowSizeInit();
	browserSize = getSize();
	SIZEX = browserSize.width-30;
	SIZEY = browserSize.height-50;
	canvas.width = SIZEX;
	canvas.height = SIZEY;
	
	state = makeState(SIZEX/2,SIZEY/2,0,ROBOT_DIM);
	setInterval("repaint();", 17);
	setInterval("updateState();", 20);
	
	canvas.onkeypress = keyPressed;
}

function keyPressed(event) {
	var key = event.which;
	//console.log(key);
	
	var nvel1 = vel1, nvel2 = vel2;
	if (key == KEY_r) {
		if (vel1 < W_INC*10)
			nvel1 += W_INC;
	} else if (key == KEY_f) {
		if (vel1 > -W_INC*10)
			nvel1 -= W_INC;
	} else if (key == KEY_e) {
		if (vel2 < W_INC*10)
			nvel2 += W_INC;
	} else if (key == KEY_d) {
		if (vel2 > -W_INC*10)
			nvel2 -= W_INC;
	} 
	
	vel1 = round4(nvel1);
	vel2 = round4(nvel2);
}

function updateState() {
	//console.log("updating: "+vel1+","+vel2);
	
	if (vel1 != 0 || vel2 != 0)
		state.update(vel1,vel2);
}

function repaint() {
	//console.log("repainting!");
	
	var vals = state.getPoints();
	var corners = state.getCorners();
	var treds = state.getTreds();
	var wheels = state.getWheels();
	
	var canvas = document.getElementById("myCanvas");
	var g2 = canvas.getContext("2d");
	
	// clear the background
	g2.fillStyle = "lightblue";
	g2.fillRect(0,0,SIZEX,SIZEY);
	
	// robot body
	g2.fillStyle = "gray";
	g2.beginPath();
	g2.moveTo(corners[0][0],corners[0][1]);
	g2.lineTo(corners[1][0],corners[1][1]);
	g2.lineTo(corners[3][0],corners[3][1]);
	g2.lineTo(corners[2][0],corners[2][1]);
	g2.closePath();
	g2.fill();
	
	// wheel rects
	g2.fillStyle = "darkblue";
	g2.beginPath();
	g2.moveTo(wheels[0][0][0],wheels[0][0][1]);
	g2.lineTo(wheels[0][1][0],wheels[0][1][1]);
	g2.lineTo(wheels[0][2][0],wheels[0][2][1]);
	g2.lineTo(wheels[0][3][0],wheels[0][3][1]);
	g2.closePath();
	g2.fill();
	g2.beginPath();
	g2.moveTo(wheels[1][0][0],wheels[1][0][1]);
	g2.lineTo(wheels[1][1][0],wheels[1][1][1]);
	g2.lineTo(wheels[1][2][0],wheels[1][2][1]);
	g2.lineTo(wheels[1][3][0],wheels[1][3][1]);
	g2.closePath();
	g2.fill();
	
	// treds
	g2.strokeStyle = "darkblue";
	for(var i = 0; i < treds.length; i++) {
		g2.beginPath();
		g2.arc(treds[i][0],treds[i][1],WHEEL_WIDTH/2+treds[i][2]/6,0,2*Math.PI,true);
		g2.closePath();
		g2.fill();
	}
	
	// axis & direction lines
	g2.strokeStyle = "black";
	g2.beginPath();
	g2.moveTo(corners[0][0],corners[0][1]);
	g2.lineTo(corners[1][0],corners[1][1]);
	g2.moveTo(vals[0][0],vals[0][1]);
	g2.lineTo(vals[1][0],vals[1][1]);
	g2.closePath();
	g2.stroke();
	
	// text
	g2.fillStyle = "black";
	g2.font = "bold 1em sans-serif"; 
	g2.textalign = "right"; 
	g2.fillText("motor 1: "+vel1, 20, 20);
	g2.fillText("motor 2: "+vel2, 20, 40);
	g2.fillText("wheel 1: "+Math.round(state.totalw1), 20, 60);
	g2.fillText("wheel 2: "+Math.round(state.totalw2), 20, 80);
}

function cos(x) { return Math.cos(x); }
function sin(x) { return Math.sin(x); }
function abs(x) { return Math.abs(x); }
function round4(x) {return Math.round(x*10000)/10000.0; }

function roundVals(vals) {
	for(var i = 0; i < vals.length; i++) 
		vals[i] = Math.round(vals[i]);
	return vals;
}

function makeState(xs, ys, thetas, ds) {
	return {
		x: xs,
		y: ys,
		theta: thetas,
		d: ds,
		totalw1: 0,
		totalw2: 0,
		
		update: function(w1,w2) {
			var x2 = this.x, y2 = this.y, theta2 = this.theta, 
				x = this.x, y = this.y, theta = this.theta, d = this.d;
				
			this.totalw1 += w1;
			this.totalw2 += w2;
			
			if(w1 == w2) {
				x2 = x + w1*cos(theta);
				y2 = y + w1*sin(theta);
				theta2 = theta;
			} else if (w1 > w2 && w2 >= 0) {
				var phi = (w1-w2)/d,
					r = d*(w1+w2)/(2*(w1-w2));
				x2 = x + r*( sin(theta) + sin(phi-theta) );
				y2 = y + r*( -cos(theta) + cos(theta-phi) );
				theta2 = theta - phi;
			} else if (w2 > w1 && w1 >= 0) {
				var phi = (w2-w1)/d,
					r = d*(w1+w2)/(2*(w2-w1));
				x2 = x + r*( -sin(theta) + sin(theta+phi) );
				y2 = y + r*( cos(theta) - cos(theta+phi) );
				theta2 = theta + phi;
			} else if (w1 < w2 && w2 <= 0) {
				w1 = abs(w1);
				w2 = abs(w2);
				var phi = (w1-w2)/d,
					r = d*(w1+w2)/(2*(w1-w2));
				x2 = x + r*( sin(theta) - sin(theta+phi) );
				y2 = y + r*( -cos(theta) + cos(theta+phi) );
				theta2 = theta + phi;
			} else if (w2 < w1 && w1 <= 0) {
				w1 = abs(w1);
				w2 = abs(w2);
				var phi = (w2-w1)/d,
					r = d*(w1+w2)/(2*(w2-w1));
				x2 = x + r*( -sin(theta) + sin(theta-phi) );
				y2 = y + r*( cos(theta) - cos(theta-phi) );
				theta2 = theta - phi;
			} else if (w1 > 0 && w2 < 0 && abs(w1) >= abs(w2)) {
				w2 = abs(w2);
				var phi = (w1+w2)/d,
					z = d*(w1-w2)/(2*(w1+w2));
				x2 = x + z*( sin(theta) - sin(theta-phi) );
				y2 = y + z*( -cos(theta) + cos(theta-phi) );
				theta2 = theta - phi;
			} else if (w1 < 0 && w2 > 0 && abs(w2) >= abs(w1)) {
				w1 = abs(w1);
				var phi = (w1+w2)/d,
					z = d*(w2-w1)/(2*(w1+w2));
				x2 = x + z*( -sin(theta) + sin(theta+phi) );
				y2 = y + z*( cos(theta) - cos(theta+phi) );
				theta2 = theta+phi;
			} else if (w1 > 0 && w2 < 0 && abs(w1) <= abs(w2)) {
				w2 = abs(w2);
				var phi = (w1+w2)/d,
					z = d*(w1-w2)/(2*(w1+w2));
				x2 = x + z*( sin(theta) - sin(theta-phi) );
				y2 = y + z*( -cos(theta) + cos(theta-phi) );
				theta2 = theta-phi;
			} else if (w1 < 0 && w2 > 0 && abs(w2) <= abs(w1)) {
				w1 = abs(w1);
				var phi = (w1+w2)/d,
					z = d*(w2-w1)/(2*(w1+w2));
				x2 = x + z*( -sin(theta) + sin(theta+phi) );
				y2 = y + z*( cos(theta) - cos(theta+phi) );
				theta2 = theta + phi;
			} else {
				console.log("ERROR: "+w1+","+w2);
				while(true);
			}
			
			this.x = x2;
			this.y = y2;
			this.theta = theta2;
		},
		
		// returns [[x,y],[xc,yc]]
		getPoints: function() {
			var x = this.x, y = this.y, theta = this.theta, d = this.d;
			return [
				roundVals([x, y]),
				roundVals([x + (d/2.0)*cos(theta), y + (d/2.0)*sin(theta)])
			];
		},
		
		// returns [[x1,y1],[x2,y2],[x3,y3],[x4,y4]]
		getCorners: function() {
			var x = this.x, y = this.y, theta = this.theta, d = this.d;
			var x1 = x - (d/2.0)*sin(theta),
				y1 = y + (d/2.0)*cos(theta),
				x2 = x + (d/2.0)*sin(theta),
				y2 = y - (d/2.0)*cos(theta);
			return [
				roundVals([x1,y1]),
				roundVals([x2,y2]),
				roundVals([x1+d*cos(theta), y1+d*sin(theta)]),
				roundVals([x2+d*cos(theta), y2+d*sin(theta)])
			];
		},
		
		// returns [[x1,y1],...,[xN,yN]] where N = NUM_TREDS*2
		getTreds: function() {
			var x = this.x, y = this.y, theta = this.theta, d = this.d, 
				totalw1 = this.totalw1, totalw2 = this.totalw2;
			var x1 = x - (d/2.0+WHEEL_WIDTH/2)*sin(theta),
				y1 = y + (d/2.0+WHEEL_WIDTH/2)*cos(theta),
				x2 = x + (d/2.0+WHEEL_WIDTH/2)*sin(theta),
				y2 = y - (d/2.0+WHEEL_WIDTH/2)*cos(theta);
			var r = d/4, phi1 = -totalw1/r, phi2 = -totalw2/r;
			
			var treds = new Array(2*NUM_TREDS);
			for(var i = 0; i < NUM_TREDS; i++)
				treds[i] = roundVals([x1+r*cos(phi1+i*PI/(NUM_TREDS/2))*cos(theta), 
					y1+r*cos(phi1+i*PI/(NUM_TREDS/2))*sin(theta),
					r*sin(phi1+i*PI/(NUM_TREDS/2))]);
			for(var i = 0; i < NUM_TREDS; i++)
				treds[NUM_TREDS+i] = roundVals([x2+r*cos(phi2+i*PI/(NUM_TREDS/2))*cos(theta), 
					y2+r*cos(phi2+i*PI/(NUM_TREDS/2))*sin(theta),
					r*sin(phi2+i*PI/(NUM_TREDS/2))]);
					
			return treds;
		},
	
		// returns [[[x11,y11],[],[],[]],[[x21,y21],[],[],[x24,y24]]
		getWheels: function() {
			var x = this.x, y = this.y, theta = this.theta, d = this.d;
			var r = d/4;
			
			var x1c1 = x - (d/2.0)*sin(theta),
				y1c1 = y + (d/2.0)*cos(theta),
				x1c2 = x - (d/2.0+WHEEL_WIDTH)*sin(theta),
				y1c2 = y + (d/2.0+WHEEL_WIDTH)*cos(theta),
				x2c1 = x + (d/2.0)*sin(theta),
				y2c1 = y - (d/2.0)*cos(theta),
				x2c2 = x + (d/2.0+WHEEL_WIDTH)*sin(theta),
				y2c2 = y - (d/2.0+WHEEL_WIDTH)*cos(theta);
				
			return [
				[
					[x1c1 + r*cos(theta), y1c1 + r*sin(theta)],
					[x1c2 + r*cos(theta), y1c2 + r*sin(theta)],
					[x1c2 - r*cos(theta), y1c2 - r*sin(theta)],
					[x1c1 - r*cos(theta), y1c1 - r*sin(theta)]
				],
				[
					[x2c1 + r*cos(theta), y2c1 + r*sin(theta)],
					[x2c2 + r*cos(theta), y2c2 + r*sin(theta)],
					[x2c2 - r*cos(theta), y2c2 - r*sin(theta)],
					[x2c1 - r*cos(theta), y2c1 - r*sin(theta)]
				]
			];
		},
		
		toString: function() {
			var x_approx = round4(this.x),
				y_approx = round4(this.y),
				theta_approx = round4(this.theta);
			return "("+x_approx+","+y_approx+") ; "+theta_approx;
		}
	};
}