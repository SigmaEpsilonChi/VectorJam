function Game(spec){
	var {
		canvas,
		maximum,
		resolution,
		input,
		timer,
	} = spec;

	canvas.width = resolution;
	canvas.height = resolution;
	
	var context = canvas.getContext('2d');

    var mainLayer = Layer({
        name: "Main Layer",
        canvas,
    });

    var time = 0;
    var timeDelta;
    var drawTime = 0;

    var FPS = 60;
    var timerId = 0;
    var animationTimestamp = 0;

    var date = new Date();

    // Set up Field to evaluate and draw the vector field

    var field = Field({
    	maximum,
    	resolution,
    	mainLayer,
    });

    var queryExpression = getQueryString("f");
    if (queryExpression != null) {
    	queryExpression = decodeURI(queryExpression);
    	//field.setExpression(queryExpression);
    	input.value = queryExpression;
    	console.log("Reading queryExpression: "+queryExpression);
    }

    // Set up Weathervane to evaluate and draw the vector field

    var weathervane = Weathervane({
    	maximum,
    	resolution,
    	mainLayer,
    	evaluate: field.evaluate,
    });

    var start = function(){
        timeDelta = 1/FPS;
        timerId = setInterval(function() {
          update();
        }, 1000/FPS);

        update();
        window.requestAnimationFrame(step);
    }

    var step = function(timestamp) {
        if (redraw) {
            draw();
            redraw = false;
        }
        animationTimestamp = timestamp;
        window.requestAnimationFrame(step);
    }

    var update = function() {
        time = time+timeDelta;
        timer.innerHTML = "T = "+trunc(time, 1);
		/*
		var newDate = new Date();
		time = newDate/1000;

		timeDelta = newDate-date;
		timeDelta /= 1000;

        date = newDate;
        */

        mainLayer.update(time, timeDelta);
        redraw = true;
    }

    var draw = function() {
        mainLayer.draw();
    }

    var clear = function(){
        context.clearRect(0, 0, resolution, resolution);
    }

	var onMouseMove = function(event){
		mainLayer.onMouseMove(event);
	}

	var onMouseDown = function(event){
		mainLayer.onMouseDown(event);
	}

	var onMouseUp = function(event){
		mainLayer.onMouseUp(event);
	}
	var onTouchStart = function(event){
	    event.preventDefault();
	    var touch = event.touches[0];
	    var mouseEvent = new MouseEvent("mousedown", {
	        clientX: touch.clientX,
	        clientY: touch.clientY
	    });
	    canvas.dispatchEvent(mouseEvent);
	}

	var onTouchEnd = function(event){
	    var mouseEvent = new MouseEvent("mouseup");
	    canvas.dispatchEvent(mouseEvent);
	}

	var onTouchMove = function(event){
	    event.preventDefault();
	    var touch = event.touches[0];
	    var mouseEvent = new MouseEvent("mousemove", {
	        clientX: touch.clientX,
	        clientY: touch.clientY
	    });
	    canvas.dispatchEvent(mouseEvent);
	}

	var onPointerEnter = function(event){
		weathervane.setShow(true);
	}

	var onPointerExit = function(event){
		weathervane.setShow(false);
	}

	var onTouchCancel = function(event){
	    var mouseEvent = new MouseEvent("mouseup");
	    canvas.dispatchEvent(mouseEvent);
	}

	var onFunctionChange = function(){
		var str = input.value;
        console.log("Function changing to %s", str);
        field.setExpression(str);
        court.reset();

        var url = window.location.href;
        if (url.includes("?")) url = url.slice(0, url.indexOf("?"));

        url += "?=";
        url += "&f="+encodeURI(str);

        try {
	        window.history.replaceState({}, "VectorJam | "+str, url);
        }
        catch (ex) {

        }
        time = 0;
	}

	var court = Court({
		maximum,
		resolution,
		mainLayer,
		evaluate: field.evaluate,
	});

    canvas.addEventListener("mouseenter", onPointerEnter, false);
    canvas.addEventListener("mouseleave", onPointerExit, false);
    canvas.addEventListener("mouseout", onPointerExit, false);

    canvas.addEventListener("mousedown", onMouseDown, false);
    canvas.addEventListener("mouseup", onMouseUp, false);
    canvas.addEventListener("mousemove", onMouseMove, false);

    canvas.addEventListener("touchstart", onTouchStart, false);
    canvas.addEventListener("touchend", onTouchEnd, false);
    canvas.addEventListener("touchcancel", onTouchCancel, false);
    canvas.addEventListener("touchmove", onTouchMove, false);

    start();

    // Set up function input element
    input.addEventListener("change", onFunctionChange, false);
    input.style.width = canvas.style.width;

    onFunctionChange();

    return Object.freeze({

    });
}