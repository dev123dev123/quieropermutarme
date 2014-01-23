function MiPasswordCtrl($scope, Data, ProfesorAPI, $cookieStore, $timeout) {
  $scope.profesor = $cookieStore.get('profesor');
  $scope.data = {};
  $scope.data.password = '';
  $scope.data.newPassword = '';
  $scope.data.result = '';

  Data.prepForBroadcast($cookieStore.get('profesor'));
  Data = $cookieStore.get('Data');  

  $scope.showModal = function(message) {
    $scope.data.result = message;
    $('#resultModal').modal('show');

    $timeout(function(){
      $('#resultModal').modal('hide');
    }, 8000);
  };

  $scope.handleChange = function() {
    console.log($scope.formPassword.$valid);
    if ($scope.formPassword.$valid) {
      ProfesorAPI.changePassword.query(
        {
          email: $scope.profesor.email,
          password: $scope.data.password,
          newPassword: $scope.data.newPassword
        },
        function() {
          $scope.showModal('Tu contraseña ha sido modificada satisfactoriamente.');
        },
        function() {
          $scope.showModal('Hubo un error, ingresa tu contraseña actual correcta.');
        }
      );
    };
  };
}