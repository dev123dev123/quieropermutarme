function AuthenticationCtrl($scope, Api, Data){

	$scope.handlerRegistrar = function(){
		console.log('handlerRegistrar');
		Api.Profesor.create.query(
			//data sent
			$scope.newProfesor,
			//success
			function(data){
				console.log('success');
				console.log(data);
				Data.profesor = data;
			},
			//error
			function(data){
				console.log('error');
				console.log(data);
			}
		);
	};

	$scope.handlerConectar = function(){
		console.log('$scope.profesor: ');
		console.log($scope.profesor);
		Api.Profesor.signin.query(
			//data sent
			$scope.profesor,
			//success
			function(data){
				console.log('success');
				console.log(data);
				Data.profesor = data;
				console.log(Data);
			}, 
			//error
			function(data){
				console.log('error');
				console.log(data);
			});
	};
}

function NavigationCtrl($scope){
}

function MiCuentaCtrl($scope, Api, Data){
	console.log(Api);
	console.log('MiCuentaCtrl called');
	console.log(Data.profesor.email);
	Api.Profesor.getProfesorByEmail.query(
		{email: Data.profesor.email},
		function(data){
			$scope.profesor = data;
			Data.profesor = data;
			console.log('Data.profesor.email: ');
			console.log(Data.profesor.email);
			console.log('success');
			console.log(data);
		},
		function(data){
			console.log('error');
			console.log(data);
		}
	);

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
		console.log(Api);
		Api.Profesor.update.query(
			profesor,
			function(data){
				console.log('success');
				console.log(data);
			},
			function(data){
				console.log('error');
				console.log(data);
			}
		);
	};
	
}