function NavigationCtrl($scope, Data, $location, $cookieStore, AccessTokenAPI, ProfesorAPI, $http, $timeout){  
	$scope.$on('handleBroadcast', function(event, message){
		$scope.profesor = message;
	});

	$scope.$on('handlerActiveItemChanged', function(event, item){
		$scope.setActiveListItem(item);
	});

	$scope.setActiveListItem = function(listItem){
		if (listItem === 'crearPermuta') {
			if (
						!isNullOrEmptyString($scope.profesor.especialidad) &&
						!isNullOrEmptyString($scope.profesor.item.cargo) &&
						!isNullOrEmptyString($scope.profesor.item.turno) &&
						!isNullOrEmptyString($scope.profesor.item.departamento) &&
						!isNullOrEmptyString($scope.profesor.item.distrito)
          ) {
          cleanAndActivePage(listItem);
					$location.path('/crearpermuta');
				} else {
					$('#modalWarning').modal('show');
				}
		} else if (listItem === 'verPermutas') {
      cleanAndActivePage(listItem);
		} else if (listItem === 'autor') {
      cleanAndActivePage(listItem);
    } else if (listItem === 'miCuenta') {
      cleanAndActivePage(listItem);
    } else if (listItem === 'miContraseña') {
      cleanAndActivePage('miCuenta');
    }
	};

  function cleanAndActivePage(listItem) {
    $scope['verPermutas'] = '';
    $scope['crearPermuta'] = '';
    $scope['autor'] = '';
    $scope['miCuenta'] = '';
    $scope[listItem] = 'active'
  }

	$scope.handlerSalir = function(){
		Data.profesor = null;
		Data.origenDepartamento = null;
		Data.destinoDepartamento = null;
		Data.origenDistrito = null;
		Data.destinoDistrito = null;
		Data.prepForBroadcast(null);
    
    $scope.profesor = null;
		$location.path('/');
		$cookieStore.remove('profesor');
		$cookieStore.remove('Data');
	};

  if(typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, ''); 
    }
  }

  function isString(value){
    return Object.prototype.toString.call(value) === '[object String]';
  }

  function isNull(value){
      return value === null;
  }

  function isUndefined(value){
      return typeof value === 'undefined';
  }

  function isEmptyArray(array){
      return array.length === 0;
  }

  function isNullOrEmptyString(value){
      var isValidString = !isNull(value) && !isUndefined(value) && isString(value);
      if (isValidString) {
          return (value.trim().length === 0);
      }
      return true;
  }

	$scope.handlerHome = function(){
		if($scope.profesor){
			$location.path('/permutas');
		}else{
			$location.path('/');
		}
	}

  $scope.handlerEnterKeyPress = function(callbackName){
    $scope[callbackName]();
  };

  $scope.handlerConectar = function(){
    $('#btnConectarProfesor').button('loading');
    ProfesorAPI.signin.query(
      //data sent
      $scope.loginProfesor,
      //success
      function(profesorData){
          AccessTokenAPI.create.query(
          {
            email: $scope.loginProfesor.email,
            password:  $scope.loginProfesor.password
          }
          //success
          , function(tokenData){
            Data.profesor = profesorData;
            Data.token = tokenData;
            $cookieStore.put('profesor', profesorData);
            $http.defaults.headers.common['token'] = tokenData.token;
            $cookieStore.put('token', tokenData.token);
            Data.prepForBroadcast(profesorData);
            $location.path('/permutas');
            $('#btnConectarProfesor').button('reset');
            $scope.loginProfesor = null;
          }
          //error
          , function(data){
            $('#btnConectarProfesor').button('reset');
            // $scope.loginError = data.data;
            //logout();
            $('#loginErrorModal').modal('show');

            $timeout(function(){
              $('#loginErroModal').modal('hide');
            }, 4000);
          }
        );
      }, 
      //error
      function(response){
        $('#btnConectarProfesor').button('reset');
        switch(response.status) {
          case 401:
            $scope.loginError = "Usuario y password incorrectos."
          break;
          case 400:
            $scope.loginError = "Llene email y password para conectarse.";
          break;
          default:
            $scope.loginError = "Hubo un error en el proceso, intente de nuevo.";
          break;
        }
        console.log('$scope.loginError');
        console.log($scope.loginError);
        $scope.loginErrorMessage = $scope.loginError;
        $('#loginErrorModal').modal('show');
            $timeout(function(){
              $('#loginErrorModal').modal('hide');
            }, 4000);
      });
  };
}