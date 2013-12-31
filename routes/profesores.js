var Profesor = require('../models/profesor');
var Utils = require('../utils');
var log = console.log;

module.exports.getProfesorByEmail = function(req, res, next){
  var email = req.params.email;
  var profesor = null;

  log('email: ' + email);

  Profesor.findOne({email: email}, function(err, data){
    console.log('findOne called');
    if(err){
      console.log('error findOne');
      return res.status(404).send('error ' + err.message);
    }

    if(!data){
      console.log('error data not found findOne');
      return res.status(404).send('no data found');
    }


    profesor = Utils.getImportantPropertiesOfProfesor(data);

    console.log('profesor with utils: ' + profesor);
    res.json(profesor);
  });
};

module.exports.create = function(req, res, next){
  var email = req.body.email;
  var password = req.body.password;
  var nombres = req.body.nombres;
  var apellidos = req.body.apellidos;
  var salt = Utils.createSalt();

  log('email: ' + email);
  log('password: ' + password);
  log('nombres: ' + nombres);
  log('apellidos: ' + apellidos);

  var profesor = new Profesor();
  profesor.email = email;
  log('hashing the passsword');
  profesor.hashedPassword = Utils.encryptPassword(password, salt);
  log('hashed password: ' + profesor.hashedPassword);
  profesor.nombres = nombres;
  profesor.salt = salt;
  profesor.apellidos = apellidos;

  Profesor.findOne({email: profesor.email}, function(err, data){
      if(data){
         log('profesor exists error');
         return res.status(404).send('profesor exists error');
      }
      profesor.save(function(err, data){
        log('saving profesor...');
        if(err){
          log('error');
          return res.status(404).send('some error');
        }

        if(!data){
          log('error data');
          return res.status(404).send('no profesor created');
        }

        log('data success: ' + data);
        res.json(data);
      });   
  });
};

module.exports.exists = function(req, res, next){
  console.log('email: ' + req.body.email);
  console.log('password: ' + req.body.password);

  var email = req.body.email;
  var password = req.body.password;
  var hashedPassword = "";
  var salt = "";

  Profesor.findOne({email: email}, function(err, profesor){
    if(err){
      log('email error');
      return res.status(404).send('some error');
    }

    if(!profesor){
      log('email profesor error');
      return res.status(404).send('email provided no correct');
    }

    salt = profesor.salt;
    hashedPassword = Utils.encryptPassword(password, salt);
    log('salt: ' + salt);
    log('hashedpassword: ' + hashedPassword);
    log('profesor.hashedPassword: ' + profesor.hashedPassword)

    if(hashedPassword === profesor.hashedPassword){
      res.json(profesor);
    }else{
      log('hashedpassword profesor error');
      return res.status(404).send('password provided no correct');
    }
  });
};

module.exports.update = function(req, res, next){
  console.log('update method');
  var emailToUpdate = {email: req.body.email};
  var profesor = {
    nombres : req.body.nombres,
    apellidos : req.body.apellidos,
    celular : req.body.celular,
    especialidad : req.body.especialidad,
    item: {
      cargo : req.body.cargo,
      turno : req.body.turno,
      departamento : req.body.departamento,
      distrito : req.body.distrito,
      horasTrabajo : req.body.horasTrabajo
    }
  };


  console.log('emailToUpdate: ');
  console.log(emailToUpdate);
  console.log('Profesor: ');
  console.log(profesor);

  Profesor.findOneAndUpdate(emailToUpdate, profesor, function(err, data){
    console.log('findOneAndUpdate callback');
    if(err){
      console.log('error findOneAndUpdate');
      return res.status(404).send('error');
    }

    if(!data){
      console.log('no data findOneAndUpdate');
      return res.status(404).send('Profesor not found');
    }

    console.log(data);
    res.json(200, data);
  })
};
