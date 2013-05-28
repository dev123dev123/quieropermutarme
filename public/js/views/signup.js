var app = app || {Views: {}, Models: {}, Collections: {}};


app.Views.Signup = Backbone.View.extend({
	template: Handlebars.compile($('#signup-template').html())
	,
	initialize: function(){
		this.render();
	},
	render: function(){
		this.$el.html(template());
		return this;
	},
	events: {
		'click btnSignup': 'addProfesor'
	},
	addProfesor: function(e) {
		alert('adding a profesor');
	}
});

