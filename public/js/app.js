angular.module('milapiz', ['ngRoute', 'miLapizServices'])
	.factory('Data', factoryHandler)
	.config(routeHandler);

function factoryHandler(){
	return {profesor: null};
}

function routeHandler($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'partials/authentication.html'
		})
		.when('/micuenta', {
			templateUrl: 'partials/micuenta.html',
			controller: 'MiCuentaCtrl'
		});
}