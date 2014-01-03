angular.module('milapiz', ['ngRoute', 'miLapizServices', 'ui.bootstrap'])
	.factory('Data', factoryHandler)
	.config(routeHandler)
	.filter('permutasFilter', function(){
		var filtered = [];

		return function(items, placeFilter){
			filtered.length = 0;
			console.log('%cItems=permutas', "color:white; background:blue");
			console.log(items);
			console.log(placeFilter);
			console.groupEnd();

			angular.forEach(items, function(item){
				if(item.origen.departamento === placeFilter.origen.departamento
											&&
				item.destino.departamento === placeFilter.destino.departamento){
					filtered.push(item);
					item.updatedAt = moment(item.updatedAt).format('h:mm:ss a DD/MM/YYYY');
				}
			});
			return filtered;
		};
	});

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
			// templateUrl: 'partials/verpermutas.html'
			templateUrl: 'partials/authentication.html'
		})
		.when('/micuenta', {
			templateUrl: 'partials/micuenta.html',
			controller: 'MiCuentaCtrl'
		})
		.when('/crearpermuta', {
			templateUrl: 'partials/creacionpermuta.html',
			controller: 'CreacionPermutaCtrl'
		})
		.when('/permutas', {
			templateUrl: 'partials/verpermutas.html',
			controller: 'VerPermutasCtrl'
		})
		.when('/detallepermuta', {
			templateUrl: 'partials/detallepermuta.html',
			controller: 'DetallePermutaCtrl'
		});
}