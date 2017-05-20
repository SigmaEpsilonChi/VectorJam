function Game(spec){
	var {
		canvas,
		maximum,
		resolution,
		timer,
		playButton,
		codexElement,
		definitionTemplate,
	} = spec;

	canvas.width = resolution;
	canvas.height = resolution;
	
	var context = canvas.getContext('2d');

    var mainLayer = Layer({
        name: "Main Layer",
        canvas,
    });

    var playState = false;
    var playTime = 0;
    var playStartTime = 0;

    var time = 0;
    var timeDelta;
    var drawTime = 0;

    var FPS = 60;
    var timerId = 0;
    var animationTimestamp = 0;

    var date = new Date();

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

        if (playState) {
        	playTime = time-playStartTime;
        	timer.innerHTML = "T = "+trail(trunc(playTime, 1));
        }
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

    var setPlayState = function(PLAYSTATE){
    	if (playState != PLAYSTATE) {
    		playState = PLAYSTATE;
    		if (playState) {
    			playStartTime = time;
	    		publish("/setPlayState", [true, time]);
    		}
    		else {
    			playTime = 0;
    			playStartTime = -1;
        		timer.innerHTML = "T = 0";
	    		publish("/setPlayState", [false, time]);
    		}
    	}
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
		field.weathervane.setShow(true);
	}

	var onPointerExit = function(event){
		field.weathervane.setShow(false);
	}

	var onTouchCancel = function(event){
	    var mouseEvent = new MouseEvent("mouseup");
	    canvas.dispatchEvent(mouseEvent);
	}

	var onPlayButtonClick = function(){
		setPlayState(!playState);
	}

	var getSpec = function(){
		var tr = {};
		publish("/spec/write", [tr]);
		return tr;
	}

	var getSpecString = function(){
        var spec = getSpec();
    	var tr = JSON.stringify(spec);
    	tr = LZString.compressToBase64(tr);
    	return tr;
	}

	var getUrl = function(){
        var url = window.location.href;
        if (url.includes("?")) url = url.slice(0, url.indexOf("?"));

        url += "?=";
        url += "&spec="+getSpecString();

        return url;
	}

	var writeUrl = function(){
	    window.history.replaceState({}, "VectorJam", getUrl());
	}

	var readUrl = function(){
    	var specString = getQueryString("spec");

    	if (specString != null) {
	    	var str = LZString.decompressFromBase64(specString);
	    	var spec = JSON.parse(str);

			publish("/spec/read", [spec]);
			return true;
    	}
    	return false;
	}

    // Set up Field to evaluate and draw the vector field

    var field = Field({
    	maximum,
    	resolution,
    	mainLayer,
    });

    // Set up codex, which manages definitions

    var codex = Codex({
    	codexElement,
    	definitionTemplate,
    	field,
    });

    // Set up court, which manages balls

	var court = Court({
		maximum,
		resolution,
		mainLayer,
		evaluate: field.evaluate,
	});

	subscribe("/codex/refresh", writeUrl);

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

    playButton.addEventListener("click", onPlayButtonClick, false);

    //if (!readUrl()) codex.refreshCodex();

    field.resetScopes();

    start();

    readUrl();
    writeUrl();

    //onFunctionChange();

    return Object.freeze({

    });
}