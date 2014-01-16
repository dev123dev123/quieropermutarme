function MainCtrl($scope, $location, $cookieStore, $http) {
  if($cookieStore.get('token')) {
    $http.defaults.headers.common['token'] = $cookieStore.get('token');    
  }
  console.log('MainCtrl here');

  $scope.handlerIrMiCuenta = function(){
    $('#modalWarning').modal('hide');
    $location.path('/micuenta');
  };

  $scope.handlerCerrarWarning = function(){
    $('#modalWarning').modal('hide');
  };
}