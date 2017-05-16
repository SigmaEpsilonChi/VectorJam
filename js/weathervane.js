function Weathervane(spec){
	var {
		mainLayer,
		maximum,
		resolution,
		evaluateAt,
	} = spec;

	var white = "#FFF";
	var orange = "#F80";

	var draw = function(position, velocity, timeDelta){
	}

	var update = function(time, timeDelta){
		
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

	return Object.freeze({
		// Fields

		// Methods
		tick,
	});
}