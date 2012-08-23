var old_error, pid_sum = 0;

function followPath() {
	var p = .8, d = 1.2, i = .01;
	
	if (path_lines) 
	{
		var dest = path_lines[path_lines.length-1].p2;
		if (euclidDist(create_point(robot.x, robot.y), dest) < 20) {
			path_lines = null;
			return;
		}
	
		if (robot.velocity < MAX_V) {
			robot.accelerate(DELTA_V);
		}
		
		var error = getCrossCheckError(robot, path_lines);
		if (!error) {
			return;
		}
		
		if (!old_error) {
			old_error = error;
		}
		
		var delta_steering_angle = -p*error + -d*(error - old_error) + -i*pid_sum;
		old_error = error;
		pid_sum += error;
		
		if (delta_steering_angle != 0) {
			robot.steer(delta_steering_angle);
		} 
	} else {
		if (robot.velocity > 0) {
			robot.accelerate(-DELTA_V);
		}
	}
}

function getCrossCheckError(robot, lines) {
	var radius = (robot.width+robot.length)*3/4;
	var circle = create_circle(create_point(robot.x, robot.y), radius);
	var p = false;
	
	for (var i = 0; i < lines.length; i++) {
		var p = dirLineSegCircleIntersection(lines[i], circle);
		if (p) {
			break;
		}
	}
	
	if (!p) {
		return false;
	}
	
	var line_heading = my_atan(p.y-robot.y, p.x-robot.x);
	var res = robot.heading - line_heading;
	
	if (res > Math.PI) {
		res = res - 2*Math.PI;
	} else if (res < -Math.PI) {
		res = res + 2*Math.PI;
	}
	
	return res;
}
