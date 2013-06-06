var app = app || {Views: {}, Models: {}, Collections: {}};

app.Models.Permuta = Backbone.Model.extend({
	url: '/permutas'
});