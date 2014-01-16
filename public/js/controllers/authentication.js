function AuthenticationCtrl($scope, $http, Api, Data, $location, $cookieStore){
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
			Api.Profesor.create.query(
				//data sent
				$scope.newProfesor,
				//success
				function(profesorData){
					Api.AccessToken.create.query(
						{
							email: $scope.newProfesor.email,
							password:  $scope.newProfesor.password
						}
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
							Api.Permuta.create.query({profesorEmail: Data.profesor.email});
							$location.path('/permutas');
						}
						, function(data){
							$('#btnRegistrarProfesor').button('reset');
							console.log('error');
							console.log(data);
							$scope.signupError = data.data;
						}
					);	
				},
				//error
				function(data){
					$('#btnRegistrarProfesor').button('reset');
					console.log('error');
					console.log(data);
					$scope.signupError = data.data;
				}
			);
		}else{
			$scope.signupError = "Porfavor ingrese todos los campos que sean requeridos.";
		}	
	};

	$scope.handlerConectar = function(){
		$('#btnConectarProfesor').button('loading');
		Api.Profesor.signin.query(
			//data sent
			$scope.profesor,
			//success
			function(profesorData){
					Api.AccessToken.create.query(
					{
						email: $scope.profesor.email,
						password:  $scope.profesor.password
					}
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
					, function(data){
							$('#btnConectarProfesor').button('reset');
							console.log('error');
							console.log(data);
							$scope.loginError = data.data;
					}
				);
			}, 
			//error
			function(data){
				$('#btnConectarProfesor').button('reset');
				console.log('error');
				console.log(data);
				$scope.loginError = data.data;
			});
	};
}