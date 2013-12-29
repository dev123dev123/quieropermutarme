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
var passport = require('passport');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('connection opened');
});

mongoose.connect(config.db.mongodb_url);

app.set('port', port);

app.configure(function(){
  //app.use(express.logger());
  //app.use(log.requestLogger());
  app.use(express.bodyParser());
  app.use(passport.initialize());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(errorHandler.httpError(404));
  //app.use(log.errorLogger());
  require('./libs/auth');
});

require('./routes')(app, passport);

app.configure(function(){
  app.use(errorHandler({server: server}));
});

server = http.createServer(app);

server.listen(process.env.PORT || app.get('port'));
console.log('Listening on port 3000......');

module.exports = app;
