function CreacionPermutaCtrl($scope, Api, Data, $cookieStore){
	Data.profesor = $cookieStore.get('profesor');
	Data.prepForBroadcast(Data.profesor);
	$scope.profesor = Data.profesor;
	$scope.profesor.fullname = $scope.profesor.nombres + ' ' + $scope.profesor.apellidos;
	Api.Permuta.getPermutaByProfesorEmail.query(
		{email: Data.profesor.email},
		function(data){
			Data.permuta = data[0];
			$scope.permuta = data[0];
			console.log('success');
			console.log(data[0]);
		},
		function(data){
			console.log('error');
			console.log(data);
		}
	);

	$scope.handlerAgregarDestino = function(destino){
		$scope.permuta.destinos.push({
			departamento: $scope.departamentoDestino,
			distrito: $scope.distritoDestino
		});

		Api.Permuta.update.query(
			{
				email: Data.profesor.email, 
				destinos: $scope.permuta.destinos,
				origen: {
					departamento: $scope.profesor.item.departamento,
					distrito: $scope.profesor.item.distrito
				}
			}, 
			function(data){
				console.log('success');
				console.log(data);
			},
			function(data){
				console.log('success');
				console.log(data);
			}
		);

	};

	$scope.handlerEliminarDestino = function(destino){
		var indexDestino = $scope.permuta.destinos.indexOf(destino);
		if(indexDestino > -1){
			$scope.permuta.destinos.splice(indexDestino, 1);
			Api.Permuta.update.query({email: Data.profesor.email, destinos: $scope.permuta.destinos}, 
				function(data){
					console.log('success');
					console.log(data);
				},
				function(data){
					console.log('error');
					console.log(data);
				}
			);
		}
	};

	$scope.handlerLostFocus = function(){
		Api.Permuta.update.query({email: Data.profesor.email, informacionAdicional: $scope.permuta.informacionAdicional}, 
			function(data){
				console.log('success');
				console.log(data);
			},
			function(data){
				console.log('error');
				console.log(data);
			}
		);
	};
}
