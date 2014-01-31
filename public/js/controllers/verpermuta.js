function VerPermutasCtrl($scope, $http, Data, $filter, $location, PermutaAPI, ProfesorAPI, $timeout, $cookieStore, Departamentos){
	$scope.profesor = $cookieStore.get('profesor');

	Data.prepForBroadcast($scope.profesor);
	Data.currentPage = 0;
	Data.changeActiveListItem('verPermutas');

	if(typeof $cookieStore.get('Data') !== 'undefined'){
		Data = $cookieStore.get('Data');	
	}

	// $scope.departamentos = Departamentos;
	// $scope.distritos = $scope.departamentos[0].distritos;
	$scope.distritosFrom = loadDistritos([Data.origenDistrito, Data.destinoDistrito]);
	$scope.distritosTo = loadDistritos([Data.origenDistrito, Data.destinoDistrito]);
	$scope.currentPage = 1;
	$scope.maxSize = 10;
	$scope.itemsPerPage = 5;
	$scope.previousButtonText = "Anterior";
	$scope.nextButtonText = "Siguiente";
	$scope.placeFilter = {
		origen: {
			departamento: "Cochabamba",
			distrito: Data.origenDistrito
		},
		destino: {
			departamento: "Cochabamba",
			distrito: Data.destinoDistrito
		}
	};

	function isUndefined(value) {
		return typeof value === 'undefined';
	}

	function isNull(value) {
		return value === null;
	}

	function getIndexDistritoFrom(distritos, distrito) {
		var index = -1;
		distritos.map(function(value, itemIndex) {
			if (value.nombre ===  distrito) {
				index = itemIndex;
			}
		});
		return index;
	}

	function removeDistritoFrom(distritos, distrito) {
		var index = getIndexDistritoFrom(distritos, distrito);
		if(index > -1) {
			distritos.splice(index, 1);
		}
	}

	function loadDistritos(currentDistritos) {
		$scope.departamentos = Departamentos;
		var distritos = $scope.departamentos[0].distritos.slice();

		currentDistritos.map(function(value, index){
			if(!isUndefined(value)) {
				removeDistritoFrom(distritos, value);
			}
		});
		return distritos;
	}

	function refreshDistritoValues() {
		$scope.distritosFrom = loadDistritos([$scope.distritoFrom, $scope.distritoTo]);
		$scope.distritosTo = loadDistritos([$scope.distritoTo, $scope.distritoFrom]);
	}

	function isEmptyOrNullString(value){
		return !value;
	}

	function getPermutas(query){
		if (!isEmptyOrNullString($scope.placeFilter.origen.distrito) 
			&& !isEmptyOrNullString($scope.placeFilter.destino.distrito)) {
			PermutaAPI.getPermutasByOrigenAndDestino.query(
				{
					origenDepartamento: "Cochabamba",
					// origenDepartamento: $scope.placeFilter.origen.departamento,
					origenDistrito: $scope.placeFilter.origen.distrito,
					destinoDepartamento: "Cochabamba",
					// destinoDepartamento: $scope.placeFilter.destino.departamento,
					destinoDistrito: $scope.placeFilter.destino.distrito
				},
				//success
				function(data){
					$scope.permutas = data;
					filterData(query);
					if(Data.currentPage > 1) {
						$scope.setPage(Data.currentPage);						
					}
				},
				//error
				function(response){
					logout();
				}
			);
		}
	}

	function logout() {
		this.profesor = null;
		this.origenDepartamento = null;
		this.destinoDepartamento = null;
		this.origenDistrito = null;
		this.destinoDistrito = null;
		Data.prepForBroadcast(null);
		$('#errorModal').modal('show');
		$timeout(function(){
			$('#errorModal').modal('hide');
				//Data.logout();
				Data.prepForBroadcast(null);
				$scope.profesor = null;
				$location.path('/');
				$cookieStore.remove('profesor');
				$cookieStore.remove('Data');
		}, 3000);
	}

	$scope.$watch('placeFilter.origen.departamento', function(query){
			Data.origenDepartamento = query;
			$cookieStore.put('Data', Data);
			$scope.departamentoFrom = query;
			getPermutas(query);
	});

	$scope.$watch('placeFilter.destino.departamento', function(query){
			Data.destinoDepartamento = query;
			$cookieStore.put('Data', Data);
			$scope.departamentoTo = query;
			getPermutas(query);
	});

	$scope.$watch('placeFilter.origen.distrito', function(query){
		Data.origenDistrito = query;
		$cookieStore.put('Data', Data);
		$scope.distritoFrom = query;
		getPermutas(query);
	});

	$scope.$watch('placeFilter.destino.distrito', function(query){
		Data.destinoDistrito = query;
		$cookieStore.put('Data', Data);
		$scope.distritoTo = query;
		getPermutas(query);
	});

	function filterData(query){
		// $scope.filteredData = $filter('permutasFilter')($scope.permutas, $scope.placeFilter);
		$scope.filteredData = $scope.permutas;
		if($scope.filteredData.length > 0) {
			$scope.totalItems = $scope.filteredData.length;
			$scope.permutasByPage = breakPages($scope.filteredData, $scope.itemsPerPage);
			$scope.filteredData = $scope.permutasByPage[0];	
		}else{
			$scope.totalItems = 0;
		}
	}

	$scope.handlerPermutaDetalles = function(permuta){
		ProfesorAPI.getProfesorByEmail.query(
			{email: permuta.profesorEmail},
			//sucess
			function(data){
				Data.datosDetallePermuta = {
					profesor: data,
					permuta: permuta
				};
				$cookieStore.put('Data', Data);
				$location.path('/detallepermuta');

			},
			//error
			function(data){
				logout();
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
		refreshDistritoValues();
	};

	$scope.handlerDistritoTo = function(filter){
		$scope.distritoTo = filter;
		$scope.placeFilter.destino.distrito = $scope.distritoTo;
		refreshDistritoValues();
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
		Data.currentPage = pageNo;
		$scope.filteredData = $scope.permutasByPage[pageNo-1];
	};

	$scope.moment = moment;
}

