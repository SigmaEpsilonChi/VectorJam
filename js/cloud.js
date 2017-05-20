function Cloud(spec){
	var {
		maximum,
		resolution,
		evaluate,
		mainLayer,
		getSpinner,
		getBlankScope,
	} = spec;

	var layer = Layer({
		name: "Cloud Layer",
		parent: mainLayer,
		layerIndex: 0,
	});

	var tickTime = -1;
	var tickMeter = 0;
	var tickInterval = 1/30;
	var tickCount = 0;
	var tickWeave = 2;

	var particleCount = 512;
	var particles = [];

	// Particles are incrementally drawn to a separate canvas

    var particleCanvas = document.createElement('canvas');
    var particleContext = particleCanvas.getContext('2d');

    particleCanvas.width = resolution;
    particleCanvas.height = resolution;

    //particleContext.strokeStyle = "#FF8000";
    particleContext.lineWidth = 1;
    particleContext.lineCap = 'square';
    particleContext.strokeStyle = "#888";

    var washCycle = 0;

	var draw = function(context){
		context.drawImage(particleCanvas, 0, 0);
	}

	var update = function(time, timeDelta){
		var tr = false;
		// Particles are updated and drawn in a single "tick" operation with a fixed timestep
		tickMeter += timeDelta;
		while (tickMeter >= tickInterval) {
			// If enough time has elapsed to tick particles, layer canvas is dirty
			tickParticles();
			tr = true;
		}
		return tr;
	}

	var tickParticles = function(){
		//console.log("Ticking field particles...");
		tickMeter -= tickInterval;
		if (tickTime >= 0) tickTime += tickInterval;
		// Fade the particle canvas, then tick each particle
  		//particleContext.globalCompositeOperation = "lighter";

  		washCycle = (washCycle+1)%4;
  		if (washCycle == 0) wash();

  		fade();

		var eval;
		for (var i = 0; i < particles.length; i++) {
			eval = (tickCount+i)%tickWeave < 1;
			particles[i].tick(Math.max(tickTime, 0), tickInterval, particleContext, eval);
		}
		tickCount++;
	}

	var clear = function(){
  		particleContext.globalCompositeOperation = "source-over";
    	particleContext.fillStyle = "rgba(255, 255, 255, 1)";
		particleContext.fillRect(0, 0, resolution, resolution);
	}

	var wash = function(){
		particleContext.globalCompositeOperation = "lighter";
		particleContext.fillStyle = "rgba(1, 1, 1, 1)";
		particleContext.fillRect(0, 0, resolution, resolution);
	}

	var fade = function(){
  		particleContext.globalCompositeOperation = "source-over";
    	particleContext.fillStyle = "rgba(255, 255, 255, 0.03)";
		particleContext.fillRect(0, 0, resolution, resolution);
	}

	var onSetPlayState = function(playState, time){
		if (playState) {
			tickTime = 0;
			clear();
		}
		else {
			tickTime = -1;
			clear();
		}
	}
	subscribe("/setPlayState", onSetPlayState);


	subscribe("/scopes/reset", clear);

	clear();

	layer.addComponent({
		draw,
		update,
	});

	for (var i = 0; i < particleCount; i++) {
		particles.push(Particle({
			maximum,
			resolution,
			evaluate,
			particleCount,
			particleIndex: i,
			getSpinner,
			getBlankScope,
		}));
	}

	return Object.freeze({
		// Fields

		// Methods
	})
}