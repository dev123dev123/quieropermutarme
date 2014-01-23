function ResetPasswordCtrl($scope, ProfesorAPI, $timeout) {
  $scope.data = {};
  $scope.data.email = "";
  $scope.data.result = "";

  $scope.handleEnterKeyPress = function() {
    $scope.sendEmail();
  };

  $scope.showModal = function(message) {
    $scope.data.result = message;
    $('#resultModal').modal('show');
    $timeout(function(){
      $('#resultModal').modal('hide');
    }, 8000);
  };

  $scope.sendEmail = function() {
    if ($scope.formResetPassword.$valid) {
      ProfesorAPI.resetPassword.query(
        {
          email: $scope.data.email
        },
        function(data){
          $scope.showModal("Tu nueva contraseña ya esta siendo generada, dentro de unos minutos te llegara la nueva contraseña a tu correo electronico.");
          
        },
        function(data){
          $scope.showModal("Lo siento no tenemos ningun registro con el correo electronico que ingresaste.");
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