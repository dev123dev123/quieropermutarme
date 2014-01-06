function AuthenticationCtrl($scope, Api, Data, $location){
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
			Api.Profesor.create.query(
				//data sent
				$scope.newProfesor,
				//success
				function(data){
					console.log('success');
					console.log(data);
					Data.profesor = data;
					Data.prepForBroadcast(data);
					Api.Permuta.create.query({profesorEmail: Data.profesor.email});
					$location.path('/permutas');
				},
				//error
				function(data){
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
		Api.Profesor.signin.query(
			//data sent
			$scope.profesor,
			//success
			function(data){
				console.log('success');
				console.log(data);
				Data.profesor = data;
				console.log(Data);
				Data.prepForBroadcast(data);
				$location.path('/permutas');
			}, 
			//error
			function(data){
				console.log('error');
				console.log(data);
				$scope.loginError = data.data;
			});
	};
}