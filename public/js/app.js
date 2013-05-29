var app = app || {Views: {}, Models: {}, Collections: {}};

app.Views.App = Backbone.View.extend({

	initialize: function(){

		//init signin and signup views
		var profesorModel = new app.Models.Profesor();

		var signinView = new app.Views.Signin({model: profesorModel});
		$('#magisterio-app').append(signinView.render().el);

		var signupView = new app.Views.Signup({model: profesorModel});
		$('#magisterio-app').append(signupView.render().el);
	}
});

$(document).ready(function(){
	new app.Views.App();
});
