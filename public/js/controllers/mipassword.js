function MiPasswordCtrl($scope, Data, ProfesorAPI, $cookieStore, $timeout, $location) {
  $scope.profesor = $cookieStore.get('profesor');
  $scope.data = {};
  $scope.data.password = '';
  $scope.data.newPassword = '';
  $scope.data.result = '';
  Data.changeActiveListItem('miContraseña');

  Data.prepForBroadcast($cookieStore.get('profesor'));
  Data = $cookieStore.get('Data');  

  $scope.handleFormEnterKeyPress = function() {
    $scope.tryChangePassword();
  };

  $scope.handleBack = function (){
    $location.path('/permutas');
  };

  $scope.showModal = function(message, backToHome) {
    $scope.data.result = message;
    $('#resultModal').modal('show');

    $timeout(function(){
      $('#resultModal').modal('hide');
    }, 8000);
  };

  $scope.showModalSuccess = function(message) {
    $scope.showModal(message, function(){
      $location.path('/');
    });
  };

  $scope.showModalError = function(message) {
    $scope.showModal(message);
  };

  $scope.tryChangePassword = function() {
    if ($scope.formPassword.$valid) {
      ProfesorAPI.changePassword.query(
        {
          email: $scope.profesor.email,
          password: $scope.data.password,
          newPassword: $scope.data.newPassword
        },
        function() {
          $scope.showModalSuccess('Tu contraseña ha sido modificada satisfactoriamente.');
        },
        function() {
          $scope.showModalError('Hubo un error, ingresa tu contraseña actual correcta.');
        }
      );
    };
  };
  
  $scope.handleChange = function() {
    $scope.tryChangePassword();
  };
}