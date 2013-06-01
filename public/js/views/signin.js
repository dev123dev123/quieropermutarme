var app = app || {Views: {}, Models: {}, Collections: {}};


app.Views.Signin = Backbone.View.extend({
	template: Handlebars.compile($('#signin-template').html()) 
	,
	initialize: function(){
		this.render();
	},
	render: function(){
		this.$el.html(this.template());
		this.delegateEvents();
		return this;
	},
	events: {
		'click #btnSignin': 'existProfesor'
	},
	existProfesor: function(e){
		var userEmail = this.$el.find('input[name="userEmail"]').val();
		var password = this.$el.find('input[name="password"]').val();
		this.model.url = "/profesores/signin";
		this.model.set({email: userEmail});
		this.model.set({password: password});
		this.model.save({},
			{
				success: function(model, response){
					console.log(model.attributes);
					console.log('succes called');
					router.navigate('profesores/home', true);
					alert('Exists!');
				},
				error: function(model, response){
					console.log('error called');
					alert('Please enter correct credentials!!');
				}
			}
		);
	}
});



