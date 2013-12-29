function AuthenticationCtrl($scope, Api){

	$scope.handlerRegistrar = function(){
		console.log('handlerRegistrar');
		Api.Profesor.create.query(
			//data sent
			$scope.newProfesor,
			//success
			function(data){
				console.log('success');
				console.log(data);
			},
			//error
			function(data){
				console.log('error');
				console.log(data);
			}
		);
	};

	$scope.handlerConectar = function(){
		Api.Profesor.get.query(
			//data sent
			$scope.profesor,
			//success
			function(data){
				console.log('success');
				console.log(data);
			}, 
			//error
			function(data){
				console.log('error');
				console.log(data);
			});
	};
}