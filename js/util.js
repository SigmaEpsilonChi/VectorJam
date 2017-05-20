// returns a gaussian random function with the given mean and stdev.
function gaussian(mean, stdev) {
    var y2;
    var use_last = false;
    return function() {
        var y1;
        if(use_last) {
           y1 = y2;
           use_last = false;
        }
        else {
            var x1, x2, w;
            do {
                 x1 = 2.0 * Math.random() - 1.0;
                 x2 = 2.0 * Math.random() - 1.0;
                 w  = x1 * x1 + x2 * x2;               
            } while( w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w))/w);
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
       }

       var retval = mean + stdev * y1;
       if(retval > 0) 
           return retval;
       return -retval;
   }
}

function eulerIntegrate(position, velocity, acceleration, timeDelta){
    velocity.x += acceleration.x*timeDelta;
    velocity.y += acceleration.y*timeDelta;

    position.x += velocity.x*timeDelta;
    position.y += velocity.y*timeDelta;
}

function directIntegrate(position, velocity, timeDelta){
    position.x += velocity.x*timeDelta;
    position.y += velocity.y*timeDelta;
}

function verletIntegrate(position, oldPosition, acceleration, timeDelta){
    var ox = oldPosition.x;
    var oy = oldPosition.y;
    oldPosition.x = position.x;
    oldPosition.y = position.y;
    position.x = 2*position.x-ox+acceleration.x*timeDelta*timeDelta;
    position.y = 2*position.y-oy+acceleration.y*timeDelta*timeDelta;
}

function makeComplex(v){
    if (v == null || typeof v.im === 'undefined') {
        if (isNaN(v)) v = math.complex(0, 0);
        else v = math.complex(v, 0);
    }
    return v;
}

function clamp01(value){
    return Math.max(0, Math.min(value, 1));
}

function smooth01(value){
    //return clamp01((1-Math.cos(value*Math.PI))/2);
    return ((1-Math.cos(value*Math.PI))/2);
}

function lerp(a, b, t){
    //t = clamp01(t);
    return (1-t)*a+t*b;
}

function unlerp(a, b, t){
    //t = clamp01(t);
    return (t-a)/(b-a);
}

function remap(a0, b0, a1, b1, t){
    return lerp(a1, b1, unlerp(a0, b0, t));
}

function remapClamp(a0, b0, a1, b1, t){
    return lerp(a1, b1, clamp01(unlerp(a0, b0, t)));
}

function addPoints(a, b){
    return {
        x: a.x+b.x,
        y: a.y+b.y
    }
}

function subtractPoints(a, b){
    return {
        x: a.x-b.x,
        y: a.y-b.y
    }
}

function rotatePoint(p, a){
    return {
        x: p.x*Math.cos(a)+p.y*-Math.sin(a),
        y: p.x*Math.sin(a)+p.y*Math.cos(a)
    }
}

function rotateAround(p, c, a){
    return addPoints(rotatePoint(subtractPoints(p, c), a), c);
}

function lerpPoint(a, b, t){
    return {
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t)
    }
}

function smoothLerp(a, b, t){
    return lerp(a, b, smooth01(t));
}

function smoothLerpPoint(a, b, t){
    return lerpPoint(a, b, smooth01(t));
}

function tickProgress(flag, progress, duration){
    if (progress == flag?1:0) return progress;
    if (flag) progress += deltaTime/duration;
    else progress -= deltaTime/duration;
    return clamp01(progress);
}

function rgba(r, g, b, a){
    return "rgba("+[r, g, b, a]+")";
}

function va(v, a){
    //return "rgba("+v+", "+v+", "+v+", "+a+")";
    v = Math.round(v);
    return "rgba("+[v, v, v, a]+")";
}

function pointString(point){
    return "("+trunc(point.x)+", "+trunc(point.y)+")";
}

function xyString(x, y){
    return "("+x+", "+y+")";
}

function distance(a, b){
    return Math.sqrt(Math.pow((a.x-b.x), 2)+Math.pow((a.y-b.y), 2));
}
function trunc(x, p=2){
    return Math.round(x*Math.pow(10, p))/Math.pow(10, p);
}
function trail(x){
    var str = x.toString();
    if (!str.includes('.')) str = str+".0";
    return str;
}

function manhattan(a, b){
    return Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
}

function approximately(v1, v2, epsilon = 0.001) {
  return Math.abs(v1 - v2) < epsilon;
};

function distribute(index, total, progress, overlap = 0){
    var fraction = 1/total;
    var duration = lerp(fraction, 1, overlap);
    var start = lerp(index*fraction, 0, overlap);
    var end = start+duration;
    return remapClamp(start, end, 0, 1, progress);
}

function addArrayRow(array){
    newRow = [];
    sourceRow = array[array.length-1];
    for (var i = 0; i < sourceRow.length; i++) {
        newRow.push(sourceRow[i]);
    }
    array.push(newRow);
    return array;
}

function subtractArrayRow(array){
    array.pop();
    return array;
}

function addArrayColumn(array){
    var row;
    for (var i = 0; i < array.length; i++) {
        row = array[i];
        row.push(row[row.length-1]);
    }
    return array;
}

function subtractArrayColumn(array){
    for (var i = 0; i < array.length; i++) {
        array[i].pop();
    }
    return array;
}

function divisible(a, b){
    return a/b == Math.round(a/b);
}

function lowestFactor(a){
    for (var i = 2; i < a; i++) {
        if (divisible(a, i)) return i;
    }
    return a;
}

function getQueryString(field, url){
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
}

function getMousePos(canvas, event){
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function convertTouches(event){
    var touches = event.touches;
    if (touches.length > 0) {
        event.clientX = touches[0].clientX;
        event.clientY = touches[0].clientY;
    }
}