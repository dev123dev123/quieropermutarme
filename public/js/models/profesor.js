var app = app || {Views: {}, Models: {}, Collections: {}};


app.Models.Profesor = Backbone.Model.extend({
	urlRoot: '/profesores'
});


