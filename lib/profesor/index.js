var ProfesorModel = require('../models/profesor');
var logger = require('../logs');
var myUtils = require('../utils');

function Profesor(){
}

Profesor.prototype.update = function(req, callback){
  logger.debug('update method called');

  if (
      myUtils.isNullOrEmptyString(req.body.nombres) || myUtils.isNullOrEmptyString(req.body.apellidos) ||
      !myUtils.isNumber(req.body.celular) || myUtils.isNullOrEmptyString(req.body.especialidad) ||
      myUtils.isNullOrEmptyString(req.body.item.cargo) || myUtils.isNullOrEmptyString(req.body.item.turno) ||
      myUtils.isNullOrEmptyString(req.body.item.departamento) || myUtils.isNullOrEmptyString(req.body.item.distrito) ||
      !myUtils.isNumber(req.body.item.horasTrabajo)  || !myUtils.isEmail(req.body.email)
     ) {
    logger.debug('data sent to the request is not valid, sorry');
    var error = new Error('data sent to the request is not valid, sorry');
    error.code = 400;
    callback(error, null);
  }

  var emailToUpdate = {email: req.body.email};
  var profesor = {
    nombres : req.body.nombres,
    apellidos : req.body.apellidos,
    celular : req.body.celular,
    especialidad : req.body.especialidad,
    item: {
      cargo : req.body.item.cargo,
      turno : req.body.item.turno,
      departamento : req.body.item.departamento,
      distrito : req.body.item.distrito,
      horasTrabajo : req.body.item.horasTrabajo
    }
  };

  logger.debug('email sent in the request: ');
  logger.debug(emailToUpdate);
  logger.debug('Profesor sent in the request: ');
  logger.debug(profesor);

  ProfesorModel.findOneAndUpdate(emailToUpdate, profesor, function(err, data){
    logger.debug('findOneAndUpdate was called');
    if(err){
      logger.debug('There was an error in processing the query, sorry.');
      logger.debug('error.stack: ');
      logger.debug(err.stack);
      err.code = 500;
      return callback(err, null);
    }

    if(!data){
      logger.debug('no profesor was found, sorry');
      var error = new Error('no profesor was found');
      error.code = 404;
      return callback(error, null);
    }
    return callback(null, data);
  })
};

Profesor.prototype.login = function(req, callback){
  logger.debug('login method was called');

  var email = req.body.email;
  var password = req.body.password;
  var hashedPassword = "";
  var salt = "";
  logger.debug('parameters: ');
  logger.debug('email: ' + email);
  logger.debug('password: ' + password);

  if (myUtils.isNullOrEmptyString(email) || myUtils.isNullOrEmptyString(password)) {
    var error = new Error('Email and Password was not provided');
    error.code = 400;
    return callback(error, null);
  }

  logger.debug('Calling findOne method');
  ProfesorModel.findOne({email: email}, function(err, profesor){
    if (err) {
      logger.debug('There is an error processing the query');
      logger.debug('err.stack: ');
      logger.debug(err.stack);
      err.code = 500;
      return callback(err, null);
    }

    if (!profesor) {
      logger.debug('error: a profesor was not found, sorry');
      var error = new Error('A profesor was not found');
      error.code = 404;
      return callback(error, null);
    }

    salt = profesor.salt;
    hashedPassword = myUtils.encryptPassword(password, salt);
    logger.debug('hashing password');
    if (hashedPassword !== profesor.hashedPassword) {
      logger.log('password provided is incorrect');
      var error = new Error('password provided is incorrect');
      error.code = 400;
      return callback(error, null);
    }
    return callback(null, profesor);
  });
};

Profesor.prototype.create = function(req, callback){
  logger.debug('create method was called');
  var email = req.body.email;
  var password = req.body.password;
  var nombres = req.body.nombres;
  var apellidos = req.body.apellidos;
  var departamento = req.body.departamento;
  var salt = myUtils.createSalt();

  logger.debug('create method was called');
  logger.debug('the data that was send are the following: ');
  logger.debug('email: ' + email);
  logger.debug('password: ' + password);
  logger.debug('nombres: ' + nombres);
  logger.debug('apellidos: ' + apellidos);
  logger.debug('departamento: ' +  departamento);


  if ( myUtils.isNullOrEmptyString(email) || myUtils.isNullOrEmptyString(password) || 
    myUtils.isNullOrEmptyString(nombres) || myUtils.isNullOrEmptyString(apellidos) ||
    myUtils.isNullOrEmptyString(departamento) ) {
    logger.debug('values sent are empty or null');
    var error = new Error('values are missing for creating a new profesor');
    error.code = 400;
    return callback(error, null);
  }

  var profesor = new ProfesorModel();
  profesor.email = email;
  profesor.hashedPassword = myUtils.encryptPassword(password, salt);
  profesor.nombres = nombres;
  profesor.salt = salt;
  profesor.apellidos = apellidos;
  profesor.item = {
    departamento: departamento
  };

  ProfesorModel.findOne({email: profesor.email}, function(err, data){

      if(err) {
        logger.debug('There was an error trying to find a profesor, sorry.');
        logger.debug('error.stack: ');
        logger.debug(err.stack);
        err.code = 500;
        return callback(err, null);
      }

      if(data){
         logger.debug('The profesor sent already exists.');
         var error = new Error('The profesor sent already exists.');
         error.code = 400;
         return callback(error, null);
      }

      profesor.save(function(err, data){
        logger.debug('Saving the profesor sent...');
        if(err){
          logger.debug('There was an error trying to save the profesor sent, sorry.');
          logger.debug('err.stack: ');
          logger.debug(err.stack);
          err.code = 500;
          return callback(err, null);
        }

        if(!data){
          logger.debug('The profesor sent could not be saved.');
          var error = new Error('The profesor sent could not be saved');
          error.code = 500;
          return callback(error, null);
        }
        return callback(null, data);
      });   
  });
};

Profesor.prototype.getProfesorByEmail = function(req, callback){
  var email = req.params.email;
  var profesor = null;

  logger.debug('getProfesorByEmail method called');
  ProfesorModel.findOne({email: email}, function(err, data){
    logger.debug('findOne method from Profesor was called');
    if(err){
      logger.debug('There is an error inside of findOne method');
      logger.debug(err.stack);
      err.code = 500;
      return callback(err, null);
    }

    if(!data){
      logger.debug('Data was not found inside findOne method');
      logger.debug('Email: ' + email);
      var error = new Error('Data was not found');
      error.code = 404;
      return callback(error, null);
    }

    logger.debug('Profesor found is: ');
    logger.debug(data);
    profesor = myUtils.getImportantPropertiesOfProfesor(data);

    logger.debug('After data was parsed to Profesor: ');
    logger.debug(profesor);
    return callback(null, profesor);
  });
};

module.exports = Profesor;
