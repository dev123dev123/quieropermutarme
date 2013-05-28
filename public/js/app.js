var app = app || {Views: {}, Models: {}, Collections: {}};

app.Views.App = Backbone.View.extend({

	el: '#magisterio-app',
	initialize: function(){

		//init signin and signup views
		debugger;
		var profesorModel = new app.Models.Profesor();
		var signinView = new app.Views.Signin({model: profesorModel});
		this.$el.html(signinView.render().el);
	},
	render: function(){
		//render signin and signup views
	}
});

$(document).ready(function(){
	new app.Views.App();
});
