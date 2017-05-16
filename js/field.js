function Field(spec){
	var {
		maximum,
		resolution,
	} = spec;

	var scope = {
		x: 0,
		y: 0,
		t: 0,
		p: math.complex(0, 0),
	}
	
	var layer = Layer({
		name: "Field Layer",
		parent: spec.mainLayer,
	});

	var expressionString = null;
	var expressionTree = null; 

	var tickTime = 0;
	var tickMeter = 0;
	var tickInterval = 1/30;
	var tickCount = 0;
	var tickWeave = 8;

	var particleCount = 2048;
	var particles = [];

	// Particles are incrementally drawn to a separate canvas

    var particleCanvas = document.createElement('canvas');
    var particleContext = particleCanvas.getContext('2d');

    particleCanvas.width = resolution;
    particleCanvas.height = resolution;

    particleContext.fillStyle = "rgba(0, 0, 0, 0.05)";
    //particleContext.strokeStyle = "#FF8000";
    particleContext.strokeStyle = "#FFFFFF";
    particleContext.lineWidth = 2;

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
		scope.t = tickTime;
		// Fade the particle canvas, then tick each particle
		particleContext.fillRect(0, 0, resolution, resolution);
		var eval;
		for (var i = 0; i < particles.length; i++) {
			eval = (tickCount+i)%tickWeave < 1;
			particles[i].tick(tickInterval, particleContext, eval);
		}
		tickCount++;
	}

	var setExpression = function(EXPRESSIONSTRING){
		if (expressionString != EXPRESSIONSTRING) {
			expressionString = EXPRESSIONSTRING;
			expressionTree = math.compile(expressionString);
			
			scope.t = 0;
		}
	}

	var evaluateAt = function(x, y){
		scope.x = x;
		scope.y = y;
		scope.p.re = x;
		scope.p.im = y;
		return expressionTree.eval(scope);
	}

	setExpression("x*i");

	layer.addComponent({
		draw,
		update,
	});

	for (var i = 0; i < particleCount; i++) {
		particles.push(Particle({
			maximum,
			resolution,
			evaluateAt,
		}));
	}

	return Object.freeze({
		// Fields


		// Methods
		setExpression,
		evaluateAt,
	})
}