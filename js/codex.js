Codex = function(spec){
	var {
		codexElement,
		definitionTemplate,
		field,
		writeUrl,
	} = spec;


    var definitions = [];
    var assignmentsElement = codexElement.querySelector(".assignments");
	assignmentsElement.removeChild(definitionTemplate);

	var appendButtonElement = codexElement.querySelector(".appendButton");

	var addDefinition = function(expressionString = "0"){
		definitions.push(Definition({
			assignmentsElement,
			definitionTemplate,
			refreshCodex,
			sortDefinitions,
			removeDefinition,
			expressionString,
		}));
		refreshCodex();
	}

	var removeDefinition = function(definition){
		var definitionIndex = definitions.indexOf(definition);
		console.log("Removing expression definition: %s, %s", definitionIndex, definition.getExpression());
		if (definitions.length > 1) {
			definitions.splice(definitionIndex, 1);
			definition.destroy();
			refreshCodex();
		}
	}

	var refreshCodex = function(){
		field.clearExpressions();
		console.log("REFRESHING CODEX: %s expressions", definitions.length);
		for (var i = definitions.length-1; i >= 0; i--) {
			let expressionString = definitions[i].getExpression();
			console.log("Pushing Expression: %s", expressionString);
			field.pushExpression(expressionString);
		}
		field.resetScopes();
		publish("/codex/refresh");
	}

	var sortDefinitions = function(){
		definitions.sort(function(a, b){
			return a.definitionElement.compareDocumentPosition(b.definitionElement) == 2;
		});
	}

	var onSetPlayState = function(playState){
		if (playState) {
			//assignmentsElement.style.opacity = 0;
		}
		else {
			//assignmentsElement.style.opacity = 1;
		}
	}

	var onSpecRead = function(spec){
		for (var i = 0; i < spec.definitions.length; i++) {
			if (i < definitions.length) {
				definitions[i].setExpression(spec.definitions[i].expression);
			}
			else {
				addDefinition(spec.definitions[i].expression);
			}
		}
	}

	var onSpecWrite = function(spec){
		spec.definitions = [];
		for (var i = 0; i < definitions.length; i++) {
			spec.definitions.push({
				expression: definitions[i].getExpression(),
			})
		}
	}

	var onAppendButtonClick = function(){
		addDefinition();
	}
	
	subscribe("/setPlayState", onSetPlayState);
	subscribe("/spec/read", onSpecRead);
	subscribe("/spec/write", onSpecWrite);
	subscribe("/codex/submit", refreshCodex);

	addDefinition();

    var queryExpression = getQueryString("f");
    if (queryExpression != null) {
    	// Load expression from queryString
    	queryExpression = decodeURI(queryExpression);
    	definitions[0].setExpression(queryExpression);
    	refreshCodex();
    }


	appendButtonElement.addEventListener("click", onAppendButtonClick);

	return Object.freeze({
		// Fields

		// Methods
		addDefinition,
		removeDefinition,
		refreshCodex,
	});
}