function MiCuentaCtrl($scope, ProfesorAPI, Data, $timeout, $cookieStore, Departamentos){
	Data.profesor = $cookieStore.get('profesor');
	Data.prepForBroadcast(Data.profesor);
	Data.changeActiveListItem('');
	var input;
	$scope.departamentos = Departamentos[0];

	$scope.updateError = "";
	ProfesorAPI.get.query(
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

	$scope.handlerDistritoModal = function(distrito){
		$scope.profesor.item.distrito = distrito;
		// $scope.distritoSelected = distrito;
		//$('#modalChangeDistrito').modal('show');
	};

	$scope.handlerOnBlur = function(field, form){
		$scope[form][field].$dirty = true;
	};

	// $scope.isValidEmail = function(){
	// 	return $scope.formPersonalInfo.email.$error.email;
	// };

	// $scope.isNumber = function(number){
	// 	return !isNaN(parseFloat(number)) && isFinite(number);
	// };

	// $scope.isValidNumber = function(field, form){
	// 	return $scope.isNumber(Number($scope.profesor.item.horasTrabajo));	
	// };

	$scope.hasError = function(field, form){
		return $scope[form][field].$error.required;
	};

	$scope.handlerUpdateProfesor = function(){
    if ($scope.formPersonalInfo.$valid && $scope.formWorkInfo.$valid){
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
		    // var profesor;
		    // console.log(Api.Profesor.updateProfesor.update);

		    	ProfesorAPI.update.query(
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
							Data.prepForBroadcast(profesor);
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
	    	// for(propertyName in profesor){
	    	// 	if(typeof profesor[propertyName] !== 'undefined' && !isNaN(profesor[propertyName])){
	    	// 		if(profesor[propertyName].length <= 0){
		    // 			input = $scope.formPersonalInfo[propertyName];
		    // 			if(typeof input !== 'undefined'){
		    // 				input.$dirty = true;
		    // 			}else{
		    // 				$scope.formWorkInfo[propertyName] = true;
		    // 			}
		    // 		}
	    	// 	}else{
	    	// 		input = $scope.formPersonalInfo[propertyName];
	    	// 		if(typeof input !== 'undefined'){
	    	// 			input.$dirty = true;
	    	// 		}else{
	    	// 			$scope.formWorkInfo[propertyName].$dirty = true;
	    	// 		}
	    	// 	}
	    	// }

	    	$scope.formPersonalInfo.$dirty = true;
	    	$scope.updateError = "Porfavor ingrese todos los campos antes de actualizar.";
	    }
	};

	// $scope.departamento = 'Cochabamba';
}