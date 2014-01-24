function ResetPasswordCtrl($scope, ProfesorAPI, $timeout, $location) {
  $scope.data = {};
  $scope.data.email = "";
  $scope.data.result = "";

  $scope.handleEnterKeyPress = function() {
    $scope.sendEmail();
  };

  $scope.showModal = function(message, backToHome) {
    $scope.data.result = message;
    $('#resultModal').modal('show');

    $timeout(function(){
      $('#resultModal').modal('hide');
      console.log(backToHome);
      if(backToHome) {
        backToHome();
      }
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


  $scope.sendEmail = function() {
    if ($scope.formResetPassword.$valid) {
      ProfesorAPI.resetPassword.query(
        {
          email: $scope.data.email
        },
        function(data){
          $scope.showModalSuccess("Tu nueva contraseña ya esta siendo generada, dentro de unos minutos te llegara la nueva contraseña a tu correo electronico.");
          
        },
        function(data){
          $scope.showModalError("Lo siento no tenemos ningun registro con el correo electronico que ingresaste.");
        }
      );
    } else {
      $scope.formResetPassword.$dirty = true;
    }
  };

  $scope.handleSendEmail = function() {
    $scope.sendEmail();
  };
}