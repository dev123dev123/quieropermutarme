var oauth2orize = require('oauth2orize');
var passport = require('passport');
var crypto = require('crypto');
var config = require('../config');
var Profesor = require('../models/profesor');
var AccessToken = require('../models/access_token');

console.log('server calling');
var server = oauth2orize.createServer();

server.grant(oauth2orize.grant.code(function(client, redirectURI, user, ares, done){
  console.log('grant called');
}));

server.exchange(oauth2orize.exchange.code(function(client, code, redirectURI, done){
  console.log('exchange code');
  done(null, true);
}));


// call with this parameter in the browser grant_type: password, username: xxxx, password: xxxxx
server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done){
  
  Profesor.findOne({email: username}, function(err, profesor){
    if(err) { return done(err); }
    if(!profesor) { return done(null, false); }
    if(!profesor.checkPassword(password)) { return done(null, false); }
    
    AccessToken.findOneAndRemove({userEmail: profesor.email}, function(err){
      if(err) return done(err);
    });

    var tokenValue = crypto.randomBytes(32).toString('base64');
    var token = new AccessToken({userEmail: profesor.email, token: tokenValue});

    token.save(function(err, token){
      if(err) { return done(err); }
      done(null, tokenValue, {'expires_in': config.security.tokenLife});
    });
  });
}));


server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done){
  console.log('refreshToken');
}));



exports.token = [
  passport.authenticate(['basic', 'oauth2-client-password'], {session: false}),
  server.token(),
  server.errorHandler()
];
