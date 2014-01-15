var mongoose = require('../db');
var myUtils = require('../utils');
var ProfesorSchema;

ProfesorSchema = new mongoose.Schema({
  nombres: String,
  apellidos: String,
  email: String,
  celular: Number,
  especialidad: String,
  hashedPassword: String,
  salt: String,
  created: Date,
  item: {
    cargo: String,
    turno: String,
    departamento: String,
    distrito: String,
    horasTrabajo: Number
  }
}, {collection: 'Profesores'}, {_id: false});

ProfesorSchema.methods.encryptPassword = function(password){
  if(!this.salt){
    this.salt = myUtils.createSalt();
  }
  return myUtils.encryptPassword(password, this.salt);
};

ProfesorSchema.methods.checkPassword = function(password){
  return this.encryptPassword(password) === this.hashedPassword;
};

module.exports = mongoose.model('Profesor', ProfesorSchema);