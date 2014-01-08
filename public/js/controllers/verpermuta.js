function VerPermutasCtrl($scope, Api, Data, $filter, $location, $cookieStore){
	$scope.profesor = $cookieStore.get('profesor');
	Data.prepForBroadcast($scope.profesor);

	if(typeof $cookieStore.get('Data') !== 'undefined'){
		Data = $cookieStore.get('Data');	
	}

	$scope.profesor = 
	$scope.currentPage = 1;
	$scope.maxSize = 10;
	$scope.itemsPerPage = 5;
	$scope.previousButtonText = "Anterior";
	$scope.nextButtonText = "Siguiente";
	$scope.placeFilter = {
		origen: {
			departamento: Data.origenDepartamento,
			distrito: Data.origenDistrito
		},
		destino: {
			departamento: Data.destinoDepartamento,
			distrito: Data.destinoDistrito
		}
	};

	function getPermutas(query){
		Api.Permuta.getPermutasByOrigenAndDestino.query(
				{
					origenDepartamento: $scope.placeFilter.origen.departamento,
					origenDistrito: $scope.placeFilter.origen.distrito,
					destinoDepartamento: $scope.placeFilter.destino.departamento,
					destinoDistrito: $scope.placeFilter.destino.distrito
				},
				function(data){
					console.debug('success from getPermutasByOrigenAndDestino');
					console.log(data);
					$scope.permutas = data;
					filterData(query);
				},
				function(data){
					console.debug('error');
					console.debug(data);
				}
		);
	}


	$scope.$watch('placeFilter.origen.departamento', function(query){
			console.log('placeFilter.origen.departamento: ' + query);
			Data.origenDepartamento = query;
			$cookieStore.put('Data', Data);
			$scope.departamentoFrom = query;
			getPermutas(query);
			// filterData(query);
	});

	$scope.$watch('placeFilter.destino.departamento', function(query){
		console.log('placeFilter.destino.departamento: ' + query);
			Data.destinoDepartamento = query;
			$cookieStore.put('Data', Data);
			$scope.departamentoTo = query;
			getPermutas(query);
	});

	$scope.$watch('placeFilter.origen.distrito', function(query){
		console.log('placeFilter.origen.distrito: ' + query);
		Data.origenDistrito = query;
		$cookieStore.put('Data', Data);
		$scope.distritoFrom = query;
		getPermutas(query);
	});

	$scope.$watch('placeFilter.destino.distrito', function(query){
		console.log('placeFilter.destino.distrito: ' + query);
		Data.destinoDistrito = query;
		$cookieStore.put('Data', Data);
		$scope.distritoTo = query;
		getPermutas(query);
	});

	$scope.departamentos = [
		'Cochabamba',
		'Lapaz',
		'SantaCruz',
		'Tarija',
		'Potosi'
	];

	$scope.distritos = [
		'Sacaba',
		'Quillacollo',
		'Punata',
		'Cliza',
		'Arani'
	];

	function filterData(query){
		console.log('permutas gotten before filtering.');
		console.log($scope.permutas);
		$scope.filteredData = $filter('permutasFilter')($scope.permutas, $scope.placeFilter);
		if($scope.filteredData.length > 0) {
			$scope.totalItems = $scope.filteredData.length;
			$scope.permutasByPage = breakPages($scope.filteredData, $scope.itemsPerPage);
			$scope.filteredData = $scope.permutasByPage[0];	
		}else{
			$scope.totalItems = 0;
		}
	}

	$scope.handlerPermutaDetalles = function(permuta){
		Api.Profesor.getProfesorByEmail.query(
			{email: permuta.profesorEmail},
			function(data){
				console.log('success');
				console.log(data);
				Data.datosDetallePermuta = {
					profesor: data,
					permuta: permuta
				};
				$cookieStore.put('Data', Data);
				$location.path('/detallepermuta');

			},
			function(data){
				console.log('success');
				console.log(data);
			}
		);
	};

	$scope.handlerDepartamentoTo = function(filter){
		$scope.departamentoTo = filter;
		$scope.placeFilter.destino.departamento = $scope.departamentoTo;
	};

	$scope.handlerDepartamentoFrom = function(filter){
		$scope.departamentoFrom = filter;
		$scope.placeFilter.origen.departamento = $scope.departamentoFrom;
	};

	$scope.handlerDistritoFrom = function(filter){
		$scope.distritoFrom = filter;
		$scope.placeFilter.origen.distrito = $scope.distritoFrom;
	};

	$scope.handlerDistritoTo = function(filter){
		$scope.distritoTo = filter;
		$scope.placeFilter.destino.distrito = $scope.distritoTo;
	};

	function breakPages(A, numberPerPage){
		var result = [];
		for (var i = 0; i < A.length; i=i+numberPerPage) {
			result.push(A.slice(i, numberPerPage+i));
		};
		return result;
	}

	$scope.setPage = function(pageNo){
		$scope.currentPage = pageNo;
		$scope.filteredData = $scope.permutasByPage[pageNo-1];
	};
}
