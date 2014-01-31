var PermutaModel = require('../models/permuta');
var ProfesorModel = require('../models/profesor');
var logger = require('../logs');
var myUtils = require('../utils');

function Permuta(){
}

Permuta.prototype.create = function(req, callback){
  logger.debug('create method was called');
  logger.debug('data sent in the request: ');
  logger.debug(req.body);

  var email = req.body.profesorEmail;
  logger.debug('email sent: ' + email);

  if(myUtils.isNullOrEmptyString(email)){
    logger.debug('no email provided');
    var error = new Error('no email provided in the request');
    error.code = 400;
    return callback(error, null);
  }

  logger.debug('creating permuta instance');
  var permuta = new PermutaModel();
  permuta.profesorEmail = email;
  permuta.profesorName = req.body.profesorName;
  permuta.destinos = req.body.destinos;
  permuta.origen = req.body.origen;
  permuta.createdAt = req.body.createdAt;
  permuta.updatedAt = req.body.updatedAt;
  permuta.isPublished = req.body.isPublished;
  logger.debug('permuta created');
  logger.debug(permuta);

  ProfesorModel.findOne({email: email}, function(err, profesorFound){
    logger.debug('findOne profesor method called');

    if (err) {
      logger.debug('an error found while processing the query');
      logger.debug('error.stack: ');
      logger.debug(err.stack);
      err.code = 500;
      return callback(err, null);
    }

    if (!profesorFound) {
      logger.debug('profesor not found, sorry');
      var error = new Error('profesor not found');
      error.code = 404;
      return callback(error, null);
    }
      
    PermutaModel.findOne({profesorEmail: permuta.profesorEmail}, function(err, data){
      logger.debug('findOne permuta was called');

      if (err) {
        logger.debug('there was an error while the query was being processed.');
        logger.debug('error.stack: ');
        logger.debug(err.stack);
        err.code = 500;
        return callback(err, null);
      }   

      if (data) {
        logger.debug('Permuta already exists, sorry.');
        var error = new Error('Permuta already exists');
        error.code = 400;
        return callback(error, null);
      }
      
      permuta.save(function(err, data){
        logger.debug('permuta save method was called');
        if (err) {
          logger.debug('Error was found while the query was processing');
          logger.debug('error.stack: ');
          err.code = 500;
          return callback(err, null);
        }     

        if (!data) { 
          logger.debug('There was an error, data could not be saved, sorry');
          var error = new Error('Data could not be saved');
          error.code = 500;
          return callback(error, null);
        }
        return callback(null, data);
      });
    }); 
  });
};

Permuta.prototype.getPermutaByProfesorEmail = function(req, callback){
  logger.debug('getPermutaByProfesorEmail method was called.');

  if(myUtils.isNullOrEmptyString(req.params.email)){
    logger.debug('Email was not provided in the request, sorry.');
    var error = new Error('Email was not provided in the request');
    error.code = 400;
    return callback(error, null);
  }

  logger.debug('email sent in the request: ');
  logger.debug(req.params.email);

  if (!myUtils.isEmail(req.params.email)) {
    logger.debug('email value is not valid');
    var error = new Error('Email value provided is incorrect');
    error.code = 400;
    return callback(error, null);
  }
  
  var filter = {
    profesorEmail: req.params.email
  };

  PermutaModel.find(filter, function(err, data){
    logger.debug('find method from Permuta model was called');

    if(err){
      logger.debug('There was an error while processing the query, sorry.');
      logger.debug('error.stack: ');
      logger.debug(err.stack);
      err.code = 500;
      return callback(err, null);
    }

    if(myUtils.isEmptyArray(data)){
      logger.debug('There were no permutas found, sorry.');
      var error = new Error('There were no permutas found');
      error.code = 200;
      return callback(null, []);
    }
    return callback(null, data);
  });
};

