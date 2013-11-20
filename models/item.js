var mongoose = require('mongoose');
var itemSchema = mongoose.Schema({
  cargo: String,
  turno: String,
  departamento: String,
  distrito: String,
  horasTrabajo: Number
});

exports = mongoose.model('Item', itemSchema);
