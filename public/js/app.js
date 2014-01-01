angular.module('milapiz', ['ngRoute', 'miLapizServices'])
	.factory('Data', factoryHandler)
	.config(routeHandler);

function factoryHandler($rootScope){
	var sharedService = {};

	sharedService.profesor = null;

	sharedService.prepForBroadcast = function(profesor){
		this.profesor = profesor;
		this.broadCastProfesor();
	};

	sharedService.broadCastProfesor = function(){
		$rootScope.$broadcast('handleBroadcast');
	};
	return sharedService;
}

function routeHandler($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'partials/authentication.html'
		})
		.when('/micuenta', {
			templateUrl: 'partials/micuenta.html',
			controller: 'MiCuentaCtrl'
		})
		.when('/crearpermuta', {
			templateUrl: 'partials/creacionpermuta.html',
			controller: 'CreacionPermutaCtrl'
		});
}