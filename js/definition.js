function Definition(spec){
	var {
		assignmentsElement,
		definitionTemplate,
		removeDefinition,
		refreshCodex,
		sortDefinitions,
		expressionString = "0",
	} = spec;

	var definitionElement = spec.definitionTemplate.cloneNode(true);
	assignmentsElement.appendChild(definitionElement);

	var containerElement = definitionElement.querySelector(".container");
	var labelElement = definitionElement.querySelector(".label");
	var fieldElement = definitionElement.querySelector(".field");

	var dragOffset = 0;
	var drag = false;

	var moveUp = function(){
		console.log("Moving up");
		var sibling = definitionElement.nextElementSibling;
		if (sibling != null && sibling.className == "definition") {
			assignmentsElement.removeChild(sibling);
			assignmentsElement.insertBefore(sibling, definitionElement);
			sortDefinitions();
			refreshCodex();
			//containerElement.style.top = "0px";
		}
	}

	var moveDown = function(){
		console.log("Moving down");
		var sibling = definitionElement.previousElementSibling;
		if (sibling != null && sibling.className == "definition") {
			assignmentsElement.removeChild(definitionElement);
			assignmentsElement.insertBefore(definitionElement, sibling);
			sortDefinitions();
			refreshCodex();
			//containerElement.style.top = "0px";
		}
	}

	var onDrag = function(event){
	}

	var onDragStart = function(event){
	}

	var onDragEnd = function(event){
	}

	var onMouseMove = function(event){
		if (drag) {
			var dragDelta = event.clientY-(definitionElement.offsetTop+dragOffset);
			containerElement.style.top = dragDelta+"px";

			//console.log("Dragging. Delta=%s", dragDelta);

			if (event.clientY < definitionElement.offsetTop) moveUp();
			if (event.clientY > definitionElement.offsetTop+definitionElement.clientHeight) moveDown();
		}
	}

	var onMouseDown = function(event){
		drag = true;
		//dragOrigin = event.clientY;
		dragOffset = event.clientY-definitionElement.offsetTop;
		console.log("Beginning drag");
	}

	var onMouseUp = function(event){
		if (drag) {
			drag = false;
			containerElement.style.top = "0px";
			console.log("Ending drag");
		}
	}

	var onFunctionChange = function(){
		if (expressionString != fieldElement.value) {
			expressionString = fieldElement.value;
			if (expressionString == "") removeDefinition(instance);
			else publish("/codex/submit", [instance]);
		}
	}

	var getExpression = function(){
		return expressionString;
	}

	var setExpression = function(EXPRESSIONSTRING){
		expressionString = EXPRESSIONSTRING
		fieldElement.value = expressionString;
	}

	var destroy = function(){
		assignmentsElement.removeChild(definitionElement);
		window.removeEventListener("mousemove", onMouseMove);
		window.removeEventListener("mouseup", onMouseUp);
	}

    setExpression(expressionString);

    fieldElement.addEventListener("change", onFunctionChange);
    fieldElement.addEventListener("submit", onFunctionChange);

    labelElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    /*
    labelElement.addEventListener("drag", onDrag, false);
    labelElement.addEventListener("dragstart", onDragStart, false);
    labelElement.addEventListener("dragend", onDragEnd, false);
    */

	var instance = Object.freeze({
		// Fields
		definitionElement,

		// Methods
		setExpression,
		getExpression,
		destroy,

	});

	return instance;
}