var AccessTokenModel = require('../models/access_token');
// var ProfesorModel = require('../models/profesor');
var ProfesorService = require('../profesor');
var Profesor = new ProfesorService();
var logger = require('../logs');
var util = require('../utils');
var config = require('../config');
// logger.debug = console.log;

function AccessToken(){}

AccessToken.prototype.create = function(req, callback){
  logger.debug('getToken method was called');
  var email = req.body.email;
  Profesor.login(req, function(err, profesor){
    if(err) {
      return callback(err, null);
    }

    AccessTokenModel.findOneAndRemove({userEmail: email}, function(err){
      logger.debug('findOneAndRemove method from AccessToken was called.');
      if (err) {
        logger.debug('there was an error in the query');
        err.code = 500;
        return callback(err, null);
      }
      var tokenValue = util.createSalt();
      var token = new AccessTokenModel({userEmail: email, token: tokenValue});
      token.save(function(err){
        logger.debug('saving a token...');
        if (err) {
          logger.debug('error found while a token was being saved');
          err.code = 500;
          return callback(err, null);
        }
        callback(null, token);
      });
    });
  });
};

AccessToken.prototype.exists = function(req, callback){
  logger.debug('exists method was called');

  var tokenValue = req.headers['token'];

  if (util.isNullOrEmptyString(tokenValue)) {
    logger.debug('no token sent');
    var error = new Error('no token sent');
    error.code = 401;
    return callback(error, null);
  }

  AccessTokenModel.findOne({token: tokenValue}, function(err, accessToken){
    logger.debug('findOne method was called');
    if (err) {
      logger.debug('There was an error in trying to find an access token, sorry');
      err.code = 500;
      return callback(err, null);
    }

    if (!accessToken) {
      logger.debug('No access token was found');
      var error = new Error('No access token was found');
      error.code = 404;
      return callback(error, null);
    }

    //check if the token has expired
    if (util.hasTokenExpired(accessToken, config.security.tokenLife)) {
      logger.debug('Access Token has expired');
      AccessTokenModel.remove({token: tokenValue}, function(err){
        if (err) {
          logger.debug('error while removing an access token that expired.');
          err.code = 401;
          return callback(err, null);
        }

        var error = new Error('The access token has expired you should renew it');
        error.code = 409;
        logger.debug('----------The profesor is not authenticated');
        return callback(error, null); 
      });
    } else {
      logger.debug('-------The profesor is authenticated');
      return callback(null, accessToken);  
    } 
  });
};

module.exports = AccessToken;