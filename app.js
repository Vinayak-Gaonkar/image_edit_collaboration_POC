
// Express requires these dependencies
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// Configure our application
app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// Configure error handling
app.configure('development', function () {
  app.use(express.errorHandler());
});

//Routes
app.get('/', routes.index);

//  socket.io
var server = http.createServer(app).listen(app.get('port'));
var io = require('socket.io').listen(server);

// connection establish
io.sockets.on('connection', function (socket) {


  // path start
  socket.on('startPath', function (data, sessionId) {

    socket.broadcast.emit('startPath', data, sessionId);

  });

  // path continues 
  socket.on('continuePath', function (data, sessionId) {

    socket.broadcast.emit('continuePath', data, sessionId);

  });

  // path ends 
  socket.on('endPath', function (data, sessionId) {

    socket.broadcast.emit('endPath', data, sessionId);

  });

  socket.on('addImage', function (data, sessionId) {

    socket.broadcast.emit('addImage', data, sessionId);

  });


  socket.on('dragImage', function (data, sessionId) {

    socket.broadcast.emit('dragImage', data, sessionId);

  });

});