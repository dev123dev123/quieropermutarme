var profesor = require('./profesor');
var permuta = require('./permuta');
var passport = require('passport');
var oauth2 = require('../authentication/oauth2');

module.exports = {
  configure: function(app, passport){
    //profesores routing
    app.post('/api/profesores', profesor.create);
    app.get('/api/profesores/:email', profesor.getProfesorByEmail);
    app.post('/api/profesores/login', profesor.login);
    app.put('/api/profesores', profesor.update);

    // permutas routing
    app.post('/api/permutas', permuta.create);
    app.put('/api/permutas', permuta.update);
    app.get('/api/profesores/:email/permutas', permuta.getPermutaByProfesorEmail);
    app.get('/api/permutas', permuta.getPermutasByOrigenAndDestino);

    // app.delete('/api/profesores/:email/permutas', permutas.deleteAll);

    // Authentication
    // please do not delete the below code.
    // app.get('/api/profesores/:email', p.authenticate('bearer', {session: false}), profesores.findOne);
    // app.put('/api/profesores', passport.authenticate('bearer', {session: false}), profesores.update);

    // app.post('/oauth/token', oauth2.token);
    // app.get('/api', passport.authenticate('bearer', {session: false}), function(req, res){
    //   res.send('API is running');
    // });
    // app.get('/api/userInfo', passport.authenticate('bearer', {session: false}), function(req, res){
    //   res.json({});
    // });
  }
};