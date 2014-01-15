var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var db = mongoose.connection;
var config =  require('../config');
var winston = require('winston');
var expressWinston = require('express-winston');
var http = require('http');
var server;
var routing = require('../routes');
var path = require('path');

app.configure(function(){
  app.set('port', port);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(expressWinston.logger({
    transports: [
      new winston.transports.File({
        json: true,
        colorize: true,
        filename: path.join(__dirname, '/../logs/requests.log')
      })
    ],
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}'
  }));
  app.use(app.router);
  app.use(expressWinston.errorLogger({
    transports: [
      new winston.transports.File({
        json: true,
        colorize: true,
        filename: path.join(__dirname, '/../logs/errors.log')
      })
    ]
  }));
  app.use(express.logger());
  app.use(express.static(path.join(__dirname, '/public')));
  app.use(logErrors);
  app.use(clientErrorHandler);
  app.use(errorHandler);
});

routing.configure(app);

server = http.createServer(app);
server.listen(process.env.PORT || app.get('port'));
console.log('Listening on port ' + app.get('port'));

module.exports = app;

/*winston.handleExceptions(new winston.transports.File(
  {
    filename: './logs/exceptions.log'
  }
));*/

function logErrors(err, req, res, next) {
  //console.error(err.stack);
  next(err);
};

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.send(500, {error: 'Something blew up!'});
  } else {
    next(err);
  }
};

function errorHandler(err, req, res, next) {
  if (!err.code) {
    err.code = 500;
  }
  console.log(err.code);
  res.send(err.code, {error: err.message});
};