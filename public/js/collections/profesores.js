app.Collections.Profesores = Backbone.Collection.extend({
	model: app.Model.Profesor,
	url: '/profesores'
});