function CreacionPermutaCtrl($scope, Data, PermutaAPI, $location, $timeout, $cookieStore, Departamentos){
	console.debug('cookieStore.profesor')
	console.debug($cookieStore.get('profesor'));
	$scope.errorMessage = '';
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
	PermutaAPI.getPermutaByProfesorEmail.query(
		{email: Data.profesor.email},
		//success
		function(data){
			Data.permuta = data[0];
			$scope.permuta = data[0];
			$scope.distritosDestino = $scope.departamentoSelected.distritos.slice(0);
			//removing destinos that were already selected
			if (typeof $scope.permuta !== 'undefined') {
				for(var i in $scope.permuta.destinos) {
					remoteItemByValue($scope.distritosDestino, $scope.permuta.destinos[i].distrito);
				}
			} else {
				$scope.permuta = {
					destinos: []
				}
			}
			console.log('success');
			console.log(data[0]);
		},
		//error
		function(data){
			console.log('error');
			console.log(data);
			logout();
		}
	);

	function logout() {
		Data.logout();
		Data.prepForBroadcast(null);
		$('#errorModal').modal('show');
		$timeout(function(){
			$('#errorModal').modal('hide');
				Data.logout();
				Data.prepForBroadcast(null);
				$scope.profesor = null;
				$location.path('/');
				$cookieStore.remove('profesor');
				$cookieStore.remove('Data');
		}, 3000);
	}

	function remoteItemByValue(array, item) {
		for(var i in array) {
			console.log(array[i]);
			if(array[i].nombre === item) {
				array.splice(i, 1);
				break;
			}
		}
	}

	function removeItemByIndex(array, indexItemToDelete) {
		array.splice(indexItemToDelete, 1);
		return array;
	}

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
		var indexToDelete;
		if ($scope.distritoDestino) {
			$($scope.distritosDestino).each(function(index, value){
				if (value.nombre === $scope.distritoDestino) {
					indexToDelete = index;
				}
			});

			removeItemByIndex($scope.distritosDestino, indexToDelete);
			$scope.permuta.destinos.push({
				departamento: "Cochabamba",
				distrito: $scope.distritoDestino
			});
			$scope.departamentoAddedRecently = $scope.departamentoDestino;
			$scope.distritoAddedRecently = $scope.distritoDestino;

			$('#btnAgregarDestino').button('loading');
			$scope.departamentoDestino = '';
			$scope.distritoDestino = '';

			console.log('email: ');
			console.log(Data.profesor.email);

			PermutaAPI.update.query(
				{
					email: Data.profesor.email, 
					destinos: $scope.permuta.destinos,
					origen: {
						// departamento: $scope.profesor.item.departamento,
						departamento: 'Cochabamba',
						distrito: $scope.profesor.item.distrito
					}
				}, 
				//success
				function(data){
					console.log('success');
					console.log(data);
					$('#btnAgregarDestino').button('reset');
					$('#myModal').modal('show');
				},
				//error
				function(data){
					console.log('error');
					console.log(data);
					logout();
					$('#btnAgregarDestino').button('reset');
				}
			);
		}
	};

	$scope.handlerEliminarDestino = function(destino){
		var indexDestino = $scope.permuta.destinos.indexOf(destino);
		if(indexDestino > -1){
			$scope.permuta.destinos.splice(indexDestino, 1);
			PermutaAPI.update.query({email: Data.profesor.email, destinos: $scope.permuta.destinos},
				//success 
				function(data){
					console.log('success');
					console.log(data);
					console.log($scope.distritosDestino);
					$scope.distritosDestino.push({nombre: destino.distrito});
				},
				//error
				function(data){
					console.log('error');
					console.log(data);
					logout();
				}
			);
		}
	};
}
