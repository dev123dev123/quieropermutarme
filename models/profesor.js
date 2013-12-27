var mongoose = require('mongoose');
var crypto = require('crypto');

var profesorSchema = new mongoose.Schema({
  nombres: String,
  apellidos: String,
  email: String,
  celular: String,
  especialidad: String,
  hashedPassword: String,
  salt: String,
  created: Date,
  item: {
    cargo: String,
    turno: String,
    departamento: String,
    distrito: String,
    horasTrabajo: String
  }
});

profesorSchema.methods.encryptPassword = function(password){
  if(!this.salt){
    this.salt = crypto.randomBytes(32).toString('base64');
  }
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

// profesorSchema.virtual('password')
//   .set(function(password){ 
//     this._plainPassword = password;
//     this.salt = crypto.randomBytes(32).toString('base64');   
//   })
//   .get(function(){ 
//     return this._plainPassword; 
//   });


profesorSchema.methods.checkPassword = function(password){
  return this.encryptPassword(password) === this.hashedPassword;
};


module.exports = mongoose.model('Profesor', profesorSchema);
