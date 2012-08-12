// turned off: robots are modified, not cloned
var REPLACE_ROBOT_DYNAMICALLY = false;

var PI = Math.PI, SCALE = 2, WHEEL_WIDTH = 4*SCALE, WHEEL_LENGTH = 15*SCALE,
	DELTA_ALPHA = PI/20, DELTA_V = .005, MAX_ALPHA_ACKERMAN = PI/3, MAX_ALPHA_CRAB = 3*PI/4, MAX_V = .1,
	KEY_w = 87, KEY_s = 83, KEY_a = 65, KEY_d = 68, KEY_space = 32,
	KEY_NAMES = {
		87 : "up",
		83 : "down",
		65 : "left",
		68 : "right",
		32 : "stop"
		};

var real_robot;

window.onload = function() 
{
	//real_robot = ackerman_robot(100, 100, 0, 0, 0, 40*SCALE, 40*SCALE, 0);
	//real_robot = tank_robot(100, 100, 0, 0, 0, 40*SCALE, 40*SCALE, 0);
	//real_robot = crab_robot(100, 100, 0, 0, 0, 40*SCALE, 40*SCALE, 0);
	
	real_robot = [
		ackerman_robot(100, 100, 0, 0, 0, 40*SCALE, 40*SCALE, 0),
		tank_robot(100, 100, 0, 0, 0, 40*SCALE, 40*SCALE, 0),
		crab_robot(100, 100, 0, 0, 0, 40*SCALE, 40*SCALE, 0)
		];

	setInterval(paintCanvas, 30);
}

function keydown(event, i) 
{
	if (real_robot[i].type == ACKERMAN || real_robot[i].type == CRAB) {
		keydown_ackerman_crab(event, real_robot[i]);
	} else if (real_robot[i].type == TANK) {
		keydown_tank(event, real_robot[i]);
	}
}

function keydown_tank(event, my_robot, index) 
{
	var key = event.which;
	//console.log(KEY_NAMES[key]+"!");
	
	var delta_wheel1_velocity = 0, delta_wheel2_velocity = 0;
	
	if (key == KEY_w) {
		delta_wheel1_velocity = DELTA_V;
		delta_wheel2_velocity = DELTA_V;
	} else if (key == KEY_s) {
		delta_wheel1_velocity = -DELTA_V;
		delta_wheel2_velocity = -DELTA_V;
	} else if (key == KEY_a) {
		delta_wheel1_velocity = DELTA_V;
		delta_wheel2_velocity = -DELTA_V;
	} else if (key == KEY_d) {
		delta_wheel1_velocity = -DELTA_V;
		delta_wheel2_velocity = DELTA_V;
	} else if (key == KEY_space) {
		delta_wheel1_velocity = -my_robot.wheel1_velocity;
		delta_wheel2_velocity = -my_robot.wheel2_velocity;
	} else {
		return;
	}
	
	if (delta_wheel1_velocity + my_robot.wheel1_velocity > MAX_V) {
		delta_wheel1_velocity = MAX_V - my_robot.wheel1_velocity;
	} else if (delta_wheel1_velocity + my_robot.wheel1_velocity < -MAX_V) {
		delta_wheel1_velocity = -MAX_V - my_robot.wheel1_velocity;
	}
	
	if (delta_wheel2_velocity + my_robot.wheel2_velocity > MAX_V) {
		delta_wheel2_velocity = MAX_V - my_robot.wheel2_velocity;
	} else if (delta_wheel2_velocity + my_robot.wheel2_velocity < -MAX_V) {
		delta_wheel2_velocity = -MAX_V - my_robot.wheel2_velocity;
	}
	
	if (REPLACE_ROBOT_DYNAMICALLY) {
		my_robot = my_robot.update();
	} else {
		my_robot.update();
	}
		
	var new_robot = my_robot.accelerate_wheels(delta_wheel1_velocity, 	
												 delta_wheel2_velocity); 
	
	if (REPLACE_ROBOT_DYNAMICALLY) {
		real_robot[index] = new_robot;
	}
}

function keydown_ackerman_crab(event, my_robot, index)
{
	var key = event.which;
	//console.log(KEY_NAMES[key]+"!");
	
	var delta_velocity = 0, delta_steering_angle = 0;
	
	if (key == KEY_w) {
		delta_velocity = DELTA_V;
	} else if (key == KEY_s) {
		delta_velocity = -DELTA_V;
	} else if (key == KEY_a) {
		delta_steering_angle = -DELTA_ALPHA;
	} else if (key == KEY_d) {
		delta_steering_angle = DELTA_ALPHA;
	} else if (key == KEY_space) {
		delta_velocity = -my_robot.velocity;
	} else {
		return;
	}
	
	if (delta_velocity + my_robot.velocity <= MAX_V && 
		delta_velocity + my_robot.velocity >= -MAX_V &&
		((my_robot.type == CRAB &&
		delta_steering_angle + my_robot.steering_angle < MAX_ALPHA_CRAB &&
		delta_steering_angle + my_robot.steering_angle > -MAX_ALPHA_CRAB) ||
		(my_robot.type == ACKERMAN &&
		delta_steering_angle + my_robot.steering_angle < MAX_ALPHA_ACKERMAN &&
		delta_steering_angle + my_robot.steering_angle > -MAX_ALPHA_ACKERMAN)) )
	{
		if (REPLACE_ROBOT_DYNAMICALLY) {
			my_robot = my_robot.update();
		} else {
			my_robot.update();
		}
		
		var new_robot;	
		if (delta_velocity != 0) {
			new_robot = my_robot.accelerate(delta_velocity);
		} else if (delta_steering_angle != 0) {
			new_robot = my_robot.steer(delta_steering_angle);
		} 
		
		if (REPLACE_ROBOT_DYNAMICALLY) {
			real_robot[index] = new_robot;
		}
	}
}

function paintCanvas() 
{
	for(index = 0; index < real_robot.length; index++) {
		var canvas = document.getElementById("canvas"+index);
		var context = canvas.getContext("2d");
		
		context.fillStyle = "lightGray";
		context.fillRect(0, 0, canvas.width, canvas.height);
		
		if (REPLACE_ROBOT_DYNAMICALLY) {
			real_robot[index] = real_robot[index].update();
		} else {
			real_robot[index].update();
		}
		
		real_robot[index].draw(context);
	}
}