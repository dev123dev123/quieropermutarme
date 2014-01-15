var mongoose = require('mongoose');
var AccessTokenSchema;

AccessTokenSchema= new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  token: {
    type: String,
    unique: true,
    required: true
  },
  created: {
    type: Date,
    'default': Date.now
  }
}, {collection: 'AccessTokens'});

module.exports = mongoose.model('AccessToken', AccessTokenSchema);