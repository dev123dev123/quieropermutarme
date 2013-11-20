var mongoose = require('mongoose');
var profesorSchema = new mongoose.Schema({
  nombres: String,
  apellidos: String,
  email: String,
  celular: String,
  especialidad: String,
  password: String
});


module.exports = mongoose.model('Profesor', profesorSchema);
