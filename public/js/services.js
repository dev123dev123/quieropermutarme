angular.module('miLapizServices', ['ngResource'])
	.factory('Api', function($resource){
		return {
			Profesor: {
				signin: $resource('/api/profesor', {}, {query: {method: 'POST'}}),
				create: $resource('/api/profesores', {}, {query: {method: 'POST'}}),
				getProfesorByEmail: $resource('/api/profesores/:email', {}, {query: {method: 'GET'}}),
				update: $resource('/api/profesores', {}, {query: {method: 'PUT'}})
			},
			Permuta:{
				getPermutaByEmail: $resource('/api/permutas/:email', {}, {query: {method: 'GET', isArray: true}}),
				update: $resource('/api/permutas', {}, {query: {method: 'PUT'}}),
				create: $resource('/api/permutas', {}, {query: {method: 'POST'}})
			}
		}
	});
