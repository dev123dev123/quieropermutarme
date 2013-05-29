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
			password: '123',
			numeroCelular: '74347537',
			numeroFijo: '43353523',
			especialidad: 'Musica'
		},
		{
			nombreCompleto: 'John Doe',
			email: 'johndoe@gmail.com',
			password: 'abc',
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
	console.log('findAll called');
	db.collection('profesores', function(err, collection){
		collection.find().toArray(function(err, profesores){
			response.send(profesores);
		});
	});
};

exports.findByEmailAddress = function(request, response){
	console.log('findByEmailAddress');
	var userEmail = request.params.user_address_email;
	db.collection('profesores', function(err, collection){
		collection.findOne({'email': userEmail}, function(err, profe){
			response.send(profe);
		});
	});
};

exports.add = function(request, response){
	console.log('add');
	var profe = request.body;
	console.log('Adding a profe: ' + JSON.stringify(body));
	db.collection('profesores', function(err, profes){
		if(err) {
			response.send({'error': 'An error has occured.'});
		}else{
			console.log('Success: ' + JSON.stringify(result[0]));
			response.send(result[0]);
		}
	});
};

exports.update = function(request, response){
	console.log('update');
	var userEmail = request.params.user_address_email;
	var profe = request.body;

	console.log('Updading a profe: ' + userEmail);
	console.log(JSON.stringify());

	db.collection('profesores', function(err, profes){
		profes.update({'email': userEmail}, profe, {safe: true}, function(err, result){
			if(err){
				console.log('Error updating a profe: ' + err);
				response.send({'error': 'An error has accured.'});
			}else{
				console.log('' + result + ' document(s) updated');
			}	
		});
	});
};

exports.signin = function(request, response){
	console.log('signin called');
	console.log('body: ' + request.body);
	var profe = request.body;

	db.collection('profesores', function(err, profes){
		profes.findOne({email: profe.email, $or:[{password: profe.password}]}, function(err, profe){
			console.log('profe:' + profe);
			console.log('err:' + err);
			if(!profe){
				response.send( "Not found", 404 );
				response.end();
			} else{
				response.writeHead(200, {'Content-Type': 'application/json'});
				response.end(JSON.stringify(profe));
			}
		});
	});
}

exports.delete = function(request, response){
	console.log('delete');
	var userEmail = request.params.user_address_email;
	console.log('Deleting a profe: ' + userEmail);

	db.collection('profesores', function(err, profes){

		profes.remove({'email': userEmail}, {safe: true}, function(err, result){
			if(err){
				response.send({'error': 'An error has occured - ' + err});
			} else{
				console.log('' + result + ' document(s) deleted');
				response.send(request.body);
			}
		});
	});
};