function Windfarm(spec){
	var {
		maximum,
		resolution,
		evaluate,
		mainLayer,
	} = spec;

	var layer = Layer({
		name: "Windfarm Layer",
		parent: mainLayer,
		layerIndex: 1,
	});

	var tickTime = 0;
	var tickMeter = 0;
	var tickInterval = 1/20;
	var tickCount = 0;
	var tickWeave = 1;

	var density = 7;
	var spinners = [];
	var spinnerCount = density*density;
	var queueIndex = 0;

	var draw = function(context){
		//context.drawImage(particleCanvas, 0, 0);
	}

	var update = function(time, timeDelta){
		var tr = false;
		// Spinners are updated and drawn in a single "tick" operation with a fixed timestep
		tickMeter += timeDelta;
		while (tickMeter >= tickInterval) {
			// If enough time has elapsed to tick spinners, layer is dirty
			tr = tickSpinners() || tr;
		}
		return tr;
	}

	// Returns true if any spinners change value
	var tickSpinners = function(){
		var tr = false;
		//console.log("Ticking field spinners...");
		tickMeter -= tickInterval;
		tickTime += tickInterval;
		var eval;
		for (var i = 0; i < spinners.length; i++) {
			eval = (tickCount+i)%tickWeave < 1;
			tr = spinners[i].tick(tickTime, tickInterval, eval) || tr;
		}
		tickCount++;
		return tr;
	}

	var getSpinner = function(index = null){
		if (index == null) index = Math.floor(Math.random()*spinnerCount);
		else if (index < 0) {
			queueIndex++;
			queueIndex = queueIndex%spinnerCount;
			index = queueIndex;
		}
		return spinners[index];
	}

	var getDensity = function(){return density;}

	layer.addComponent({
		draw,
		update,
	});

	var spinnerIndex = 0;
	var spinnerX = 0;
	var spinnerY = 0;
	for (var i = 0; i < spinnerCount; i++) {
		spinnerIndex = i;
		spinners.push(Spinner({
			maximum,
			resolution,
			evaluate,
			spinnerIndex,
			density,
			layer,
		}));
	}

	return Object.freeze({
		// Fields

		// Methods
		getDensity,
		getSpinner,
	})
}