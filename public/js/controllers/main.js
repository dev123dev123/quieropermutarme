function MainCtrl($scope, $location, $cookieStore, $http, Data) {
  if($cookieStore.get('token')) {
    $http.defaults.headers.common['token'] = $cookieStore.get('token');    
  }
  $scope.handlerIrMiCuenta = function(){
    $('#modalWarning').modal('hide');
    $location.path('/micuenta');
    Data.broadCastItemChanged('miCuenta');
  };
  $scope.handlerCerrarWarning = function(){
    $('#modalWarning').modal('hide');
  };
}