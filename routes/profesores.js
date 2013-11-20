var Profesor = require('../models/profesor');

module.exports.create = function(req, res, next){
  var emailProfesor = req.body.email;
  var passwordProfesor = req.body.password;

  var profesor = new Profesor();
  profesor.email = emailProfesor;
  profesor.password = passwordProfesor;
    
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
}
