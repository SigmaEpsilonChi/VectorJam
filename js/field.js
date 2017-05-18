function Field(spec){
	var {
		maximum,
		resolution,
		mainLayer,
	} = spec;

	var expressionString = null;
	var expressionTree = null;

	var draw = function(context){
	}

	var update = function(time, timeDelta){
		var tr = false;
		return tr;
	}

	var setExpression = function(EXPRESSIONSTRING){
		var tr = false;
		if (expressionString != EXPRESSIONSTRING) {
			expressionString = EXPRESSIONSTRING;
	        try {
				expressionTree = math.compile(expressionString);
				tr = true;
	        }
	        catch (ex) {
				tr = false;
	        }
			
		}
		return tr;
	}

	var evaluate = function(scope){
		try {
			return expressionTree.eval(scope);
       	}
        catch (ex) {
			return math.complex(0, 0);
        }
	}

	setExpression("x*i");

	var windfarm = Windfarm({
		maximum,
		resolution,
		evaluate,
		mainLayer,
	});

	var cloud = Cloud({
		maximum,
		resolution,
		evaluate,
		mainLayer,
		getSpinner: windfarm.getSpinner,
	});

	return Object.freeze({
		// Fields


		// Methods
		setExpression,
		evaluate,
	})
}