var ACKERMAN = 0, TANK = 1, CRAB = 2;

// wheels and corners are created here to avoid allocating memory dynamically
var wheels = [[{x:0,y:0}, {x:0,y:0}, {x:0,y:0}, {x:0,y:0}],
			  [{x:0,y:0}, {x:0,y:0}, {x:0,y:0}, {x:0,y:0}],
			  [{x:0,y:0}, {x:0,y:0}, {x:0,y:0}, {x:0,y:0}],
			  [{x:0,y:0}, {x:0,y:0}, {x:0,y:0}, {x:0,y:0}]]
	corners = [{x:0,y:0}, {x:0,y:0}, {x:0,y:0}, {x:0,y:0}];
	
var cos = Math.cos, sin = Math.sin, abs = Math.abs;

function cognitoware_robot(x, y, heading, wheel1_velocity, wheel2_velocity, length, width, 
			last_time_updated) 
{
	my_robot = {
		type : TANK,
		x : x,
		y : y,
		heading : heading,
		wheel1_velocity : wheel1_velocity,
		wheel2_velocity : wheel2_velocity,
		length : length,
		width : width,
		last_time_updated: last_time_updated,
		
		set : function (x, y, heading, wheel1_velocity, wheel2_velocity, length, width,
				last_time_updated) 
		{
			this.x = x;
			this.y = y;
			this.heading = heading;
			this.wheel1_velocity = wheel1_velocity;
			this.wheel2_velocity = wheel2_velocity;
			this.width = width;
			this.last_time_updated = last_time_updated;
		},
		
		update: function() {
			var cur_time = new Date().getTime(),
				delta_time = cur_time - this.last_time_updated;
			this.last_time_updated = cur_time;
			
			if (this.wheel1_velocity == 0 && this.wheel2_velocity == 0)
				return;
		
			var v = (this.wheel1_velocity + this.wheel2_velocity)/2,
				phi = (this.wheel1_velocity - this.wheel2_velocity)/this.width,
				R = v/phi;
				
			console.log("v: "+v+", phi: "+phi+", R: "+R);
				
			var new_x = this.x - R*sin(this.heading) + R*sin(this.heading + phi*delta_time),
				new_y = this.y + R*cos(this.heading) - R*cos(this.heading + phi*delta_time),
				new_heading = this.heading + phi*delta_time;
				
			console.log("new_x: "+new_x+", new_y: "+new_y+", new_heading: "+new_heading);
			
			if (REPLACE_ROBOT_DYNAMICALLY) {
				return tank_robot(new_x, new_y, new_heading, this.wheel1_velocity, 
							this.wheel2_velocity, this.length, this.width, this.last_time_updated);
			} else {
				this.set(new_x, new_y, new_heading, this.wheel1_velocity, 
					this.wheel2_velocity, this.length, this.width, this.last_time_updated);
			}
		},
		
		accelerate_wheels : function(delta_wheel1_velocity, delta_wheel2_velocity) {
			var new_wheel1_velocity = this.wheel1_velocity + delta_wheel1_velocity,
				new_wheel2_velocity = this.wheel2_velocity + delta_wheel2_velocity;
			
			if (REPLACE_ROBOT_DYNAMICALLY) {
				return tank_robot(this.x, this.y, this.heading, new_wheel1_velocity, 
							new_wheel2_velocity, this.length, this.width, this.last_time_updated);
			} else {
				this.set(this.x, this.y, this.heading, new_wheel1_velocity, 
					new_wheel2_velocity, this.length, this.width, this.last_time_updated);
			}
		},
		
		get_corners : function() {
			var theta = this.heading,
				W = this.width,
				L = this.length,
				x = this.x,
				y = this.y;
				
			corners[0].x = x + (W/2)*cos(theta + PI/2); 	
			corners[0].y = y + (W/2)*sin(theta + PI/2);
			corners[3].x = x + (W/2)*cos(theta + 3*PI/2); 
			corners[3].y = y + (W/2)*sin(theta + 3*PI/2);
			corners[1].x = corners[0].x + L*cos(theta); 
			corners[1].y = corners[0].y + L*sin(theta);
			corners[2].x = corners[3].x + L*cos(theta); 
			corners[2].y = corners[3].y + L*sin(theta);
			
			return corners;
		},
		
		// returns [[{x:x11,y:y11},...,{x:x14,y:y14}],[{x:x21,y:y21},...]]
		get_wheels : function(corners) {
			var W = WHEEL_WIDTH,
				L = WHEEL_LENGTH,
				x = this.x,
				y = this.y;
			
			for (var i = 0; i < 2; i++) {
				var theta = this.heading,
					c = corners[i*3];
					
				var t1x = c.x + W*cos(theta + PI/2), 	
					t1y = c.y + W*sin(theta + PI/2),
					t2x = c.x + W*cos(theta + 3*PI/2), 	
					t2y = c.y + W*sin(theta + 3*PI/2);
					
				wheels[i][0].x = t1x + (L/2)*cos(theta + PI); 
				wheels[i][0].y = t1y + (L/2)*sin(theta + PI);
				wheels[i][1].x = t1x + (L/2)*cos(theta); 	
				wheels[i][1].y = t1y + (L/2)*sin(theta);
				wheels[i][3].x = t2x + (L/2)*cos(theta + PI); 
				wheels[i][3].y = t2y + (L/2)*sin(theta + PI);
				wheels[i][2].x = t2x + (L/2)*cos(theta); 	
				wheels[i][2].y = t2y + (L/2)*sin(theta);
			}
			
			return wheels;
		},
		
		get_caster : function(corners) {
			var c = corners[1];
			return {x: c.x + (this.width/2)*cos(this.heading - PI/2), 
					y: c.y + (this.width/2)*sin(this.heading - PI/2)};
		},
		
		draw : function(context) {
			this.get_corners();
			this.get_wheels(corners);
			var caster = this.get_caster(corners);
			
			context.lineWidth = 3;
			context.strokeStyle = "green";
			context.beginPath();
			context.moveTo(corners[0].x, corners[0].y);
			for(i = 1; i < corners.length; i++) {
				context.lineTo(corners[i].x, corners[i].y);
			}
			context.closePath();
			context.stroke();
			
			context.lineWidth = 1;
			context.strokeStyle = "black";
			for (j = 0; j < 2; j++) {
				var wheel = wheels[j];
				context.beginPath();
				context.moveTo(wheel[0].x, wheel[0].y);
				for(i = 1; i < wheel.length; i++) {
					context.lineTo(wheel[i].x, wheel[i].y);
				}
				context.closePath();
				context.stroke();
			}
			
			context.beginPath();
			context.arc(caster.x, caster.y, WHEEL_WIDTH, 0, 2*PI, false);
			context.stroke();
		}
	};
	
	return my_robot;
}

