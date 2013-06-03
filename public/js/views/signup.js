var app = app || {Views: {}, Models: {}, Collections: {}};


app.Views.Signup = Backbone.View.extend({
	template: Handlebars.compile($('#signup-template').html())
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
		'click #btnSignup': 'addProfesor'
	},
	addProfesor: function(e) {
		alert('adding a profesor');
		var fullName = this.$el.find('input[name="fullname"]').val();
		var password =  this.$el.find('input[name="password"]').val();
		var userEmail =  this.$el.find('input[name="email"]').val();
		var cellNumber = this.$el.find('input[name="cellnumber"]').val();
		var landphone = this.$el.find('input[name="landphone"]').val();
		var expertise = this.$el.find('select[name="expertise"]').val();
		var hoursOfWork = this.$el.find('input[name="hoursOfWork"]').val();
		var turno = this.$el.find('select[name="turno"]').val();
		var departamento = this.$el.find('select[name="departament"]').val();
		var distrito = this.$el.find('select[name="distrito"]').val();

		this.model.url = "/profesores/signup";
		this.model.set({
			'fullname': fullName,
			'password': password,
			'email': userEmail,
			'cellnumber': cellNumber,
			'landphone': landphone,
			'expertise': expertise,
			'hoursOfWork': hoursOfWork,
			'turno': turno,
			'departamento': departamento,
			'distrito': distrito
		});

		console.log('trying to save a profe: ' + this.model.toJSON());
		this.model.save({},{
			success: function(model, response){
				debugger;
				console.log(model.attributes);
				router.navigate('profesores/home', true);
				alert('user just signed up.');
			},
			error: function(model, response){
				debugger;
				console.log('error called');
				alert("user wasn't able to sign up");
			}
		});

	}
});

