var express = require('express');
var profesores = require('./routes/profesores');
var app = express();

app.configure(function(){
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
});

app.get('/profesores', profesores.findAll);
app.get('/profesores/:user_address_email', profesores.findByEmailAddress);
app.post('/profesores', profesores.add);
app.put('/profesores/:user_address_email', profesores.update);
app.delete('/profesores/:user_addres_email', profesores.delete);

app.listen(3000);
console.log('Listening on port 3000......');