function crab_robot(x, y, heading, steering_angle, velocity, length, width,
			last_time_updated) 
{
	my_robot = {
		type : CRAB,
		x : x,
		y : y,
		heading : heading,
		steering_angle : steering_angle,
		velocity : velocity,
		length : length,
		width : width,
		last_time_updated: last_time_updated,
		
		set : function (x, y, heading, steering_angle, velocity, length, width,
				last_time_updated) 
		{
			this.x = x;
			this.y = y;
			this.heading = heading;
			this.steering_angle = steering_angle;
			this.velocity = velocity;
			this.length = length;
			this.width = width;
			this.last_time_updated = last_time_updated;
		},
		
		update : function() {
			var cur_time = new Date().getTime(),
				delta_time = cur_time - this.last_time_updated,
				delta_distance = this.velocity*delta_time;	
			if (!this.last_time_updated) {
				delta_distance = 0;
			}
			this.last_time_updated = cur_time;
		
			var theta = this.heading + this.steering_angle;
			
			var new_x = this.x + delta_distance*cos(theta),
				new_y = this.y + delta_distance*sin(theta),
				new_heading = this.heading;
			
			if (REPLACE_ROBOT_DYNAMICALLY) {
				return ackerman_robot(new_x, new_y, new_heading, this.steering_angle, 
							this.velocity, this.length, this.width, this.last_time_updated);
			} else {
				this.set(new_x, new_y, new_heading, this.steering_angle, this.velocity, 
					this.length, this.width, this.last_time_updated);
			}
		},
		
		steer : function(delta_steering_angle) {
			var new_steering_angle = this.steering_angle + delta_steering_angle;
			
			if (REPLACE_ROBOT_DYNAMICALLY) {
				return ackerman_robot(this.x, this.y, this.heading, new_steering_angle, 
							this.velocity, this.length, this.width, this.last_time_updated);
			} else {
				this.set(this.x, this.y, this.heading, new_steering_angle, this.velocity, 
					this.length, this.width, this.last_time_updated);
			}
		},
		
		accelerate : function(delta_velocity) {
			var new_velocity = this.velocity + delta_velocity;
			
			if (REPLACE_ROBOT_DYNAMICALLY) {
				return ackerman_robot(this.x, this.y, this.heading, this.steering_angle, 
							new_velocity, this.length, this.width, this.last_time_updated);
			} else {
				this.set(this.x, this.y, this.heading, this.steering_angle, new_velocity, 
					this.length, this.width, this.last_time_updated);
			}
		},
		
		// returns [{x:x1,y:y1},...,{x:x4,y:y4}]
		get_corners : function() {
			var theta = this.heading,
				W = this.width,
				L = this.length,
				x = this.x,
				y = this.y;
				
			corners[0].x = x + (W/2)*cos(theta + PI/2); 	
			corners[0].y = y + (W/2)*sin(theta + PI/2);
			corners[3].x = x + (W/2)*cos(theta + 3*PI/2); 
			corners[3].y = y + (W/2)*sin(theta + 3*PI/2);
			corners[1].x = corners[0].x + L*cos(theta); 
			corners[1].y = corners[0].y + L*sin(theta);
			corners[2].x = corners[3].x + L*cos(theta); 
			corners[2].y = corners[3].y + L*sin(theta);
			
			return corners;
		},
		
		// returns [[{x:x11,y:y11},...,{x:x14,y:y14}],...,[{x:x41,y:y41},...]]
		get_wheels : function(corners) {
			var W = WHEEL_WIDTH,
				L = WHEEL_LENGTH,
				x = this.x,
				y = this.y,
				theta = this.heading + this.steering_angle;
			
			for (var i = 0; i < 4; i++) {
				var c = corners[i];
					
				var t1x = c.x + W*cos(theta + PI/2), 	
					t1y = c.y + W*sin(theta + PI/2),
					t2x = c.x + W*cos(theta + 3*PI/2), 	
					t2y = c.y + W*sin(theta + 3*PI/2);
					
				wheels[i][0].x = t1x + (L/2)*cos(theta + PI); 
				wheels[i][0].y = t1y + (L/2)*sin(theta + PI);
				wheels[i][1].x = t1x + (L/2)*cos(theta); 	
				wheels[i][1].y = t1y + (L/2)*sin(theta);
				wheels[i][3].x = t2x + (L/2)*cos(theta + PI); 
				wheels[i][3].y = t2y + (L/2)*sin(theta + PI);
				wheels[i][2].x = t2x + (L/2)*cos(theta); 	
				wheels[i][2].y = t2y + (L/2)*sin(theta);
			}
			
			return wheels;
		},
		
		draw : function(context) {
			this.get_corners();
			this.get_wheels(corners);

			context.lineWidth = 3;
			context.strokeStyle = "orange";
			context.beginPath();
			context.moveTo(corners[0].x, corners[0].y);
			for(i = 1; i < corners.length; i++) {
				context.lineTo(corners[i].x, corners[i].y);
			}
			context.closePath();
			context.stroke();
			
			context.lineWidth = 1;
			context.strokeStyle = "black";
			for (j = 0; j < wheels.length; j++) {
				var wheel = wheels[j];
				context.beginPath();
				context.moveTo(wheel[0].x, wheel[0].y);
				for(i = 1; i < wheel.length; i++) {
					context.lineTo(wheel[i].x, wheel[i].y);
				}
				context.closePath();
				context.stroke();
			}
		},
	};
	
	return my_robot;
}

