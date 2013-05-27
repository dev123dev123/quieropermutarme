var app = app || {Views: {}, Models: {}, Collections: {}};


(function($){
	'use strict';

	app.Views.App = Backbone.View.extend({

		el: '#magisterio-app',
		mainTemplate: HandleBars.compile($('#main-template').html()),
		initialize: function(){
			//init signin and signup views
		},
		render: function(){
			//render signin and signup views
		}
	});
})(jQuery);