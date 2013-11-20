var profesores = require('./profesores.js');

module.exports = function(app){
  console.log('setting up the routes');
    
  // profesores routing
  app.post('/profesores', profesores.create);
  app.get('/profesores/:email', profesores.findOne);
    
};
