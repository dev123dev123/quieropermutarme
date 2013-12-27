var mongoose = require('mongoose');

var accessTokenSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model('AccessToken', accessTokenSchema);