function tank_robot(x, y, heading, wheel1_velocity, wheel2_velocity, length, width, 
			last_time_updated) 
{
	my_robot = {
		type : TANK,
		x : x,
		y : y,
		heading : heading,
		wheel1_velocity : wheel1_velocity,
		wheel2_velocity : wheel2_velocity,
		length : length,
		width : width,
		last_time_updated: last_time_updated,
		
		set : function (x, y, heading, wheel1_velocity, wheel2_velocity, length, width,
				last_time_updated) 
		{
			this.x = x;
			this.y = y;
			this.heading = heading;
			this.wheel1_velocity = wheel1_velocity;
			this.wheel2_velocity = wheel2_velocity;
			this.width = width;
			this.last_time_updated = last_time_updated;
		},
		
		update: function() {
			var cur_time = new Date().getTime(),
				delta_time = cur_time - this.last_time_updated,
				delta_wheel1_distance = this.wheel1_velocity*delta_time,	
				delta_wheel2_distance = this.wheel2_velocity*delta_time;	
			if (!this.last_time_updated) {
				delta_wheel1_distance = 0;
				delta_wheel2_distance = 0;
			}
			this.last_time_updated = cur_time;
			
			var theta = this.heading,
				w = this.width,
				x = this.x,
				y = this.y,
				d1 = delta_wheel1_distance,
				d2 = delta_wheel2_distance;
				
			var new_x, new_y, new_heading;
			
			if(abs(d1 - d2) < .0001) {
				new_x = x + d1*cos(theta);
				new_y = y + d1*sin(theta);
				new_heading = theta;
			} else if (d1 > d2 && d2 >= 0) {
				var phi = (d1-d2)/w,
					r = w*(d1+d2)/(2*(d1-d2));
				new_x = x + r*( sin(theta) + sin(phi-theta) );
				new_y = y + r*( -cos(theta) + cos(theta-phi) );
				new_heading = theta - phi;
			} else if (d2 > d1 && d1 >= 0) {
				var phi = (d2-d1)/w,
					r = w*(d1+d2)/(2*(d2-d1));
				new_x = x + r*( -sin(theta) + sin(theta+phi) );
				new_y = y + r*( cos(theta) - cos(theta+phi) );
				new_heading = theta + phi;
			} else if (d1 < d2 && d2 <= 0) {
				d1 = abs(d1);
				d2 = abs(d2);
				var phi = (d1-d2)/w,
					r = w*(d1+d2)/(2*(d1-d2));
				new_x = x + r*( sin(theta) - sin(theta+phi) );
				new_y = y + r*( -cos(theta) + cos(theta+phi) );
				new_heading = theta + phi;
			} else if (d2 < d1 && d1 <= 0) {
				d1 = abs(d1);
				d2 = abs(d2);
				var phi = (d2-d1)/w,
					r = w*(d1+d2)/(2*(d2-d1));
				new_x = x + r*( -sin(theta) + sin(theta-phi) );
				new_y = y + r*( cos(theta) - cos(theta-phi) );
				new_heading = theta - phi;
			} else if (d1 > 0 && d2 < 0 && abs(d1) >= abs(d2)) {
				d2 = abs(d2);
				var phi = (d1+d2)/w,
					z = w*(d1-d2)/(2*(d1+d2));
				new_x = x + z*( sin(theta) - sin(theta-phi) );
				new_y = y + z*( -cos(theta) + cos(theta-phi) );
				new_heading = theta - phi;
			} else if (d1 < 0 && d2 > 0 && abs(d2) >= abs(d1)) {
				d1 = abs(d1);
				var phi = (d1+d2)/w,
					z = w*(d2-d1)/(2*(d1+d2));
				new_x = x + z*( -sin(theta) + sin(theta+phi) );
				new_y = y + z*( cos(theta) - cos(theta+phi) );
				new_heading = theta+phi;
			} else if (d1 > 0 && d2 < 0 && abs(d1) <= abs(d2)) {
				d2 = abs(d2);
				var phi = (d1+d2)/w,
					z = w*(d1-d2)/(2*(d1+d2));
				new_x = x + z*( sin(theta) - sin(theta-phi) );
				new_y = y + z*( -cos(theta) + cos(theta-phi) );
				new_heading = theta-phi;
			} else if (d1 < 0 && d2 > 0 && abs(d2) <= abs(d1)) {
				d1 = abs(d1);
				var phi = (d1+d2)/w,
					z = w*(d2-d1)/(2*(d1+d2));
				new_x = x + z*( -sin(theta) + sin(theta+phi) );
				new_y = y + z*( cos(theta) - cos(theta+phi) );
				new_heading = theta + phi;
			} else {
				// impossible
				console.log("ERROR: "+d1+","+d2);
				while(true);
			}
			
			if (REPLACE_ROBOT_DYNAMICALLY) {
				return tank_robot(new_x, new_y, new_heading, this.wheel1_velocity, 
							this.wheel2_velocity, this.length, this.width, this.last_time_updated);
			} else {
				this.set(new_x, new_y, new_heading, this.wheel1_velocity, 
					this.wheel2_velocity, this.length, this.width, this.last_time_updated);
			}
		},
		
		accelerate_wheels : function(delta_wheel1_velocity, delta_wheel2_velocity) {
			var new_wheel1_velocity = this.wheel1_velocity + delta_wheel1_velocity,
				new_wheel2_velocity = this.wheel2_velocity + delta_wheel2_velocity;
			
			if (REPLACE_ROBOT_DYNAMICALLY) {
				return tank_robot(this.x, this.y, this.heading, new_wheel1_velocity, 
							new_wheel2_velocity, this.length, this.width, this.last_time_updated);
			} else {
				this.set(this.x, this.y, this.heading, new_wheel1_velocity, 
					new_wheel2_velocity, this.length, this.width, this.last_time_updated);
			}
		},
		
		get_corners : function() {
			var theta = this.heading,
				W = this.width,
				L = this.length,
				x = this.x,
				y = this.y;
				
			corners[0].x = x + (W/2)*cos(theta + PI/2); 	
			corners[0].y = y + (W/2)*sin(theta + PI/2);
			corners[3].x = x + (W/2)*cos(theta + 3*PI/2); 
			corners[3].y = y + (W/2)*sin(theta + 3*PI/2);
			corners[1].x = corners[0].x + L*cos(theta); 
			corners[1].y = corners[0].y + L*sin(theta);
			corners[2].x = corners[3].x + L*cos(theta); 
			corners[2].y = corners[3].y + L*sin(theta);
			
			return corners;
		},
		
		// returns [[{x:x11,y:y11},...,{x:x14,y:y14}],[{x:x21,y:y21},...]]
		get_wheels : function(corners) {
			var W = WHEEL_WIDTH,
				L = WHEEL_LENGTH,
				x = this.x,
				y = this.y;
			
			for (var i = 0; i < 2; i++) {
				var theta = this.heading,
					c = corners[i*3];
					
				var t1x = c.x + W*cos(theta + PI/2), 	
					t1y = c.y + W*sin(theta + PI/2),
					t2x = c.x + W*cos(theta + 3*PI/2), 	
					t2y = c.y + W*sin(theta + 3*PI/2);
					
				wheels[i][0].x = t1x + (L/2)*cos(theta + PI); 
				wheels[i][0].y = t1y + (L/2)*sin(theta + PI);
				wheels[i][1].x = t1x + (L/2)*cos(theta); 	
				wheels[i][1].y = t1y + (L/2)*sin(theta);
				wheels[i][3].x = t2x + (L/2)*cos(theta + PI); 
				wheels[i][3].y = t2y + (L/2)*sin(theta + PI);
				wheels[i][2].x = t2x + (L/2)*cos(theta); 	
				wheels[i][2].y = t2y + (L/2)*sin(theta);
			}
			
			return wheels;
		},
		
		get_caster : function(corners) {
			var c = corners[1];
			return {x: c.x + (this.width/2)*cos(this.heading - PI/2), 
					y: c.y + (this.width/2)*sin(this.heading - PI/2)};
		},
		
		draw : function(context) {
			this.get_corners();
			this.get_wheels(corners);
			var caster = this.get_caster(corners);
			
			context.lineWidth = 3;
			context.strokeStyle = "green";
			context.beginPath();
			context.moveTo(corners[0].x, corners[0].y);
			for(i = 1; i < corners.length; i++) {
				context.lineTo(corners[i].x, corners[i].y);
			}
			context.closePath();
			context.stroke();
			
			context.lineWidth = 1;
			context.strokeStyle = "black";
			for (j = 0; j < 2; j++) {
				var wheel = wheels[j];
				context.beginPath();
				context.moveTo(wheel[0].x, wheel[0].y);
				for(i = 1; i < wheel.length; i++) {
					context.lineTo(wheel[i].x, wheel[i].y);
				}
				context.closePath();
				context.stroke();
			}
			
			context.beginPath();
			context.arc(caster.x, caster.y, WHEEL_WIDTH, 0, 2*PI, false);
			context.stroke();
		}
	};
	
	return my_robot;
}
	
