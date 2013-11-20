var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var db = mongoose.connection;
var config =  require('./config');
var logger = require('bunyan-request-logger');
var errorHandler = require('express-error-handler');
var log = logger();
var http = require('http');
var server;


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('connection opened');
});

mongoose.connect(config.db.mongodb_url);

function logErrors(err, req, res, next){
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next){
  if(req.xhr){
    res.send(502, {message: 'Something blew up!'});
  }else{
    next(err);
  }
}

function errorHandler(err, req, res, next){
  res.send(503, {message: "ehheehheheheheh"});
}

app.set('port', port);

app.configure(function(){
  app.use(log.requestLogger());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
  app.use(errorHandler.httpError(404));
  app.use(log.errorLogger());
});

require('./routes')(app);

app.configure(function(){
  app.use(errorHandler({server: server}));
});

server = http.createServer(app);



server.listen(process.env.PORT || app.get('port'));
console.log('Listening on port 3000......');

module.exports = app;






