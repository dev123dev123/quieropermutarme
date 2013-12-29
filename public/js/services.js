angular.module('miLapizServices', ['ngResource'])
	.factory('Api', function($resource){
		// return $resource('/api/profesores', {}, {create: {method: 'POST'}});
		// return { 
		// 	get: $resource('/api/profesor', {}, {get: {method: 'POST'}}),
		// 	create: $resource('/api/profesores', {}, {create: {method: 'POST'}})
		// }

		return {
			Profesor: {
				get: $resource('/api/profesor', {}, {query: {method: 'POST'}}),
				create: $resource('/api/profesores', {}, {query: {method: 'POST'}})	
			}
		}
	});
