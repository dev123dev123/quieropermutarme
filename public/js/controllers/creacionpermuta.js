function CreacionPermutaCtrl($scope, Data, PermutaAPI, $location, $timeout, $cookieStore, Departamentos){
	$scope.errorMessage = '';
	if(typeof $cookieStore.get('profesor') !== undefined){
		Data.profesor = $cookieStore.get('profesor');
	}

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
			removeItemByValue($scope.distritosDestino, $scope.profesor.item.distrito);
			//removing destinos that were already selected
			if (typeof $scope.permuta !== 'undefined') {
				for(var i in $scope.permuta.destinos) {
					removeItemByValue($scope.distritosDestino, $scope.permuta.destinos[i].distrito);
				}
			} else {
				$scope.permuta = {
					destinos: []
				}
			}
		},
		//error
		function(data){
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

	function removeItemByValue(array, item) {
		for(var i in array) {
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
					$('#btnAgregarDestino').button('reset');
					$('#myModal').modal('show');
				},
				//error
				function(data){
					logout();
					$('#btnAgregarDestino').button('reset');
				}
			);
		} else {
			$('#warningDestinoModal').modal('show');
			$timeout(function(){
				$('#warningDestinoModal').modal('hide');
			}, 3000);
		}
	};

	$scope.handlerEliminarDestino = function(destino){
		var indexDestino = $scope.permuta.destinos.indexOf(destino);
		if(indexDestino > -1){
			$scope.permuta.destinos.splice(indexDestino, 1);
			PermutaAPI.update.query({email: Data.profesor.email, destinos: $scope.permuta.destinos},
				//success 
				function(data){
					$scope.distritosDestino.push({nombre: destino.distrito});
				},
				//error
				function(data){
					logout();
				}
			);
		}
	};
}
