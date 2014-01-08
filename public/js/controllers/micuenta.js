function MiCuentaCtrl($scope, Api, Data, $timeout, $cookieStore){
	Data.profesor = $cookieStore.get('profesor');
	Data.prepForBroadcast(Data.profesor);
	var input;
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
		if($scope.profesor){
			console.log('isValidNumber: ' + $scope.isNumber(Number($scope.profesor.item.horasTrabajo)));
			return !$scope.isNumber(Number($scope.profesor.item.horasTrabajo));	
		}
		return false;
	};

	$scope.hasError = function(field, form){
		// var anyError = $scope[form][field].$error.required &&
		// 			$scope[form][field].$dirty;
		console.log($scope[form][field].$error.required);
		var anyError = $scope[form][field].$error.required;
		// if(field === 'email'){
		// 	anyError = $scope[form][field].$error.email && anyError;
		// }

		// if(field === 'celular' || field === 'horasTrabajo'){
		// 	anyError = $scope[form].$invalid && anyError;
		// }
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
					$('#myModal').modal('toggle');
					$timeout(function(){
						$('#myModal').modal('toggle');
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