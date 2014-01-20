function DetallePermutaCtrl($scope, Data, $cookieStore, $location){
	Data.prepForBroadcast($cookieStore.get('profesor'));
	Data = $cookieStore.get('Data');
	$scope.profesor = Data.datosDetallePermuta.profesor;
	$scope.permuta = Data.datosDetallePermuta.permuta;
	$scope.handlerBack = function(){
    $location.path('/permutas');
	};
}
