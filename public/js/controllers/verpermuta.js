function VerPermutasCtrl($scope, Api, Data, $filter, $location){
	$scope.profesor = Data.profesor;
	$scope.currentPage = 1;
	$scope.maxSize = 10;
	$scope.itemsPerPage = 5;
	$scope.previousButtonText = "Anterior";
	$scope.nextButtonText = "Siguiente";
	$scope.placeFilter = {
		origen: {
			departamento: Data.origenDepartamento
		},
		destino: {
			departamento: Data.destinoDepartamento
		}
	};

	$scope.$watch('placeFilter.origen.departamento', function(query){
			Data.origenDepartamento = query;
			filterData(query);
	});

	$scope.$watch('placeFilter.destino.departamento', function(query){
			Data.destinoDepartamento = query;
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

	function filterData(query){
		console.debug('filterData called');
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

	$scope.handlerTo = function(filter){
		$scope.to = filter;
		$scope.placeFilter.destino.departamento = $scope.to;
	};

	$scope.handlerFrom = function(filter){
		$scope.from = filter;
		$scope.placeFilter.origen.departamento = $scope.from;
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
