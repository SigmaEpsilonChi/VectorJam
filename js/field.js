function Field(spec){
	var {
		maximum,
		resolution,
		mainLayer,
	} = spec;

	var expressions = [];

	var draw = function(context){
	}

	var update = function(time, timeDelta){
		var tr = false;
		return tr;
	}

	var clearExpressions = function(){
		expressions.length = 0;
	}

	var pushExpression = function(expressionString){
		var tr = false;
		//console.log("Pushing expression: %s", expressionString);
		if (expressionString.startsWith("//")) return true;
        try {
			var expression = math.compile(expressionString);
			expressions.push(expression);
			tr = true;
        }
        catch (ex) {
			tr = false;
        }
        return tr;
	}

	var evaluate = function(scope){
		if (expressions.length == 0) return 0;

		var tr = 0;
		for (var i = 0; i < expressions.length; i++) {
			try {
				tr = expressions[i].eval(scope);
			}
        	catch (ex) {
				tr = 0;
	        }
       	}
        return tr;
	}

	var getBlankScope = function(){
		return {
			x: 0,
			y: 0,
			t: 0,
			m: 0,
			d: math.complex(0, 0),
			p: math.complex(0, 0),
		}
	}

	var resetScopes = function(){
	    publish("/scopes/reset", [getBlankScope]);
	}

	var windfarm = Windfarm({
		maximum,
		resolution,
		evaluate,
		mainLayer,
		getBlankScope,
	});

	var cloud = Cloud({
		maximum,
		resolution,
		evaluate,
		mainLayer,
		getSpinner: windfarm.getSpinner,
		getBlankScope,
	});

    var weathervane = Weathervane({
    	maximum,
    	resolution,
    	mainLayer,
    	evaluate,
		getBlankScope,
    });

	return Object.freeze({
		// Fields
		windfarm,
		cloud,
		weathervane,

		// Methods
		pushExpression,
		clearExpressions,
		evaluate,
		resetScopes,
	})
}