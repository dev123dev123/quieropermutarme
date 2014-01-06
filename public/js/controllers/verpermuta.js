function VerPermutasCtrl($scope, Api, Data, $filter, $location){
	$scope.profesor = Data.profesor;
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

	$scope.$watch('placeFilter.origen.departamento', function(query){
			Data.origenDepartamento = query;
			$scope.departamentoFrom = query;
			filterData(query);
	});

	$scope.$watch('placeFilter.destino.departamento', function(query){
			Data.destinoDepartamento = query;
			$scope.departamentoTo = query;
			filterData(query);
	});

	$scope.$watch('placeFilter.origen.distrito', function(query){
		Data.origenDistrito = query;
		$scope.distritoFrom = query;
		filterData(query);
	});

	$scope.$watch('placeFilter.destino.distrito', function(query){
		Data.destinoDistrito = query;
		$scope.distritoTo = query;
		filterData(query);
	});

	Api.Permuta.getPermutas.query(
			{destinos: true},
			function(data){
				console.debug('success');
				$scope.permutas = data;
				filterData("");
			},
			function(data){
				console.debug('error');
				console.debug(data);
			}
	);

	$scope.departamentos = [
		'Cochabamba',
		'Lapaz',
		'SantaCruz',
		'Tarija',
		'Potosi'
	];

	$scope.distritos = [
		'Sacaba',
		'Quilacollo',
		'Punata',
		'Cliza',
		'Arani'
	];

	function filterData(query){
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
				$location.path('/detallepermuta');

			},
			function(data){
				console.log('success');
				console.log(data);
			}
		);
	};

	$scope.handlerDepartamentoTo = function(filter){
		console.debug('handlerTo');
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
