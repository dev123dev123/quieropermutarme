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

	$scope.especialidades = [
		'Musica',
		'Educacion Fisica',
		'Matematicas',
		'Filosofia',
		'Psicologia',
	];

	$scope.cargos = [
		'Profesor',
		'Director'
	];

	$scope.turnos = [
		'Mañana',
		'Tarde',
		'Noche'
	];

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

	$scope.handleCargo = function(cargo) {
		$scope.profesor.item.cargo = cargo;
	};

	$scope.handleTurno = function(turno) {
		$scope.profesor.item.turno = turno;
	};

	$scope.handleEspecialidad = function(especialidad) {
		$scope.profesor.especialidad = especialidad;
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

	$scope.isUndefined = function(value) {
		return typeof value === 'undefined';
	};

	$scope.handlerUpdateProfesor = function(){
		var profesor;
    if (
    	$scope.formPersonalInfo.$valid 
    	&& $scope.formWorkInfo.$valid 
    	&& !$scope.isUndefined($scope.profesor.item.distrito) 
    	&& !$scope.isUndefined($scope.profesor.item.cargo)
    	&& !$scope.isUndefined($scope.profesor.item.turno) ) {
	    	profesor = {
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
		    console.log(profesor);
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