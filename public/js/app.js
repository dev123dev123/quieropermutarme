angular.module('milapiz', ['ngRoute', 'miLapizServices', 'ui.bootstrap', 'ngCookies'])
	.factory('Data', factoryHandler)
	.config(routeHandler)
	.filter('permutasFilter', function(){
		var filtered = [];

		function isTheSameDepartamento(departamento1, departamento2){
			return departamento1 === departamento2;
		}

		function isTheSameDistrito(distrito1, distrito2){
			return distrito1 === distrito2;
		}

		function areTheSamePlace(item, placeFilter){

			return ( 

					isTheSameDepartamento(item.origen.departamento, 					placeFilter.origen.departamento) 
									&&
					isTheSameDepartamento(item.destino.departamento, 					placeFilter.destino.departamento) 
									&&
					isTheSameDistrito(item.destino.distrito, 
									placeFilter.destino.distrito) 
									&& 
					isTheSameDistrito(item.origen.distrito, 
									placeFilter.origen.distrito) 

				);
		}


		return function(items, placeFilter){
			filtered.length = 0;
			angular.forEach(items, function(item){
				if( areTheSamePlace(item, placeFilter) ){
					filtered.push(item);
					item.updatedAt = moment(item.updatedAt).format('h:mm:ss a DD/MM/YYYY');
				}
			});
			return filtered;
		};
	})
	.directive('ngEnter', function(){
		return function(scope, element, attrs){
			element.bind('keydown keypress', function(event){
				if(event.which === 13){
					scope.$apply(function(){
						scope.$eval(attrs.ngEnter);
					});

					event.preventDefault();
				}
			});
		};
	});

function factoryHandler($rootScope){
	var sharedService = {};

	sharedService.profesor = null;

	sharedService.prepForBroadcast = function(profesor){
		this.profesor = profesor;
		this.broadCastProfesor(profesor);
	};

	sharedService.broadCastProfesor = function(profesor){
		$rootScope.$broadcast('handleBroadcast', profesor);
	};
	return sharedService;
}

function routeHandler($routeProvider){
	$routeProvider
		.when('/', {
			// templateUrl: 'partials/verpermutas.html'
			templateUrl: 'partials/authentication.html',
			controller: 'AuthenticationCtrl'
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