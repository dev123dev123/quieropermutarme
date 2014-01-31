function AuthenticationCtrl($scope, $http, ProfesorAPI, AccessTokenAPI, PermutaAPI, Data, $location, $timeout, $cookieStore){
	$scope.loginError = "";
	$scope.signupError = "";

	$scope.handlerEnterKeyPress = function(callbackName){
		$scope[callbackName]();
	};

	$scope.handlerOnBlur = function(field){
		$scope.formSignup[field].$dirty = true;
	};

	$scope.handlerRegistrar = function(){
		if($scope.formSignup.$valid){
			$scope.newProfesor.departamento = 'Cochabamba'
			$('#btnRegistrarProfesor').button('loading');
			ProfesorAPI.create.query(
				//data sent
				$scope.newProfesor,
				//success
				function(profesorData){
					AccessTokenAPI.create.query(
						{
							email: $scope.newProfesor.email,
							password:  $scope.newProfesor.password
						}
						//success
						, function(tokenData){
							Data.profesor = profesorData;
							$http.defaults.headers.common['token'] = tokenData.token;
							Data.prepForBroadcast(profesorData);
							$cookieStore.put('profesor', profesorData);
							$cookieStore.put('token', tokenData.token);
							PermutaAPI.create.query({
								profesorEmail: Data.profesor.email,
								profesorName: Data.profesor.nombres
							});
							$location.path('/permutas');
						}
						//error
						, function(response){
							$('#btnRegistrarProfesor').button('reset');
							$scope.signupError = "Hubo un error en el proceso, intente de nuevo.";
							showErrorModal();
						}
					);	
				},
				//error
				function(response){
					$('#btnRegistrarProfesor').button('reset');
					switch(response.status) {
						case 409:
							$scope.signupError = "Email que lleno ya fue registrado."
						break;
						default:
							$scope.signupError = "Hubo un error en el proceso, intente de nuevo.";
						break;
					}
					showErrorModal();
				}
			);
		}else{
			$scope.signupError = "Porfavor ingrese todos los campos que sean requeridos.";
		}	
	};

	function showErrorModal() {
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


}