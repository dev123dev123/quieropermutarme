app.Views.Signin = Backbone.View.extend({
	template: Handlebars.compile($('#signin-template').html()) 
	,
	initialize: function(){
		this.render();
	},
	render: function(){
		this.$el.html(template());
		return this;
	},
	events: {
		'click btnSignin': 'existProfesor'
	},
	existProfesor: function(){
		alert('exist profe');
	}
});