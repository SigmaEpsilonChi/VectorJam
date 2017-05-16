function Particle(spec){
	var {
		maximum,
		resolution,
		evaluateAt,
		particleIndex,
	} = spec;

	var position = {
		x: 0,
		y: 0,
	}
	var velocity = {
		x: 0,
		y: 0,
	}

	var age = 0;
	var ageLimit = 0;
	var sample = null;
	var distro = gaussian(6, 1.5);

	var white = "#FFF";
	var orange = "#F80";

	var tick = function(timeDelta, context, eval = true){
		if (eval) {
			sample = evaluateAt(position.x, position.y);
			if (typeof sample.im === 'undefined') {
				if (isNaN(sample)) sample = math.complex(0, 0);
				else sample = math.complex(sample, 0);
			}
		}
		if (sample != null) {
			age += timeDelta;

			velocity.x += sample.re*timeDelta;
			velocity.y += sample.im*timeDelta;

			var x0 = position.x;
			var y0 = position.y;

			var x1 = position.x+velocity.x*timeDelta;
			var y1 = position.y+velocity.y*timeDelta;

			x0 = transformX(x0);
			y0 = transformY(y0);

			x1 = transformX(x1);
			y1 = transformY(y1);

			//if (eval) context.strokeStyle = orange;
			//else context.strokeStyle = white;

			context.beginPath();
			context.moveTo(x0, y0);
			context.lineTo(x1, y1);
			context.stroke();

			position.x += velocity.x*timeDelta;
			position.y += velocity.y*timeDelta;
		}

		var outside = (position.x > maximum*3/2 || position.x < -maximum*3/2);
		outside = outside || (position.y > maximum*3/2 || position.y < -maximum*3/2);

		if (age >= ageLimit || outside) {
			reset();
		}
	}

	var drawLine = function(position, velocity, timeDelta){
		var x0 = position.x;
		var x1 = position.x+velocity.x
	}

	var reset = function(){
		sample = null;
		position.x = lerp(-maximum, maximum, Math.random())*3/2;
		position.y = lerp(-maximum, maximum, Math.random())*3/2;
		velocity.x = 0;
		velocity.y = 0;
		//ageLimit = lerp(1, 8, Math.random());
		ageLimit = distro();
		ageLimit = Math.max(1, ageLimit);
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
	age = Math.random()*ageLimit;

	return Object.freeze({
		// Fields

		// Methods
		tick,
	});
}