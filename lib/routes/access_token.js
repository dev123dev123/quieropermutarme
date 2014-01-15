var AccessTokenService = require('../access_token');
var AccessToken = new AccessTokenService();

module.exports.exists = function(req, res, next){
  AccessToken.exists(req, function(err, accessToken){
    if (err) {
      return next(err);
    }
    next();
  });
};

module.exports.create = function(req, res, next){
  AccessToken.create(req, function(err, accessToken){
    if (err) {
      return next(err);
    }
    res.json(accessToken);
  });
};  