var mongo = require('mongodb');

var Server = mongo.Server,
		Db = mongo.Db,
		BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('milapizdb', server);

db.open(function(err, db){
	if(!err){
		console.log("Connected to 'milapizdb' database.");
		db.collection('profesores', {strict: true}, function(err, collection){
			if(err) {
				console.log("The 'milapizdb' collection doesnt exist. Creating it with sample data..");
				populateDB();
			}
		});
	}
});

var populateDB = function(){
	var profesores = [
		{
			nombreCompleto: 'Pepito Perez LosPalotes',
			email: 'pepito@gmail.com',
			contraseña: '123',
			numeroCelular: '74347537',
			numeroFijo: '43353523',
			especialidad: 'Musica'
		},
		{
			nombreCompleto: 'John Doe',
			email: 'johndoe@gmail.com',
			contraseña: 'abc',
			numeroCelular: '45675876',
			numeroFijo: '34534543',
			especialidad: 'Ciencias Sociales'
		}
	];

	db.collection('profesores', function(err, collection){
		collection.insert(profesores, {safe: true}, function(err, result){});
	});
};

exports.findAll = function(request, response){
	db.collection('profesores', function(err, collection){
		collection.find().toArray(function(err, profesores){
			response.send(profesores);
		});
	});
};

exports.findByEmailAddress = function(request, response){
	var userEmail = request.params.user_address_email;
	db.collection('profesores', function(err, collection){
		collection.findOne({'email': userEmail}, function(err, profe){
			response.send(profe);
		});
	});
};