function ResetPasswordCtrl($scope, ProfesorAPI, $timeout) {
  $scope.data = {};
  $scope.data.email = "";
  $scope.data.result = "";

  $scope.showModal = function(message) {
    $scope.data.result = message;
    $('#resultModal').modal('show');
    $timeout(function(){
      $('#resultModal').modal('hide');
    }, 4000);
  };

  $scope.handleSendEmail = function() {
    console.log($scope.formResetPassword.$valid);
    if ($scope.formResetPassword.$valid) {
      ProfesorAPI.resetPassword.query(
        {
          email: $scope.data.email
        },
        function(data){
          $scope.showModal("Tu nueva contraseña ya esta siendo generada, dentro de unos minutos te llegara a tu correo electronico.");
        },
        function(data){
          $scope.showModal("Lo siento no tenemos ningun registro con tu correo electronico.");
        }
      );
    }
  };
}