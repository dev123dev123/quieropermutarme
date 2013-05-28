var app = app || {Views: {}, Models: {}, Collections: {}};

app.Collections.Profesores = Backbone.Collection.extend({
	model: app.Model.Profesor,
	url: '/profesores'
});

