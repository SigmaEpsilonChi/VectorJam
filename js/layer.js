function Layer(spec){
    var {
        name = "New Layer",
        
        parent = null,
        canvas = null,
        
        width = null,
        height = width,
        
        layerIndex = 0,
    } = spec;

    var children = [];
    var components = [];
    var dirty = true;

    if (width == null || height == null) {
        if (canvas != null) {
            width = canvas.width;
            height = canvas.height;
        }
        else if (parent != null) {
            width = parent.width;
            height = parent.height;
        }
    }
    else if (canvas != null) {
        canvas.width = width;
        canvas.height = height;
    }

    if (canvas == null) {
        canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
    }

    var context = canvas.getContext('2d');

    var draw = function(parentContext){
        //console.log("%s is drawing", name);
        if (dirty) {
            //console.log("%s is redrawing %s components and %s children.", name, components.length, children.length);
            clear();
            for (var i = 0; i < children.length; i++) {
                children[i].draw(context);
            }
            for (var i = 0; i < components.length; i++) {
                components[i].draw(context);
            }
        }

        if (parentContext != null) {
            parentContext.drawImage(canvas, 0, 0);
            //console.log("%s is drawing its canvas to %s", name, parent.name);
        }
        dirty = false;
    }

    var update = function(time, timeDelta){
        //console.log("%s is updating", name);
        for (var i = 0; i < components.length; i++) {
            if (components[i].update) dirty = (components[i].update(time, timeDelta) == true) || dirty;
        }
        for (var i = 0; i < children.length; i++) {
            dirty = (children[i].update(time, timeDelta) == true) || dirty;
        }
        return dirty;
    }

    var clear = function(){
        context.clearRect(0, 0, width, height);
    }

    var addComponent = function(component){
        dirty = true;
        components.push(component);
        //console.log("%s: adding component #%s", name, components.length);
    }

    var removeComponent = function(component){
        dirty = true;
        var index = components.indexOf(component);
        if (index >= 0) components.splice(index, 1);
    }

    var clearComponents = function(){
        dirty = true;
        components.length = 0;
    }

    var addChild = function(child){
        dirty = true;
        children.push(child);
        sortChildren();
    }

    var removeChild = function(child){
        dirty = true;
        var index = children.indexOf(child);
        if (index >= 0) children.splice(index, 1);
    }

    var refresh = function(){
        dirty = true;
    }

    var sortChildren = function(){
        children.sort(function(a, b){
            return a.layerIndex-b.layerIndex;
        });
    }

    var onMouseDown = function(event){
        for (var i = 0; i < components.length; i++) {
            if (components[i].onMouseDown) dirty = components[i].onMouseDown(event) || dirty;
        }
        for (var i = 0; i < children.length; i++) {
            dirty = (children[i].onMouseDown(event) == true) || dirty;
        }
        return dirty;
    }

    var onMouseUp = function(event){
        for (var i = 0; i < components.length; i++) {
            if (components[i].onMouseUp) dirty = components[i].onMouseUp(event) || dirty;
        }
        for (var i = 0; i < children.length; i++) {
            dirty = (children[i].onMouseUp(event) == true) || dirty;
        }
        return dirty;
    }

    var onMouseMove = function(event){
        for (var i = 0; i < components.length; i++) {
            if (components[i].onMouseMove) dirty = components[i].onMouseMove(event) || dirty;
        }
        for (var i = 0; i < children.length; i++) {
            dirty = (children[i].onMouseMove(event) == true) || dirty;
        }
        return dirty;
    }

    var destroy = function(){
        parent.removeChild(this);
    }

    var tr = Object.freeze({
        // Fields
        name,
        width,
        height,
        layerIndex,

        // Methods
        draw,
        update,
        destroy,
        refresh,

        addComponent,
        removeComponent,
        clearComponents,

        addChild,
        removeChild,

        onMouseMove,
        onMouseDown,
        onMouseUp,
    });

    console.log("Creating layer: %s", name);
    if (parent != null) {
        console.log("Adding %s to %s children", name, parent.name);
        parent.addChild(tr);
    }


    return tr;
}