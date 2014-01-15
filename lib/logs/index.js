var winston = require('winston');

module.exports = new (winston.Logger)({
  transports: [
    //new (winston.transports.File)({filename: './logs/debug.log'})
    new (winston.transports.Console)()
  ]
});