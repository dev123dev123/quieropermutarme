function MiCuentaCtrl($scope, Api, Data, $timeout, $cookieStore, Departamentos){
	Data.profesor = $cookieStore.get('profesor');
	Data.prepForBroadcast(Data.profesor);
	Data.changeActiveListItem('');
	var input;
	$scope.departamentos = Departamentos[0];
	$scope.updateError = "";
	Api.Profesor.getProfesorByEmail.query(
		{email: Data.profesor.email},
		function(data){
			$scope.profesor = data;
			if(!!$scope.profesor.celular){
				$scope.profesor.celular = Number($scope.profesor.celular);	
			}
			if(!!$scope.profesor.item){
				$scope.profesor.item.horasTrabajo = Number($scope.profesor.item.horasTrabajo);	
			}
			Data.profesor = data;
		},
		function(data){
			console.log('error');
			console.log(data);
		}
	);

	$scope.handlerDepartamento = function(departamento){
		$scope.profesor.item.departamento = departamento;
	};

	$scope.handlerDistritoModal = function(distrito){
		$scope.profesor.item.distrito = distrito;
		// $scope.distritoSelected = distrito;
		//$('#modalChangeDistrito').modal('show');
	};

	// $scope.handlerDistritoOK = function(){
	// 	profesor.item.distrito = 
	// };

	// $scope.handlerDistritoCancel = function(){

	// };

	$scope.handlerOnBlur = function(field, form){
		$scope[form][field].$dirty = true;
	};

	$scope.isValidEmail = function(){
		return $scope.formPersonalInfo.email.$error.email;
	};

	$scope.isNumber = function(number){
		return !isNaN(parseFloat(number)) && isFinite(number);
	};

	$scope.isNotValidNumber = function(field, form){
		console.log('field: ' + field);
		console.log('form: ' + form);
		console.log('$scope.profesor');
		console.log($scope.profesor);

		if($scope.profesor){
			console.log('!$scope.isNumber(Number($scope.profesor.item.horasTrabajo)): ');
			console.log(!$scope.isNumber(Number($scope.profesor.item.horasTrabajo)));
			return !$scope.isNumber(Number($scope.profesor.item.horasTrabajo));	
		}
		return false;
	};

	$scope.hasError = function(field, form){
		console.log($scope[form][field].$error.required);
		var anyError = $scope[form][field].$error.required;
		return anyError;
	};

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

	    if ($scope.formPersonalInfo.$valid && $scope.formWorkInfo.$valid){
			Api.Profesor.update.query(
				profesor,
				function(data){
					console.log('success');
					console.log(data);
					$cookieStore.put('profesor', data);
					$('#myModal').modal({backdrop: 'static', keyboard: false});
					$('#btnUpdateProfesor').button('loading');
					$timeout(function(){
						$('#myModal').modal('hide');
						$('#btnUpdateProfesor').button('reset');
					}, 2500);
				},
				function(data){
					console.log('error');
					console.log(data);
				}
			);
	    }else{
	    	// iterate all inputs of the forms to search for the ones with empty value
	    	// and then set their $dirty property to true in order to show in UI that 
	    	// are invalid.
	    	for(propertyName in profesor){
	    		if(typeof profesor[propertyName] !== 'undefined' && !isNaN(profesor[propertyName])){
	    			if(profesor[propertyName].length <= 0){
		    			input = $scope.formPersonalInfo[propertyName];
		    			if(typeof input !== 'undefined'){
		    				input.$dirty = true;
		    			}else{
		    				$scope.formWorkInfo[propertyName] = true;
		    			}
		    		}
	    		}else{
	    			input = $scope.formPersonalInfo[propertyName];
	    			if(typeof input !== 'undefined'){
	    				input.$dirty = true;
	    			}else{
	    				$scope.formWorkInfo[propertyName].$dirty = true;
	    			}
	    		}
	    	}

	    	$scope.formPersonalInfo.$dirty = true;
	    	$scope.updateError = "Porfavor ingrese todos los campos que sean requeridos.";
	    }
	};
}