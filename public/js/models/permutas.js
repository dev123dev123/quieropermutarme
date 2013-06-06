var app = app || {Views: {}, Models: {}, Collections: {}};

app.Models.Permutas = Backbone.Model.extend({
	model: app.Models.Pr
	url: '/profesores'
});