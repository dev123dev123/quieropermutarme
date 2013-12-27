var Profesor = require('../models/profesor');

module.exports.create = function(req, res, next){
  var emailProfesor = req.body.email;
  var passwordProfesor = req.body.password;

  var profesor = new Profesor();
  profesor.email = emailProfesor;
  // profesor.password = passwordProfesor;
  profesor.hashedPassword = profesor.encryptPassword(passwordProfesor);
    
  profesor.save(function(err, profesor){
    if(err){ 
      return next(err);
    }
    res.json(200, profesor);
  });
};

module.exports.findOne = function(req, res, next){
  var emailProfesor = req.params.email;
  
  Profesor.findOne({email: emailProfesor}, function(err, profesor){
    if(err){
      return next(new Error('something really bad happened in the server dude'));
    }

    if(!profesor){
      return next(new Error('the profesor wasn\'t found'));
    }
    res.json(200, profesor);
  });
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
