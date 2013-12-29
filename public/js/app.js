angular.module('milapiz', ['ngRoute', 'miLapizServices']).config(routeHandler);

function routeHandler($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'partials/authentication.html'
		});
}