Permuta.prototype.getPermutasByOrigenAndDestino = function(req, callback){
  logger.debug('getPermutasByOrigenAndDestino method was called');
  var origenDepartamento = req.query.origenDepartamento;
  var origenDistrito = req.query.origenDistrito;
  var destinoDepartamento = req.query.destinoDepartamento;
  var destinoDistrito = req.query.destinoDistrito;

  logger.debug('origenDepartamento: ' + origenDepartamento);
  logger.debug('origenDistrito: ' + origenDistrito);
  logger.debug('destinoDepartamento: ' + destinoDepartamento);
  logger.debug('destinoDistrito: ' + destinoDistrito);

  if (myUtils.isNullOrEmptyString(origenDepartamento) || myUtils.isNullOrEmptyString(origenDistrito) ||
     myUtils.isNullOrEmptyString(destinoDepartamento) || myUtils.isNullOrEmptyString(destinoDistrito)) {
    logger.debug('query data sent to the request are invalid, sorry');
    var error = new Error('Query data sent to the request are invalid');
    error.code = 400;
    return callback(error, null);
  }

  // var matchLugares = {
  //   "destinos.departamento": destinoDepartamento,
  //   "destinos.distrito": destinoDistrito,
  //   "origen.departamento": origenDepartamento,
  //   "origen.distrito": origenDistrito
  // };

  var matchLugaresOrigen = {
    "destinos.departamento": destinoDepartamento,
    "destinos.distrito": destinoDistrito,
    "origen.departamento": origenDepartamento,
    "origen.distrito": origenDistrito
  };

  var matchLugaresDestiny = {
    "destinos.departamento": destinoDepartamento,
    "destinos.distrito": origenDistrito,
    "origen.departamento": origenDepartamento,
    "origen.distrito": destinoDistrito
  }

  PermutaModel
  .aggregate(
    {$match: {$or: [matchLugaresOrigen, matchLugaresDestiny] }}, 
    {$unwind: "$destinos"},
    {$match: {$or: [matchLugaresOrigen, matchLugaresDestiny] }},
    {$sort: {updatedAt: -1}},
    {$project: 
      {
        _id: 0,
        origen: {departamento: 1, distrito: 1},
        destino: {departamento: "$destinos.departamento", distrito: "$destinos.distrito"}, 
        updatedAt:1, 
        profesorEmail:1,
        profesorName: 1
      }
    },
    function(err, data){
      logger.debug('aggregate method called from Permuta');
      if (err) {
        logger.debug('There was an error while processing the query, sorry.');
        err.code = 500;
        logger.debug('error.stack: ');
        logger.debug(err.stack);
        return callback(err, null);
      }

      if(!data){
        logger.debug('No permutas found, sorry');
        var error = new Error('No permutas found');
        error.code = 200;
        return callback(null, []);
      }
      logger.debug('Permutas result: ');
      logger.debug(data);
      return callback(null, data);
    });
};

Permuta.prototype.update = function(req, callback){
  logger.debug('updated method was called');
  var permuta = {};
  var email = req.body.email;
  var destinos = req.body.destinos;
  var origen = req.body.origen;

  logger.debug('data that were send to the request');
  logger.debug('email: ');
  logger.debug(email);
  logger.debug('destinos: ');
  logger.debug(destinos);
  logger.debug('origen: ');
  logger.debug(origen);

  if(myUtils.isNullOrEmptyString(email)){
    var error = new Error('Email was not provided');
    error.code = 400;
    return callback(error, null);
  }

  if(typeof destinos !== 'undefined'){
    if(destinos.length > 0){
      permuta.isPublished = true;
    }else{
      permuta.isPublished = false;
    }
    permuta.destinos = destinos;
  }

  if(typeof origen !== 'undefined'){
    permuta.origen = {
      departamento: origen.departamento,
      distrito: origen.distrito
    };  
  }

  permuta.updatedAt = new Date().toString();

  PermutaModel.findOneAndUpdate({profesorEmail: email}, permuta, function(err, data){
    logger.debug('findOneAndUpdate method was called');
    if(err){
      logger.debug('there was an error while processing the query, sorry');
      logger.debug('error.stack: ');
      logger.debug(err.stack);
      err.code = 500;
      return callback(err, null);
    }

    if(!data){
      logger.debug('no data was found to update in permutas, sorry');
      var error = new Error('no permuta was found');
      error.code = 404;
      return callback(error, null);
    }
    return callback(null, data);
  });
};

module.exports = Permuta;