function ackerman_robot(x, y, heading, steering_angle, velocity, length, width,
			last_time_updated) 
{
	my_robot = {
		type : ACKERMAN,
		x : x,
		y : y,
		heading : heading,
		steering_angle : steering_angle,
		velocity : velocity,
		length : length,
		width : width,
		last_time_updated: last_time_updated,
		
		set : function (x, y, heading, steering_angle, velocity, length, width,
				last_time_updated) 
		{
			this.x = x;
			this.y = y;
			this.heading = heading;
			this.steering_angle = steering_angle;
			this.velocity = velocity;
			this.length = length;
			this.width = width;
			this.last_time_updated = last_time_updated;
		},
		
		update : function() {
			var cur_time = new Date().getTime(),
				delta_time = cur_time - this.last_time_updated,
				delta_distance = this.velocity*delta_time;	
			if (!this.last_time_updated) {
				delta_distance = 0;
			}
			this.last_time_updated = cur_time;
		
			var theta = this.heading,
				d = delta_distance;
			
			var new_x, new_y, new_heading;
			
			if (0 == delta_distance) {
				new_x = this.x;
				new_y = this.y;
				new_heading = theta;
			} else if (0 == this.steering_angle) {
				new_x = this.x + d*cos(theta);
				new_y = this.y + d*sin(theta);
				new_heading = theta;
			} else {
				var beta = (d/this.length)*Math.tan(this.steering_angle);
				var R = d/beta;
				new_heading = (theta + beta)%(2*PI);
				new_x = this.x - R*sin(theta) + R*sin(new_heading);
				new_y = this.y + R*cos(theta) - R*cos(new_heading);
			}
			
			if (REPLACE_ROBOT_DYNAMICALLY) {
				return ackerman_robot(new_x, new_y, new_heading, this.steering_angle, 
							this.velocity, this.length, this.width, this.last_time_updated);
			} else {
				this.set(new_x, new_y, new_heading, this.steering_angle, this.velocity, 
					this.length, this.width, this.last_time_updated);
			}
		},
		
		steer : function(delta_steering_angle) {
			var new_steering_angle = this.steering_angle + delta_steering_angle;
			
			if (new_steering_angle > MAX_ALPHA_ACKERMAN)
				new_steering_angle = MAX_ALPHA_ACKERMAN;
			if (new_steering_angle < -MAX_ALPHA_ACKERMAN)
				new_steering_angle = -MAX_ALPHA_ACKERMAN;
			
			if (REPLACE_ROBOT_DYNAMICALLY) {
				return ackerman_robot(this.x, this.y, this.heading, new_steering_angle, 
							this.velocity, this.length, this.width, this.last_time_updated);
			} else {
				this.set(this.x, this.y, this.heading, new_steering_angle, this.velocity, 
					this.length, this.width, this.last_time_updated);
			}
		},
		
		accelerate : function(delta_velocity) {
			var new_velocity = this.velocity + delta_velocity;
			
			if (REPLACE_ROBOT_DYNAMICALLY) {
				return ackerman_robot(this.x, this.y, this.heading, this.steering_angle, 
							new_velocity, this.length, this.width, this.last_time_updated);
			} else {
				this.set(this.x, this.y, this.heading, this.steering_angle, new_velocity, 
					this.length, this.width, this.last_time_updated);
			}
		},
		
		// returns [{x:x1,y:y1},...,{x:x4,y:y4}]
		get_corners : function() {
			var theta = this.heading,
				W = this.width,
				L = this.length,
				x = this.x,
				y = this.y;
				
			corners[0].x = x + (W/2)*cos(theta + PI/2); 	
			corners[0].y = y + (W/2)*sin(theta + PI/2);
			corners[3].x = x + (W/2)*cos(theta + 3*PI/2); 
			corners[3].y = y + (W/2)*sin(theta + 3*PI/2);
			corners[1].x = corners[0].x + L*cos(theta); 
			corners[1].y = corners[0].y + L*sin(theta);
			corners[2].x = corners[3].x + L*cos(theta); 
			corners[2].y = corners[3].y + L*sin(theta);
			
			return corners;
		},
		
		// returns [[{x:x11,y:y11},...,{x:x14,y:y14}],...,[{x:x41,y:y41},...]]
		get_wheels : function(corners) {
			var W = WHEEL_WIDTH,
				L = WHEEL_LENGTH,
				x = this.x,
				y = this.y;
			
			for (var i = 0; i < 4; i++) {
				var theta = this.heading,
					c = corners[i];
				
				if (1 == i || 2 == i) {
					theta += this.steering_angle;
				}
					
				var t1x = c.x + W*cos(theta + PI/2), 	
					t1y = c.y + W*sin(theta + PI/2),
					t2x = c.x + W*cos(theta + 3*PI/2), 	
					t2y = c.y + W*sin(theta + 3*PI/2);
					
				wheels[i][0].x = t1x + (L/2)*cos(theta + PI); 
				wheels[i][0].y = t1y + (L/2)*sin(theta + PI);
				wheels[i][1].x = t1x + (L/2)*cos(theta); 	
				wheels[i][1].y = t1y + (L/2)*sin(theta);
				wheels[i][3].x = t2x + (L/2)*cos(theta + PI); 
				wheels[i][3].y = t2y + (L/2)*sin(theta + PI);
				wheels[i][2].x = t2x + (L/2)*cos(theta); 	
				wheels[i][2].y = t2y + (L/2)*sin(theta);
			}
			
			return wheels;
		},
		
		draw : function(context) {
			this.get_corners();
			this.get_wheels(corners);

			context.lineWidth = 3;
			context.strokeStyle = "blue";
			context.beginPath();
			context.moveTo(corners[0].x, corners[0].y);
			for(i = 1; i < corners.length; i++) {
				context.lineTo(corners[i].x, corners[i].y);
			}
			context.closePath();
			context.stroke();
			
			context.lineWidth = 1;
			context.strokeStyle = "black";
			for (j = 0; j < wheels.length; j++) {
				var wheel = wheels[j];
				context.beginPath();
				context.moveTo(wheel[0].x, wheel[0].y);
				for(i = 1; i < wheel.length; i++) {
					context.lineTo(wheel[i].x, wheel[i].y);
				}
				context.closePath();
				context.stroke();
			}
		},
	};
	
	return my_robot;
}