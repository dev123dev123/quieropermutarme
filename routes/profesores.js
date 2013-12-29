var Profesor = require('../models/profesor');
var Utils = require('../utils');
var log = console.log;

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

  // console.log('findOne called');
  // var profesor = new Profesor();
  // console.log('password: ' + req.body.password);
  // var hashedPasswordProfesor = profesor.encryptPassword(req.body.password);
  // console.log("hashedPasswordProfesor: " + hashedPasswordProfesor);
  // var emailProfesor = req.body.email;
  
  // Profesor.findOne({email: emailProfesor, hashedPassword: hashedPasswordProfesor}, function(err, profesor){
  //   if(err){
  //     res.json(404, 'something really bad happened in the server dude');
  //     // return next(new Error('something really bad happened in the server dude'));
  //   }

  //   if(!profesor){
  //     res.json(404, "the profesor wasn\'t found'");
  //     // return next(new Error('the profesor wasn\'t found'));
  //   }
  //   res.json(200, profesor);
  // });
};

module.exports.update = function(req, res, next){
  var emailToUpdate = {email: req.body.email};

  Profesor.findOne(emailToUpdate, function(err, profesor){
    profesor.nombres = req.body.nombres;
    profesor.apellidos = req.body.apellidos;
    profesor.celular = req.body.celular;
    profesor.especialidad = req.body.especialidad;
    profesor.item.cargo = req.body.cargo;
    profesor.item.turno = req.body.turno;
    profesor.item.departamento = req.body.departamento;
    profesor.item.distrito = req.body.distrito;
    profesor.item.horasTrabajo = req.body.horasTrabajo;

    profesor.save(function(err, profesor){
      if(err){
        return next(err);
      }
      
      if(!profesor){
        return next(new Error('Profesor not found'));
      }

      res.json(200, profesor);
    });
  });
    
};
