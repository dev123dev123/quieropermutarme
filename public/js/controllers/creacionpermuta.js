function CreacionPermutaCtrl($scope, Api, Data, $cookieStore, Departamentos){
	console.debug('cookieStore.profesor')
	console.debug($cookieStore.get('profesor'));
	if(typeof $cookieStore.get('profesor') !== undefined){
		Data.profesor = $cookieStore.get('profesor');
	}

	console.debug('Data: ');
	console.debug(Data);

	Data.prepForBroadcast(Data.profesor);
	$scope.departamentos = Departamentos;
	$scope.departamentoSelected = Departamentos[0];
	$scope.profesor = Data.profesor;
	$scope.profesor.fullname = $scope.profesor.nombres + ' ' + $scope.profesor.apellidos;
	Data.changeActiveListItem('crearPermuta');
	Api.Permuta.getPermutaByProfesorEmail.query(
		{email: Data.profesor.email},
		function(data){
			Data.permuta = data[0];
			$scope.permuta = data[0];
			console.log('success');
			console.log(data[0]);
		},
		function(data){
			console.log('error');
			console.log(data);
		}
	);

	$scope.departamentoAddedRecently = "";
	$scope.distritoAddedRecently = "";

	$scope.handlerDepartamentoDestino = function(destino){
		$scope.departamentoDestino = destino;
	};

	$scope.handlerDistritoDestino = function(distrito){
		$scope.distritoDestino = distrito;
	};

	function areNotEmpty(departamento, distrito){
		return (!!departamento) && (!!distrito);
	}

	$scope.handlerAgregarDestino = function(destino){
		// if (areNotEmpty($scope.departamentoDestino, $scope.distritoDestino)){
		if ($scope.distritoDestino){
			$scope.permuta.destinos.push({
				departamento: $scope.departamentoDestino,
				distrito: $scope.distritoDestino
			});

			$scope.departamentoAddedRecently = $scope.departamentoDestino;
			$scope.distritoAddedRecently = $scope.distritoDestino;

			$('#btnAgregarDestino').button('loading');
			$scope.departamentoDestino = '';
			$scope.distritoDestino = '';

			Api.Permuta.update.query(
				{
					email: Data.profesor.email, 
					destinos: $scope.permuta.destinos,
					origen: {
						// departamento: $scope.profesor.item.departamento,
						departamento: 'Cochabamba',
						distrito: $scope.profesor.item.distrito
					}
				}, 
				function(data){
					console.log('success');
					console.log(data);
					$('#btnAgregarDestino').button('reset');
					$('#myModal').modal('show');
				},
				function(data){
					console.log('error');
					console.log(data);
					$('#btnAgregarDestino').button('reset');
				}
			);
		}else{
			console.debug('ELSSSSSSSSEEEEEEEEEEEEE');
		}
	};

	$scope.handlerEliminarDestino = function(destino){
		var indexDestino = $scope.permuta.destinos.indexOf(destino);
		if(indexDestino > -1){
			$scope.permuta.destinos.splice(indexDestino, 1);
			//$('#btnEliminarDestino').button('loading');
			Api.Permuta.update.query({email: Data.profesor.email, destinos: $scope.permuta.destinos}, 
				function(data){
					console.log('success');
					console.log(data);
					//$('#btnEliminarDestino').button('reset');
				},
				function(data){
					console.log('error');
					console.log(data);
					//$('#btnEliminarDestino').button('reset');
				}
			);
		}
	};
}
