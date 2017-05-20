function Weathervane(spec){
	var {
		mainLayer,
		maximum,
		resolution,
		evaluate,
	} = spec;

	var white = "#FFF";
	var orange = "#F80";
	var red = "#C00";

	var show = false;
	var position = {
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

	var playTime = -1;

	var layer = Layer({
		name: "Weathervane Layer",
		parent: mainLayer,
		layerIndex: 3,
	})

	var draw = function(context){
		if (show) {
			scope.x = position.x;
			scope.y = position.y;
			scope.p.re = scope.x;
			scope.p.im = scope.y;
			scope.m = scope.p.abs();
			scope.d = scope.p.sign();

			var sample = evaluate(scope);
			var sample = makeComplex(sample);

			var pointerLength = Math.min(sample.abs(), 0.3);
			var pointerWidth = 0.2;

			var pointerOrigin = math.complex(position.x, position.y);
			var pointerTip = pointerOrigin.add(sample);
			var pointerCross = math.complex(sample.im, -sample.re);

			var normalSample = math.divide(sample, sample.abs());
			var normalCross = math.divide(pointerCross, pointerCross.abs());

			var offsetSample = math.multiply(normalSample, pointerLength);
			var offsetCross = math.multiply(normalCross, pointerWidth);

			var lineTip = math.subtract(pointerTip, offsetSample);

			var pointerLeft = math.add(math.subtract(pointerTip, offsetSample), offsetCross);
			var pointerRight = math.subtract(math.subtract(pointerTip, offsetSample), offsetCross);

			context.lineWidth = 4;
			context.strokeStyle = red;
			context.beginPath();
			context.moveTo(transformX(position.x), transformY(position.y));
			context.lineTo(transformX(lineTip.re), transformY(lineTip.im));
			context.stroke();

			context.fillStyle = red;
			context.beginPath();
			context.moveTo(transformX(pointerTip.re), transformY(pointerTip.im));
			//context.moveTo(transformX(0), transformY(0));
			//context.lineTo(transformX(8), transformY(0));
			//context.lineTo(transformX(0), transformY(8));
			//context.lineTo(transformX(pointerOrigin.re), transformY(pointerOrigin.im));
			context.lineTo(transformX(pointerLeft.re), transformY(pointerLeft.im));
			context.lineTo(transformX(pointerRight.re), transformY(pointerRight.im));
			context.fill();
		}
	}

	var update = function(time, timeDelta){
		if (playTime < 0) scope.t = 0;
		else scope.t = time-playTime;
		return true;
	}

	var onMouseMove = function(event){
		position.x = untransformX(event.clientX);
		position.y = untransformY(event.clientY);

		//console.log("Moving Weathervane to %s", pointString(position));

		return true;
	}

	var onMouseDown = function(event){
		
	}

	var onMouseUp = function(event){
		
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

	var setShow = function(SHOW){
		if (show != SHOW) {
			show = SHOW;
		}
	}

	var resetScope = function(getBlankScope){scope = getBlankScope();}
	subscribe("/scopes/reset", resetScope);

	var onSetPlayState = function(playState, time){
		if (playState) {
			playTime = time;
		}
		else {
			playTime = -1;
		}
	}
	subscribe("/setPlayState", onSetPlayState);

	var destroy = function(){
		unsubscribe(resetScope);
		unsubscribe(onSetPlayState);
	}

	layer.addComponent({
		draw,
		update,

		onMouseUp,
		onMouseDown,
		onMouseMove,
	});

	return Object.freeze({
		// Fields

		// Methods
		setShow,
		destroy,
	});
}