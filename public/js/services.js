angular.module('miLapizServices', ['ngResource'])
	.factory('PermutaAPI', function($resource){
		return {
			getPermutasByOrigenAndDestino: $resource('/api/permutas/', {}, {query: {method: 'GET', isArray: true}}),
			getPermutaByProfesorEmail: $resource('/api/profesores/:email/permutas', {}, {query: {method: 'GET', isArray: true}}),
			update: $resource('/api/permutas', {}, {query: {method: 'PUT'}}),
			create: $resource('/api/permutas', {}, {query: {method: 'POST'}})
		};
	})
	.factory('ProfesorAPI', function($resource){
		return {
			updateProfesor: $resource('/api/profesores', {}, {query: {method: 'PUT'}}),
			getProfesorByEmail: $resource('/api/profesores/:email', {}, {query: {method: 'GET'}}),
			signin: $resource('/api/profesores/login', {}, {query: {method: 'POST'}}),
			create: $resource('/api/profesores', {}, {query: {method: 'POST'}}),
		};
	})
	.factory('AccessTokenAPI', function($resource){
		return {
			create: $resource('/auth/token', {}, {query: {method: 'POST'}})
		};
	});
