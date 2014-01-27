var mongoose = require('../db');
var PermutaSchema;

var DestinoSchema = new mongoose.Schema({
  departamento: String,
  distrito: String
});

PermutaSchema = new mongoose.Schema({
  profesorEmail: String,
  profesorName: String,
  createdAt: Date,
  updatedAt: Date,
  destinos: [DestinoSchema],
  origen: [DestinoSchema],
  isPublished: Boolean
}, {collection: 'Permutas'}, {_id: false});

module.exports = mongoose.model('Permuta', PermutaSchema);

