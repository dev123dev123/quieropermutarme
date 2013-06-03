var app = app || {Views: {}, Models: {}, Collections: {}};

app.Views.Router = Backbone.Router.extend({

	homeTemplate: Handlebars.compile($('#main-template').html()),
	permutasTemplate: Handlebars.compile($('#permutas-template').html()),
	routes: {
		'': 'authenticate',
		'profesores/home': 'viewHome'

	},
	initialize: function(){
	},
	viewHome: function(){
		$('#magisterio-app').html(this.homeTemplate());
		$('#main-content').html(this.permutasTemplate());

	},
	authenticate: function(){
		var profesorModel = new app.Models.Profesor();

		$('#magisterio-app').empty();

		var signinView = new app.Views.Signin({model: profesorModel});
		$('#magisterio-app').append(signinView.render().el);

		var signupView = new app.Views.Signup({model: profesorModel});
		$('#magisterio-app').append(signupView.render().el);
	}

});

$(document).ready(function(){
	router = new app.Views.Router();
	if(!Backbone.History.started){
		Backbone.history.start({pushState: true});
	}
});
