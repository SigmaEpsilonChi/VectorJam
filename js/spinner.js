function Spinner(spec){
	var {
		maximum,
		resolution,
		evaluate,
		spinnerIndex,
		density,
		layer,
	} = spec;

	var xIndex = spinnerIndex%density;
	var yIndex = Math.floor(spinnerIndex/density);

	var position = {
		x: lerp(-maximum, maximum, (xIndex+1)/(density+1)),
		y: lerp(-maximum, maximum, (yIndex+1)/(density+1)),
	}

	var scope = {
		x: 0,
		y: 0,
		t: 0,
		m: 0,
		d: math.complex(0, 0),
		p: math.complex(0, 0),
	}

	var sample = math.complex(0, 0);
	var corner0 = math.complex(0, 0);
	var corner1 = math.complex(0, 0);
	var corner2 = math.complex(0, 0);
	var corner3 = math.complex(0, 0);
	var corner3Target = math.complex(0, 0);
	var center = math.complex(position.x, position.y);
	var rotator = math.complex({r: 1, phi: math.pi*3/4});

	var currentSize = 0;
	var targetSize = 0;

	var currentAngle = 0;
	var targetAngle = 0;

	var white = "#FFF";
	var black = "#000";
	var orange = "#F80";
	var cyan = "#08F";

	var draw = function(context){
		var m = 1-1/(1+Math.sqrt(sample.abs())/2);
		var s = sample.sign().mul(m);
		var a = lerp(math.pi, math.pi*2/3, m);
		rotator = math.complex({r: 1, phi: a});
		corner0 = math.add(s, center);
		corner1 = math.add(math.multiply(s, rotator), center);
		corner2 = math.add(math.divide(s, rotator), center);

		corner3.re = center.re;
		corner3.im = center.im;

		context.beginPath();
		context.moveTo(
			x = transformX(corner0.re),
			y = transformY(corner0.im),
		);
		context.lineTo(
			x = transformX(corner1.re),
			y = transformY(corner1.im),
		);
		context.lineTo(
			x = transformX(corner3.re),
			y = transformY(corner3.im),
		);
		context.lineTo(
			x = transformX(corner2.re),
			y = transformY(corner2.im),
		);
		context.lineTo(
			x = transformX(corner0.re),
			y = transformY(corner0.im),
		);

		context.strokeStyle = white;
		context.fillStyle = black;
		context.fill();
		context.stroke();
		//console.log("Drawing spinner %s: %s, %s", spinnerIndex, xIndex, yIndex);
	}

	var update = function(time, timeDelta){
	}

	var tick = function(time, timeDelta, eval = true){
		if (eval) {
			var comparison = sample;

			scope.x = position.x;
			scope.y = position.y;
			scope.p.re = scope.x;
			scope.p.im = scope.y;
			scope.m = scope.p.abs();
			scope.d = scope.p.sign();
			scope.t = time;

			sample = evaluate(scope);
			sample = makeComplex(sample);
			if (!sample.equals(comparison)) return true;
		}
	}

	var reset = function(){
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

	reset();

	layer.addComponent({
		draw,
		update,
	});

	return Object.freeze({
		// Fields
		center,

		// Methods
		tick,
	});
}