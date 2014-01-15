var mongoose = require('mongoose');
var db = mongoose.connection;
var config = require('../config');
var connectionString = config.db.mongodb_url;

db.on('error', console.error.bind(console));

db.once('open', function callback(err){
  if(err) {
    console.log('err: ' + err.stack)  
  } else {
    console.log('connection opened with database');
  }
});

mongoose.connect(connectionString);

module.exports = mongoose;