function Court(spec){
	var {
		maximum,
		resolution,
		evaluate,
		mainLayer,
	} = spec;

	var layer = Layer({
		name: "Ball Layer",
		parent: mainLayer,
		layerIndex: 2,
	});

	var tickTime = 0;
	var tickMeter = 0;
	var tickInterval = 1/10;
	var tickCount = 0;
	var tickWeave = 1;

	var balls = [];

	var draw = function(context){
		//context.drawImage(particleCanvas, 0, 0);
	}

	var update = function(time, timeDelta){
		var tr = false;
		// Spinners are updated and drawn in a single "tick" operation with a fixed timestep
		tickMeter += timeDelta;
		while (tickMeter >= tickInterval) {
			// If enough time has elapsed to tick spinners, layer is dirty
			tr = tickBalls() || tr;
		}
		return tr;
	}

	// Returns true if any spinners change value
	var tickBalls = function(){
		var tr = false;
		//console.log("Ticking field spinners...");
		tickMeter -= tickInterval;
		tickTime += tickInterval;
		var eval;
		for (var i = 0; i < balls.length; i++) {
			eval = (tickCount+i)%tickWeave < 1;
			tr = balls[i].tick(tickTime, tickInterval, eval) || tr;
		}
		tickCount++;
		return tr;
	}

	layer.addComponent({
		draw,
		update,
	});

	var setBallCount = function(ballCount){
		while (balls.length > ballCount) {
			balls.pop().destroy();
		}
		while (balls.length < ballCount) {
			balls.push(Ball({
				maximum,
				resolution,
				evaluate,
				layer,
				ballIndex: balls.length,
			}));
		}
	}

	var setBallLayout = function(specs){
		setBallCount(specs.length);
		for (var i = 0; i < balls.length; i++) {
			balls[i].setPosition(specs[i].position);
		}
	}
	var reset = function(){
		for (var i = 0; i < balls.length; i++) {
			balls[i].reset();
		}
	}

	setBallLayout([
		{
			position: {
				x: -4,
				y: 0,
			},
		},
		{
			position: {
				x: 4,
				y: 0,
			},
		},
		{
			position: {
				x: 0,
				y: -4,
			},
		},
		{
			position: {
				x: 0,
				y: 4,
			},
		},
	]);

	return Object.freeze({
		// Fields

		// Methods
		setBallLayout,
		reset,
	})
}