function Ball(spec){
	var {
		maximum,
		resolution,
		evaluate,
		ballIndex,
		layer,
	} = spec;

	var position = {
		x: 0,
		y: 0,
	}
	var origin = {
		x: 0,
		y: 0,
	}
	var velocity = {
		x: 0,
		y: 0,
	}
	var acceleration = {
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

	var sample = null;

	var white = "#FFF";
	var orange = "#F80";
	var blue = "#0FF";
	var black = "#000";

	var radius = 0.5;

	var simulate = false;

	var draw = function(context){
		context.beginPath();
		var x0 = transformX(position.x);
		var y0 = transformY(position.y);

		context.strokeStyle = black;
		context.fillStyle = "#BFF";
		context.lineWidth = 2;
		context.beginPath();
		context.arc(x0, y0, scaleX(radius), 0, math.pi*2);
		context.fill();
		context.stroke();


	}

	var update = function(time, timeDelta){
		var tr = false;
		/*
		position.x += velocity.x*timeDelta;
		position.y += velocity.y*timeDelta;
		tr = velocity.y != 0 || velocity.x != 0;
		*/
		if (sample != null) {
			directIntegrate(position, acceleration, timeDelta);
			tr = true;
		}
		return tr;
	}

	var tick = function(time, timeDelta, context, eval = true){
		var tr = true;

		if (!simulate) return false;

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
		}
		if (sample != null) {
			acceleration.x = sample.re;
			acceleration.y = sample.im;
			//directIntegrate(position, acceleration, timeDelta);
			/*
			velocity.x += sample.re*timeDelta;
			velocity.y += sample.im*timeDelta;
			*/
		}

		var outside = (position.x > maximum*3/2 || position.x < -maximum*3/2);
		outside = outside || (position.y > maximum*3/2 || position.y < -maximum*3/2);

		return tr;
	}

	var reset = function(){
		sample = null;
		position.x = origin.x;
		position.y = origin.y;
		velocity.x = 0;
		velocity.y = 0;
		layer.refresh();
	}

	var setPosition = function(POSITION){
		position.x = POSITION.x;
		position.y = POSITION.y;
		origin.x = position.x;
		origin.y = position.y;
	}

	var setOrigin = function(ORIGIN){
		origin.x = ORIGIN.x;
		origin.y = ORIGIN.y;
	}

	var scaleX = function(v){
		return v*resolution/maximum;
	}

	var scaleY = function(v){
		return v*resolution/maximum;
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

	var destroy = function(){
		layer.removeComponent(component);
		unsubscribe(resetScope);
		unsubscribe(onSetPlayState);

		layer.refresh();
	}

	var onSetPlayState = function(playState){
		simulate = playState;
		if (playState) {
			reset();
		}
		else {
			reset();
		}
	}
	subscribe("/setPlayState", onSetPlayState);

	var resetScope = function(getBlankScope){scope = getBlankScope();}
	subscribe("/scopes/reset", resetScope);

	reset();
	//age = Math.random()*ageLimit;

	var component = {
		draw,
		update,
	}
	layer.addComponent(component);

	return Object.freeze({
		// Fields

		// Methods
		tick,
		reset,
		destroy,

		setOrigin,
		setPosition,
	});
}