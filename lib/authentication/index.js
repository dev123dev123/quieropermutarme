var ProfesorService = require('../profesor');
var AccessTokenService = require('../access_token')
var Profesor = new ProfesorService();
var AccessToken = new AccessTokenService();

function authenticate(req, res, next){
  AccessToken.exists(req, function(err, accessToken){
    
  });
}

function getToken(req, res){
  Profesor.login(req, function(err, profesor){

  });
}

module.exports = {
  authenticate: authenticate,
  getToken: getToken
};