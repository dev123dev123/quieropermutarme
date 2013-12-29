var profesores = require('./profesores.js');
var avisos = require('./avisos.js');
var passport = require('passport');
var oauth2 = require('../libs/oauth2');

module.exports = function(app, p){
    
  // profesores and items routing
  app.post('/api/profesores', profesores.create);
  // app.get('/api/profesores/:email', profesores.getSalt);
  app.post('/api/profesor', profesores.exists);;
  app.put('/api/profesores', profesores.update);

  // app.get('/api/profesores/:email', p.authenticate('bearer', {session: false}), profesores.findOne);
  // app.put('/api/profesores', passport.authenticate('bearer', {session: false}), profesores.update);
    

  // avisos routing
  // app.post('/api/avisos', avisos.create);
  // app.get('/api/avisos', avisos.findAll);
  // app.get('/api/avisos/:id', avisos.findOne);
  // app.put('/api/avisos', avisos.update);

  // Authentication
  app.post('/oauth/token', oauth2.token);
  app.get('/api', passport.authenticate('bearer', {session: false}), function(req, res){
    res.send('API is running');
  });
  app.get('/api/userInfo', passport.authenticate('bearer', {session: false}), function(req, res){
    res.json({});
  });
  
  
    
};
