var profesor = require('./profesor');
var permuta = require('./permuta');
var accessToken = require('./access_token');

module.exports = {
  configure: function(app){
    //profesores routing
    app.post('/api/profesores', profesor.create); //this route will not validate any authentication.
    app.get('/api/profesores/:email', accessToken.exists, profesor.getProfesorByEmail);
    app.post('/api/profesores/login', profesor.login);
    // app.post('/api/profesores/login', accessToken.exists, profesor.login);
    app.put('/api/profesores', accessToken.exists, profesor.update);

    // permutas routing
    app.post('/api/permutas', accessToken.exists, permuta.create);
    app.put('/api/permutas', accessToken.exists, permuta.update);
    app.get('/api/profesores/:email/permutas', accessToken.exists, permuta.getPermutaByProfesorEmail);
    app.get('/api/permutas', accessToken.exists, permuta.getPermutasByOrigenAndDestino);
    // app.delete('/api/profesores/:email/permutas', permutas.deleteAll);

    // Authentication
    app.post('/auth/token', accessToken.create);
    app.get('/api', accessToken.exists, function(req, res){
      res.send('API is running');
    });

    // Reset Profesor's password
    app.post('/api/profesores/password/reset', profesor.resetPassword);

    // Change profesor's password
    app.post('/api/profesores/password/change', accessToken.exists, profesor.changePassword);
  }
};