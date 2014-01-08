var Permuta = require('../models/permuta');
var Profesor = require('../models/profesor');

module.exports.create = function(req, res, next){
	console.log('permuta create method called');
	console.log('req.body');
	console.log(req.body);
	var permuta = new Permuta(req.body);

	if(Object.keys(req.body).length <= 0){
		return res.status(404).send('no data sent');
	}

	if(typeof req.body.profesorEmail === "undefined"){
		return res.status(404).send('no email provided');
	}

	Profesor.findOne({email: req.body.profesorEmail}, function(err, profesorFound){
		console.log('profesor findOne called');
		if(!profesorFound){
		 console.log('profesor not exists error');
		 return res.status(404).send('profesor not exists error');
		}
      
		Permuta.findOne({profesorEmail: permuta.profesorEmail}, function(err, data){
			console.log('findOne permuta called');
			if(err){
				console.log('error found: ' + err.stack);
				return res.status(404).send('error found: ' + err.stack);
			}		

			if(data){
				console.log('error permuta already exists: ' + data);
				return res.status(404).send('error permuta already exists');
			}


			
			permuta.save(function(err, data){
				console.log('permuta save called');
				if(err){
					console.log('err found: ' + err.stack);
					return res.status(404).send('error found: ' + err.stack);
				}			

				if(!data){
					console.log('data was not saved');
					return res.status(404).send("permuta wasn't saved");
				}

				console.log('data saved');
				console.log(data);
				return res.json(data);
			});
		}); 
  });
};

function getDestinosWithProfesorEmail(data){
	var result = [];
	var i, j, lenPermutas, lenDestinos;

	for (var i=0,lenPermutas=data.length; i<lenPermutas; i++) {
		for (var j=0,lenDestinos=data[i].destinos.length; j < lenDestinos; j++) {
			var item = {
				destino: data[i].destinos[j],
				updatedAt: data[i].updatedAt,
				isPublished: data[i].isPublished,
				profesorEmail: data[i].profesorEmail,
				origen: data[i].origen[0]
			};
			result.push(item);
		};
	};
	return result;
}



module.exports.getPermutaByProfesorEmail = function(req, res, next){
	
	if(!req.params.email){
		return res.status(404).send('no email provided');
	}

	var filter = {
		profesorEmail: req.params.email
	};

	Permuta.find(filter, function(err, data){
		if(err){
			console.log('error found: ' + err.stack);
			return res.status(404).send('error found: ' + err.stack);
		}

		if(!data){
			console.log('no data');
			return res.status(404).send('no data');
		}

		res.json(data);
	});
};

module.exports.getPermutasByOrigenAndDestino = function(req, res, next){
	var origenDepartamento = req.query.origenDepartamento;
	var origenDistrito = req.query.origenDistrito;
	var destinoDepartamento = req.query.destinoDepartamento;
	var destinoDistrito = req.query.destinoDistrito;
	var matchLugares = {
		"destinos.departamento": destinoDepartamento,
		"destinos.distrito": destinoDistrito,
		"origen.departamento": origenDepartamento,
		"origen.distrito": origenDistrito
	};

	console.log('calling getPermutasByOrigenAndDestino');

	Permuta
	.aggregate(
	
		{$match: matchLugares}, 
		{$unwind: "$destinos"}, 
		{$match: matchLugares}, 
		{$project: 
			{
				_id: 0,
				origen: {departamento: 1, distrito: 1},
				destino: {departamento: "$destinos.departamento", distrito: "$destinos.distrito"}, 
				updatedAt:1, 
				profesorEmail:1
			}
		},
		function(err, data){
			if(err){
				console.log('err: ' + err);
				res.status(404).send('error found: ' + err);
			}

			if(!data){
				console.log('no data');
				res.status(404).send('no data');
			}

			res.json(data);
		});
};

module.exports.get = function(req, res, next){
	console.log('get called from permutas');
	var filter = {
		profesorEmail: req.params.email
	};
	var destinosWithProfesorEmail = [];
	var destinos = req.query.destinos;

	if(typeof filter.profesorEmail === "undefined"){
		filter = {};
	}

	console.log('**********filter: ');
	console.log(filter);
	Permuta.find(filter, function(err, data){
		console.log('findAll called from permuta');
		if(err){
			console.log('error found: ' + err.stack);
			return res.status(404).send('error found: ' + err.stack);
		}

		if(!data){
			console.log('no data');
			return res.status(404).send('no data');
		}

		destinosWithProfesorEmail = data;

		if(destinos){
			destinosWithProfesorEmail = getDestinosWithProfesorEmail(data);
		}

		console.log('data found');
		console.log(data);
		res.json(destinosWithProfesorEmail);
	});
};


module.exports.update = function(req, res, next){
	console.log('update method called on permuta');
	var permuta = {};
	var email = req.body.email;
	var destinos = req.body.destinos;
	var origen = req.body.origen;

	if(typeof destinos !== 'undefined'){
		console.log('destinos is not undefined');
		console.log(destinos);
		if(destinos.length > 0){
			permuta.isPublished = true;
		}else{
			permuta.isPublished = false;
		}
		permuta.destinos = destinos;
		console.log('isPublished: ' + permuta.isPublished);
	}

	if(typeof origen !== 'undefined'){
		permuta.origen = {
			departamento: origen.departamento,
			distrito: origen.distrito
		};	
	}

	permuta.updatedAt = new Date().toString();
	console.log('Permuta to update: ');
	console.log(permuta);

	Permuta.findOneAndUpdate({profesorEmail: email}, permuta, function(err, data){
		console.log('findOneAndUpdate called');
		if(err){
			console.log('err found: ' + err.stack);
			return res.status(404).send('error found: ' + err.stack);
		}

		if(!data){
			console.log('no data found to update in permutas');
			return res.status(404).send('no data found in permutas');
		}

		console.log('data updated: ');
		console.log(data);
		res.json(data);
	});
};