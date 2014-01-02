function AuthenticationCtrl($scope, Api, Data, $location){

	$scope.handlerRegistrar = function(){
		console.log('handlerRegistrar');
		Api.Profesor.create.query(
			//data sent
			$scope.newProfesor,
			//success
			function(data){
				console.log('success');
				console.log(data);
				Data.profesor = data;
				Data.prepForBroadcast(data);
				Api.Permuta.create.query({profesorEmail: Data.profesor.email});
				$location.path('/micuenta');
			},
			//error
			function(data){
				console.log('error');
				console.log(data);
			}
		);
	};

	$scope.handlerConectar = function(){
		console.log('$scope.profesor: ');
		console.log($scope.profesor);
		Api.Profesor.signin.query(
			//data sent
			$scope.profesor,
			//success
			function(data){
				console.log('success');
				console.log(data);
				Data.profesor = data;
				console.log(Data);
				Data.prepForBroadcast(data);
				$location.path('/micuenta');
			}, 
			//error
			function(data){
				console.log('error');
				console.log(data);
			});
	};
}

function DetallePermutaCtrl($scope, Data){
	$scope.profesor = Data.datosDetallePermuta.profesor;
	$scope.permuta = Data.datosDetallePermuta.permuta;
}


function VerPermutasCtrl($scope, Api, Data, $filter, $location){
	$scope.profesor = Data.profesor;
	$scope.currentPage = 1;
	$scope.maxSize = 10;
	$scope.itemsPerPage = 1;
	$scope.previousButtonText = "Anterior";
	$scope.nextButtonText = "Siguiente";
	$scope.filteredData = [];

	$scope.from = 'Cualquier lado';
	$scope.to = 'Cualquier lado';

	$scope.departamentos = [
		'Cochabamba',
		'Lapaz',
		'SantaCruz',
		'Tarija',
		'Potosi'
	];

	$scope.placeFilter = {
		origen: {
			departamento: ''
		},
		destino: {
			departamento: ''
		}
	};

	function filterData(query){
		//$scope.filteredData.length = 0;
		console.group('Watch');
		console.log('query:');
		console.log(query);
		console.log('permutas');
		console.log($scope.permutas);
		$scope.filteredData = $filter('permutasFilter')($scope.permutas, $scope.placeFilter);
		console.log('placeFilter');
		console.log($scope.placeFilter);
		console.log('filteredData');
		console.log($scope.filteredData);
		console.groupEnd();

		if($scope.filteredData.length > 0) {
			$scope.totalItems = $scope.filteredData.length;
			$scope.permutasByPage = breakPages($scope.filteredData, $scope.itemsPerPage);
			$scope.filteredData = $scope.permutasByPage[0];	
		}else{
			$scope.totalItems = 0;
		}
	}

	$scope.$watch('placeFilter.origen.departamento', function(query){
			filterData(query);
	});

	$scope.$watch('placeFilter.destino.departamento', function(query){
			filterData(query);
	});

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
		console.log('filter: ' + filter);
		$scope.to = filter;
		console.log($scope.to);
		$scope.placeFilter.destino.departamento = $scope.to;
		console.log('$scope.placeFilter: ' + $scope.placeFilter.destino.departamento);
	};

	$scope.handlerFrom = function(filter){
		console.log('filter: ' + filter);
		$scope.from = filter;
		console.log($scope.from);
		$scope.placeFilter.origen.departamento = $scope.from;
		console.log('$scope.placeFilter: ' + $scope.placeFilter.origen.departamento);
	};

	Api.Permuta.getPermutas.query(
		{destinos: true},
		function(data){
			console.log('success');
			console.log(data);
			$scope.permutas = data;
			console.log($scope.permutas);
		},
		function(data){
			console.log('error');
			console.log(data);
		}
	);

	function breakPages(A, numberPerPage){
		var result = [];
		for (var i = 0; i < A.length; i=i+numberPerPage) {
			console.log(numberPerPage+i);
			result.push(A.slice(i, numberPerPage+i));
		};
		return result;
	}

	$scope.setPage = function(pageNo){
		console.log('setPage called: ' + pageNo);
		$scope.currentPage = pageNo;
		$scope.filteredData = $scope.permutasByPage[pageNo-1];
	};
}

