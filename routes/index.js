var profesores = require('./profesores.js');
var avisos = require('./avisos.js');

module.exports = function(app){
    
  // profesores and items routing
  app.post('/profesores', profesores.create);
  app.get('/profesores/:email', profesores.findOne);
  app.put('/profesores', profesores.update);
    

  // avisos routing
  app.post('/avisos', avisos.create);
  app.get('/avisos', avisos.findAll);
  app.get('/avisos/:id', avisos.findOne);
  app.put('/avisos', avisos.update);
    
};
