function Particle(spec){
	var {
		maximum,
		resolution,
		evaluate,
		particleIndex,
		particleCount,
		getSpinner,
	} = spec;

	var position = {
		x: 0,
		y: 0,
	}
	var oldPosition = {
		x: 0,
		y: 0,
	}
	var acceleration = {
		x: 0,
		y: 0,
	}
	var velocity = {
		x: 0,
		y: 0,
	}

	var scope = {
		x: 0,
		y: 0,
		t: 0,
		m: 0,
		d: math.complex(0, 0),
		p: math.complex(0, 0),
	}

	var age = 0;
	var ageLimit = 4;
	var sample = null;
	var distro = gaussian(6, 1.5);

	var white = "#FFF";
	var orange = "#F80";
	var blue = "#0FF";

	var grid = false;
	var aged = false;

	var tick = function(time, timeDelta, context, eval = true){
		if (eval) {
			scope.x = position.x;
			scope.y = position.y;
			scope.p.re = scope.x;
			scope.p.im = scope.y;
			scope.m = scope.p.abs();
			scope.d = scope.p.sign();
			scope.t = time;

			sample = evaluate(scope);
			sample = makeComplex(sample);

			acceleration.x = sample.re;
			acceleration.y = sample.im;
		}
		if (sample != null) {
			age += timeDelta;

			var x0 = position.x;
			var y0 = position.y;

			//eulerIntegrate(position, velocity, acceleration, timeDelta);
			//verletIntegrate(position, oldPosition, acceleration, timeDelta);
			directIntegrate(position, acceleration, timeDelta);

			//if (particleIndex == 0) console.log("Ticking particle %s: from %s to %s", particleIndex, pointString(oldPosition), pointString(position));
			/*
			velocity.x += sample.re*timeDelta;
			velocity.y += sample.im*timeDelta;

			position.x += velocity.x*timeDelta;
			position.y += velocity.y*timeDelta;
			*/


			var x1 = position.x;
			var y1 = position.y;

			x0 = transformX(x0);
			y0 = transformY(y0);

			x1 = transformX(x1);
			y1 = transformY(y1);

			//if (eval) context.strokeStyle = orange;
			//else context.strokeStyle = white;

			if (aged) {
				context.beginPath();
				context.moveTo(x0, y0);
				context.lineTo(x1, y1);
				context.stroke();
			}
		}

		var outside = (position.x > maximum*3/2 || position.x < -maximum*3/2);
		outside = outside || (position.y > maximum*3/2 || position.y < -maximum*3/2);

		if (age >= ageLimit || outside) {
			reset();
			aged = true;
		}
	}

	var reset = function(){
		sample = null;
		if (grid) {
			var spinner = getSpinner(-1);
			position.x = spinner.center.re;
			position.y = spinner.center.im;
		}
		else {
			ageLimit = distro();
			ageLimit = Math.max(1, ageLimit);
			position.x = lerp(-maximum, maximum, Math.random())*3/2;
			position.y = lerp(-maximum, maximum, Math.random())*3/2;
		}
		oldPosition.x = position.x;
		oldPosition.y = position.y;
		velocity.x = 0;
		velocity.y = 0;
		acceleration.x = 0;
		acceleration.y = 0;
		age = 0;
		//console.log("Resetting particle to limit %s", ageLimit);
	}

	var transformX = function(v){
		return remap(-maximum, maximum, 0, resolution, v);
	}

	var transformY = function(v){
		return remap(-maximum, maximum, resolution, 0, v);
	}

	var untransformX = function(v){
		return remap(0, resolution, -maximum, maximum, v);
	}

	var untransformY = function(v){
		return remap(resolution, 0, -maximum, maximum, v);
	}

	reset();
	//age = Math.random()*ageLimit;
	age = lerp(0, ageLimit, particleIndex/particleCount);

	return Object.freeze({
		// Fields

		// Methods
		tick,
	});
}