var mongoose = require('mongoose');

var destinoSchema = new mongoose.Schema({
	departamento: String,
	distrito: String
});

var permutaSchema = new mongoose.Schema({
	profesorEmail: String,
	createdAt: Date,
	updatedAt: Date,
	destinos: [destinoSchema],
	informacionAdicional: String,
	isPublished: Boolean
});

module.exports = mongoose.model('Permuta', permutaSchema);