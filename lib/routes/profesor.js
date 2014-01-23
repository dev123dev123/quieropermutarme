var ProfesorService = require('../profesor');
var Profesor = new ProfesorService();

module.exports.resetPassword = function(req, res, next) {
  console.log(req.body);
  Profesor.resetPassword(req, function(err, profesor) {
    if (err) {
      return next(err);
    } else {
      return res.json(profesor);
    }
  });
};

module.exports.changePassword = function(req, res, next) {
  Profesor.changePassword(req, function(err, profesor){
    if(err) {
      return next(err);
    } 

    return res.json(profesor);
  });
};

module.exports.getProfesorByEmail = function(req, res, next){
  Profesor.getProfesorByEmail(req, function(err, profesor){
    if (err) {
      return next(err);
    }
    return res.json(profesor);
  });
};

module.exports.create = function(req, res, next){
  Profesor.create(req, function(err, profesor){
    if(err) {
      return next(err);
    }
    return res.json(profesor);
  });
};

module.exports.login = function(req, res, next){
  Profesor.login(req, function(err, profesor){
    if (err) {
      return next(err);
    }
    return res.json(profesor);
  });
};

module.exports.update = function(req, res, next){
  Profesor.update(req, function(err, profesor){
    if (err) {
      return next(err);
    }
    return res.json(profesor);
  });
};