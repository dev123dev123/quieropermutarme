function NavigationCtrl($scope, Data, $location){

	console.log('profesor from NavigationCtrl');
	$scope.$on('handleBroadcast', function(){
		console.log('handleBroadcast!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		$scope.profesor = Data.profesor;
	});

	$scope.handlerSalir = function(){
		Data.profesor = null;
		Data.origenDepartamento = null;
		Data.destinoDepartamento = null;
		console.log(Data);
		$scope.profesor = Data.profesor;
		Data.prepForBroadcast(data);
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