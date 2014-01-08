function NavigationCtrl($scope, Data, $location){
	$scope.$on('handleBroadcast', function(event, message){
		$scope.profesor = message;
	});

	$scope.handlerSalir = function(){
		Data.profesor = null;
		Data.origenDepartamento = null;
		Data.destinoDepartamento = null;
		Data.origenDistrito = null;
		Data.destinoDistrito = null;
		$scope.profesor = null;
		Data.prepForBroadcast(null);
		$location.path('/');
	};

	$scope.handlerHome = function(){
		if($scope.profesor){
			$location.path('/permutas');		
		}else{
			$location.path('/');
		}
	};
}