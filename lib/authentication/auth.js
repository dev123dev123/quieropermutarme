var config = require('../config');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;

var Profesor = require('../models/profesor');
var AccessToken = require('../models/access_token');

passport.use(new BasicStrategy(
  function(username, password, done){
    Profesor.findOne({email: username}, function(err, profesor){
      console.log('Basic Strategy called');
      console.log('Error: ' +  err);


      if(err) { return done(err) }
      if(!profesor){ return done(null, false) }
  
      console.log('Profesor: ' + profesor);      1      
      return done(null, profesor);
    });
  }
));

passport.use(new ClientPasswordStrategy(
  function(clientId, clientSecret, done){
    console.log('ClientPasswordStrategy called');
    Profesor.findeOne({email: clientId}, function(err, profesor){
      if(err) { return done(err) }
      if(!profesor) { return done(null, false)}
      return done(null, profesor);
    });  
  }
  )
);

passport.use(new BearerStrategy({}, function(accessToken, done){
  console.log('Hey MAMA!');
  console.log('accesToken: ' + accessToken);
  AccessToken.findOne({token: accessToken}, function(err, token){
    console.log('Bearer Strategy called');
    console.log('Err: ' + err);
    console.log('Token: ' + token);
    if(err) { return done(err); }
    if(!token) { return done(null, false);}

    if( Math.round((Date.now()-token.created)/1000) > config.security.tokenLife ){
      AccessToken.remove({token: token}, function(err){
    if(err) return done(err);
      });

      return done(null, false, {message: 'Token expired'});
    }

    console.log('Token user email: ' + token.userEmail);

    Profesor.findOne({email: token.userEmail}, function(err, profesor){
      console.log('Token profesor: ' + profesor);
      if(err) { return done(err); }
      if(!profesor) { return done(null, false, {message: 'Unknown user'});}

      var info = {scope: '*' };
      done(null, profesor, info);
    });
  });
}));
