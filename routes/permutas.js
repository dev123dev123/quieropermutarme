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

	Profesor.findOne({email: req.body.profesorEmail}, function(err, data){
		console.log('profesor findOne called');
		if(!data){
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
				profesorEmail: data[i].profesorEmail
			};
			result.push(item);
		};
	};

	return result;
}

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
	// var permuta = {
	// 	updatedAt : req.updatedAt,
	// 	destinos : req.destinos,
	// 	informacionAdicional : req.informacionAdicional
	// };
	// var profesorEmail = req.email;
	// console.log('permuta to update: ');
	// console.log(permuta);

	var email = req.body.email;
	var destinos = req.body.destinos;
	var informacionAdicional = req.body.informacionAdicional;

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

	}else if(typeof informacionAdicional !== 'undefined'){
		console.log('informacionAdicional is not undefined');
		permuta.informacionAdicional = informacionAdicional;
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