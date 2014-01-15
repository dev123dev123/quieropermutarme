var PermutaService = require('../permuta');
var Permuta = new PermutaService();

module.exports.create = function(req, res, next){
  Permuta.create(req, function(err, permuta){
    if (err) {
      return next(err);
    }
    return res.json(permuta);
  });
};

module.exports.getPermutaByProfesorEmail = function(req, res, next){
  Permuta.getPermutaByProfesorEmail(req, function(err, permuta){
    if (err) {
      return next(err);
    }
    return res.json(permuta);
  });
};

module.exports.getPermutasByOrigenAndDestino = function(req, res, next){
  Permuta.getPermutasByOrigenAndDestino(req, function(err, permutas){
    if (err) {
      return next(err);
    }
    return res.json(permutas);
  });
};

module.exports.update = function(req, res, next){
  Permuta.update(req, function(err, permuta){
    if (err) {
      return next(err);
    }
    return res.json(permuta);
  });
};