function NavigationCtrl($scope, Data, $location){

	console.log('profesor from NavigationCtrl');
	$scope.$on('handleBroadcast', function(){
		console.log('handleBroadcast!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		$scope.profesor = Data.profesor;
	});

	$scope.handlerSalir = function(){
		Data.profesor = null;
		console.log(Data);
		$scope.profesor = Data.profesor;
		Data.prepForBroadcast(data);
		$location.path('/');
	};

	$scope.handlerHome = function(){
		if($scope.profesor){
			$location.path('/permutas');		
		}else{
			$location.path('/');
		}
	};
}

function CreacionPermutaCtrl($scope, Api, Data){
	$scope.profesor = Data.profesor;
	$scope.profesor.fullname = $scope.profesor.nombres + ' ' + $scope.profesor.apellidos;
	Api.Permuta.getPermutas.query(
		{email: Data.profesor.email},
		function(data){
			Data.permuta = data[0];
			$scope.permuta = data[0];
			console.log('$scope.permuta.destinos: ');
			console.log($scope.permuta.destinos);
			console.log('success');
			console.log(data[0]);
		},
		function(data){
			console.log('error');
			console.log(data);
		}
	);

	$scope.handlerAgregarDestino = function(destino){
		console.log('Destino Agregar');
		console.log('departamentoDestino: ' + $scope.departamentoDestino);
		console.log('distritoDestino: ' + $scope.distritoDestino);

		$scope.permuta.destinos.push({
			departamento: $scope.departamentoDestino,
			distrito: $scope.distritoDestino
		});

		console.log('$scope.permuta.destinos.length: ' + $scope.permuta.destinos.length);

		Api.Permuta.update.query(
			{
				email: Data.profesor.email, 
				destinos: $scope.permuta.destinos,
				origen: {
					departamento: $scope.profesor.item.departamento,
					distrito: $scope.profesor.item.distrito
				}
			}, 
			function(data){
				console.log('success');
				console.log(data);
			},
			function(data){
				console.log('success');
				console.log(data);
			}
		);

	};

	$scope.handlerEliminarDestino = function(destino){
		console.log('Destino Eliminar');
		var indexDestino = $scope.permuta.destinos.indexOf(destino);
		if(indexDestino > -1){
			$scope.permuta.destinos.splice(indexDestino, 1);
			Api.Permuta.update.query({email: Data.profesor.email, destinos: $scope.permuta.destinos}, 
				function(data){
					console.log('success');
					console.log(data);
				},
				function(data){
					console.log('error');
					console.log(data);
				}
			);
		}
	};

	$scope.handlerLostFocus = function(){
		Api.Permuta.update.query({email: Data.profesor.email, informacionAdicional: $scope.permuta.informacionAdicional}, 
			function(data){
				console.log('success');
				console.log(data);
			},
			function(data){
				console.log('error');
				console.log(data);
			}
		);
	};
}

function MiCuentaCtrl($scope, Api, Data){
	console.log(Api);
	console.log('MiCuentaCtrl called');
	console.log(Data.profesor.email);
	Api.Profesor.getProfesorByEmail.query(
		{email: Data.profesor.email},
		function(data){
			$scope.profesor = data;
			Data.profesor = data;
			console.log('Data.profesor.email: ');
			console.log(Data.profesor.email);
			console.log('success');
			console.log(data);
		},
		function(data){
			console.log('error');
			console.log(data);
		}
	);

	$scope.handlerUpdateProfesor = function(){
		var profesor = {
      nombres: $scope.profesor.nombres,
      apellidos: $scope.profesor.apellidos,
      email: $scope.profesor.email,
      celular: $scope.profesor.celular,
      especialidad: $scope.profesor.especialidad,
			cargo: $scope.profesor.item.cargo,
			turno: $scope.profesor.item.turno,
			departamento: $scope.profesor.item.departamento,
			distrito: $scope.profesor.item.distrito,
			horasTrabajo: $scope.profesor.item.horasTrabajo
    };
		console.log(Api);
		Api.Profesor.update.query(
			profesor,
			function(data){
				console.log('success');
				console.log(data);
			},
			function(data){
				console.log('error');
				console.log(data);
			}
		);
	};
	
}