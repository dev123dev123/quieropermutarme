function DetallePermutaCtrl($scope, Data){
	$scope.profesor = Data.datosDetallePermuta.profesor;
	$scope.permuta = Data.datosDetallePermuta.permuta;

	$scope.handlerBack = function(){
		window.history.back();
	};
}
