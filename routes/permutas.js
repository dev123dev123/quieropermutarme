var mongo = require('mongodb');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('milapizdb', server);

db.open(function(err, db){

	if(!err) {
		console.log("Connected to 'milapiz' database.");

		db.collection('departamentos', {strict: true}, function(err, collection){
			if(err){
				console.log("The 'departamentos' collection doesn't exist. Creating it with sample data..");
				populateDepartamentos();
			}
		});

		db.collection('distritos', {strict: true}, function(err, collection){
			if(err){
				console.log("The 'distritos' collection doesn't exist. Creating it with sample data..");
				populateDistritos();
			}
		});

		db.collection('permutas', {strict: true}, function(err, collection){
			if(err) {
				console.log("The 'permutas' collection doesn't exist. Creating it with sample data..");
				populatePermutas();
			}
		});
	}
});

var populateDepartamentos = function(){
	var departamentos = [
		{
			nombre: 'Cochabamba'
		},
		{
			nombre: 'Lapaz'
		},
		{
			nombre: 'SantaCruz'
		}
	];

	db.collection('departamentos', function(err, collection){
		collection.insert(departamentos, {safe: true}, function(err, result){});
	});
};

var populateDistritos = function(){
	var distritos = [
		{
			nombre: 'Cercado I',
			nombreDepartamento: 'Cochabamba'
		},
		{
			nombre: 'Yungas',
			nombreDepartamento: 'Lapaz'
		}
	];

	db.collection('distritos', function(err, collection){
		collection.insert(distritos, {safe: true}, function(err, result){});
	});
};

var populatePermutas = function(){
	var permutas = [
		{
			departamento: 'Cochabamba',
			distrito: 'Cercado II',
			turno: 'Tarde',
			descripcionAdicional: 'Preferentemente Adventistas',
			profesorEmail: 'pepito@gmail.com',
			fechaPosteada: '19/Mayo/2013 12:00 AM'
		},
		{
			departamento: 'Lapaz',
			distrito: 'Yungas',
			turno: 'Mañana',
			descripcionAdicional: 'Preferentemente de Vacas',
			profesorEmail: 'johndoe@gmail.com'
		}
	];
	
	db.collection('permutas', function(err, collection){
		collection.insert(permutas, {safe: true}, function(err, result){});
	});
};

exports.findAll = function(request, response) {
	
};