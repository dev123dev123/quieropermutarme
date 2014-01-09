function NavigationCtrl($scope, Data, $location, $cookieStore	){
	$scope.$on('handleBroadcast', function(event, message){
		$scope.profesor = message;
	});

	$scope.$on('handlerActiveItemChanged', function(event, item){
		$scope.setActiveListItem(item);
	});

	$scope.setActiveListItem = function(listItem){
		$scope['verPermutas'] = "";
		$scope['crearPermuta'] = "";
		$scope[listItem] = "active";
	};

	$scope.handlerSalir = function(){
		Data.profesor = null;
		Data.origenDepartamento = null;
		Data.destinoDepartamento = null;
		Data.origenDistrito = null;
		Data.destinoDistrito = null;
		$scope.profesor = null;
		Data.prepForBroadcast(null);
		$location.path('/');
		$cookieStore.remove('profesor');
		$cookieStore.remove('Data');
	};

	$scope.handlerHome = function(){
		if($scope.profesor){
			$location.path('/permutas');		
		}else{
			$location.path('/');
		}
	};
}