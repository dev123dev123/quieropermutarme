function MiCuentaCtrl($scope, ProfesorAPI, Data, $timeout, $location, $cookieStore, Departamentos){
	Data.profesor = $cookieStore.get('profesor');
	Data.prepForBroadcast(Data.profesor);
	Data.changeActiveListItem('miCuenta');
	var input;
	$scope.departamentos = Departamentos[0];
	$scope.profesor= {
		item: {
			distrito: {}
		}
	}

	$scope.updateError = "";
	// ProfesorAPI.getProfesorByEmail.query(
	// 	{email: Data.profesor.email},
	// 	function(data){
	// 		$scope.profesor = data;
	// 		if(!!$scope.profesor.celular){
	// 			$scope.profesor.celular = Number($scope.profesor.celular);	
	// 		}
	// 		if(!!$scope.profesor.item){
	// 			$scope.profesor.item.horasTrabajo = Number($scope.profesor.item.horasTrabajo);	
	// 		}
	// 		Data.profesor = data;
	// 	},
	// 	function(data){
	// 		logout();
	// 	}
	// );

	$scope.profesor = Data.profesor;
	if(!!$scope.profesor.celular){
		$scope.profesor.celular = Number($scope.profesor.celular);	
	}
	if(!!$scope.profesor.item){
		$scope.profesor.item.horasTrabajo = Number($scope.profesor.item.horasTrabajo);	
	}

	$scope.handlerDistritoModal = function(distrito){
		$scope.profesor.item.distrito = distrito;
	};

	$scope.handlerOnBlur = function(field, form){
		$scope[form][field].$dirty = true;
	};

	$scope.hasError = function(field, form){
		return $scope[form][field].$error.required;
	};

	$scope.showModalError = function() {
		$('#modalErrorUpdateInfo').modal('show');

		$timeout(function(){
			$('#modalErrorUpdateInfo').modal('hide');
		}, 5000);
	};

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

	$scope.handlerUpdateProfesor = function(){
    if ($scope.formPersonalInfo.$valid && $scope.formWorkInfo.$valid && $scope.profesor.item.distrito){
	    	var profesor = {
		      nombres: $scope.profesor.nombres,
		      apellidos: $scope.profesor.apellidos,
		      email: $scope.profesor.email,
		      celular: $scope.profesor.celular,
		      especialidad: $scope.profesor.especialidad,
		      item: {
		      	cargo: $scope.profesor.item.cargo,
						turno: $scope.profesor.item.turno,
						departamento: $scope.profesor.item.departamento,
						distrito: $scope.profesor.item.distrito,
						horasTrabajo: $scope.profesor.item.horasTrabajo	
		      }
		    };
	    	ProfesorAPI.updateProfesor.query(
				profesor,
				function(data){
					$cookieStore.put('profesor', data);
					$('#myModal').modal({backdrop: 'static', keyboard: false});
					$('#btnUpdateProfesor').button('loading');
					$timeout(function(){
						$('#myModal').modal('hide');
						$('#btnUpdateProfesor').button('reset');
					}, 2500);
					Data.prepForBroadcast(profesor);
				},
				function(data){
					logout();
				}
			);
				
	    }else{
	    	$scope.showModalError();
	    	$scope.formPersonalInfo.$dirty = true;
	    }
	};
}