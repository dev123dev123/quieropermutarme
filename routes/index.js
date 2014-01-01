var profesores = require('./profesores.js');
var permutas = require('./permutas.js');
var passport = require('passport');
var oauth2 = require('../libs/oauth2');

module.exports = function(app, p){
  // profesores and items routing
  app.post('/api/profesores', profesores.create);
  app.get('/api/profesores/:email', profesores.getProfesorByEmail);
  app.post('/api/profesor', profesores.exists);
  app.put('/api/profesores', profesores.update);

  // please do not delete the below code.
  // app.get('/api/profesores/:email', p.authenticate('bearer', {session: false}), profesores.findOne);
  // app.put('/api/profesores', passport.authenticate('bearer', {session: false}), profesores.update);
    
  // permutas routing
  app.post('/api/permutas', permutas.create);
  app.put('/api/permutas', permutas.update);
  app.get('/api/permutas/:email?*', permutas.get);

  // Authentication
  app.post('/oauth/token', oauth2.token);
  app.get('/api', passport.authenticate('bearer', {session: false}), function(req, res){
    res.send('API is running');
  });
  app.get('/api/userInfo', passport.authenticate('bearer', {session: false}), function(req, res){
    res.json({});
  });
};
