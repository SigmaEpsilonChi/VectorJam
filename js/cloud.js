function Cloud(spec){
	var {
		maximum,
		resolution,
		evaluate,
		mainLayer,
		getSpinner,
	} = spec;

	var layer = Layer({
		name: "Cloud Layer",
		parent: mainLayer,
		layerIndex: 0,
	});

	var tickTime = 0;
	var tickMeter = 0;
	var tickInterval = 1/30;
	var tickCount = 0;
	var tickWeave = 8;

	var particleCount = 1024;
	var particles = [];

	// Particles are incrementally drawn to a separate canvas

    var particleCanvas = document.createElement('canvas');
    var particleContext = particleCanvas.getContext('2d');

    particleCanvas.width = resolution;
    particleCanvas.height = resolution;

    particleContext.fillStyle = "rgba(0, 0, 0, 0.03)";
    //particleContext.strokeStyle = "#FF8000";
    particleContext.strokeStyle = "#08F";
    particleContext.lineWidth = 1;

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
		tickTime += tickInterval;
		// Fade the particle canvas, then tick each particle
		particleContext.fillRect(0, 0, resolution, resolution);
		var eval;
		for (var i = 0; i < particles.length; i++) {
			eval = (tickCount+i)%tickWeave < 1;
			particles[i].tick(tickTime, tickInterval, particleContext, eval);
		}
		tickCount++;
	}

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
		}));
	}

	return Object.freeze({
		// Fields

		// Methods
	})
}