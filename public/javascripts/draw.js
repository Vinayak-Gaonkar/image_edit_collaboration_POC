


// The faster the user moves their mouse
// the larger the circle will be
// We dont want it to be larger/smaller than this
tool.maxDistance = 2;
tool.maxDistance = 80;
var raster = new Raster('http://assets.paperjs.org/images/marilyn.jpg');
raster.position = view.center;
raster.scale(0.5);
var pathFalg = true

raster.onMouseDrag = function (event) {
  pathFalg = false
  raster.position += event.delta;
}
raster.onMouseUp = function (event) {
  pathFalg = true
}
// Each user has a unique session ID
var sessionId = io.socket.sessionid;
// Returns an object specifying a semi-random color
function randomColor() {

  return {
    hue: Math.random() * 360,
    saturation: 0.8,
    brightness: 0.8,
    alpha: 0.5
  };

}

// An object to keep track of each users paths
// We'll use session ID's as keys
paths = {};

images = {};





// -----------
// User Events
// -----------


function onMouseDown(event) {

  color = randomColor();

  startPath(event.point, color, sessionId);

  emit("startPath", { point: event.point, color: color }, sessionId);

}

function onMouseDrag(event) {
  if (pathFalg) {
  var step = event.delta / 2;
  step.angle += 90;
  var top = event.middlePoint + step;
  var bottom = event.middlePoint - step;

  continuePath(top, bottom, sessionId);

  // Inform the backend
  emit("continuePath", { top: top, bottom: bottom }, sessionId);
  }
}

function onMouseUp(event) {

  endPath(event.point, sessionId);

  // Inform the backend
  emit("endPath", { point: event.point }, sessionId);

}






// -----------------
// Drawing functions
// Use to draw multiple users paths
// -----------------
function imageDrag(event) {
  pathFalg = false
  this.position += event.delta;
}

function imageMouseUp() {
  pathFalg = true
  emit("dragImage", this.position, sessionId);
}
function startPath(point, color, sessionId) {
  paths[sessionId] = new Path();
  paths[sessionId].fillColor = color;
  paths[sessionId].add(point);
}

function continuePath(top, bottom, sessionId) {
 
    var path = paths[sessionId];
    path.add(top);
    path.insert(0, bottom);

}

function endPath(point, sessionId) {

  var path = paths[sessionId];

  path.add(point);
  path.closed = true;
  path.smooth();

  delete paths[sessionId]

}
function addImage(imageName, sessionId) {
  var newRaster = new Raster(imageName);
  newRaster.position = view.center;
  newRaster.scale(0.08);
  newRaster.onMouseDrag = imageDrag
  newRaster.onMouseUp = imageMouseUp
  images[sessionId] = newRaster
}






// -----------------
// socket fucntions
// -----------------


function emit(eventName, data) {

  io.emit(eventName, data, sessionId);

}


globals.getImageName = function (imageName, sessionId) {

  addImage(imageName, sessionId)
  emit("addImage", imageName, sessionId);

}



io.on('startPath', function (data, sessionId) {
  var myPoint = new Point(data.point[1], data.point[2])
  startPath(myPoint, data.color, sessionId);

})


io.on('continuePath', function (data, sessionId) {
  var topPoint = new Point(data.top[1], data.top[2])
  var bottomPoint = new Point(data.bottom[1], data.bottom[2])
  continuePath(topPoint, bottomPoint, sessionId);
  view.draw();
})


io.on('endPath', function (data, sessionId) {
  var topPoint = new Point(data.point[1], data.point[2])
  endPath(topPoint, sessionId);
  view.draw();

})

io.on('addImage', function (data, sessionId) {
  addImage(data, sessionId)
})

io.on('dragImage', function (data, sessionId) {
  images[sessionId].position.x =data[1]
  images[sessionId].position.y =data[2] 

})
