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