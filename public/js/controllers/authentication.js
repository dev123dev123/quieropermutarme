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
							console.log('success');
							console.log(profesorData);
							Data.profesor = profesorData;
							console.log('tokenData: ');
							console.log(tokenData);
							$http.defaults.headers.common['token'] = tokenData.token;
							Data.prepForBroadcast(profesorData);
							$cookieStore.put('profesor', profesorData);
							$cookieStore.put('token', tokenData.token);
							PermutaAPI.create.query({profesorEmail: Data.profesor.email});
							$location.path('/permutas');
						}
						//error
						, function(response){
							$('#btnRegistrarProfesor').button('reset');
							$scope.signupError = "Hubo un error en el proceso, intente de nuevo.";
							logout();
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
				}
			);
		}else{
			$scope.signupError = "Porfavor ingrese todos los campos que sean requeridos.";
		}	
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

	$scope.handlerConectar = function(){
		$('#btnConectarProfesor').button('loading');
		console.log('Profesor:');
		ProfesorAPI.signin.query(
			//data sent
			$scope.profesor,
			//success
			function(profesorData){
					AccessTokenAPI.create.query(
					{
						email: $scope.profesor.email,
						password:  $scope.profesor.password
					}
					//success
					, function(tokenData){
						console.log('success');
						console.log(profesorData);
						Data.profesor = profesorData;
						Data.token = tokenData;
						$cookieStore.put('profesor', profesorData);
						console.log('tokenData: ');
						console.log(tokenData);
						$http.defaults.headers.common['token'] = tokenData.token;
						$cookieStore.put('token', tokenData.token);
						console.debug('$cookies.profesor: ');
						console.debug($cookieStore.get('profesor'));
						Data.prepForBroadcast(profesorData);
						$location.path('/permutas');
					}
					//error
					, function(data){
						$('#btnConectarProfesor').button('reset');
						console.log('error**************');
						console.log(data);
						// $scope.loginError = data.data;
						console.log(response.status);
						logout();
					}
				);
			}, 
			//error
			function(response){
				$('#btnConectarProfesor').button('reset');
				console.log('error');
				console.log(response);

				switch(response.status) {
					case 401:
						$scope.loginError = "Usuario y password incorrectos."
					break;
					case 400:
						$scope.loginError = "Llene email y password para conectarse.";
					break;
					default:
						$scope.loginError = "Hubo un error en el proceso, intente de nuevo.";
					break;
				}
			});
	};
}