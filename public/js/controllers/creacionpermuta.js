function CreacionPermutaCtrl($scope, Api, Data){
	$scope.profesor = Data.profesor;
	$scope.profesor.fullname = $scope.profesor.nombres + ' ' + $scope.profesor.apellidos;
	Api.Permuta.getPermutas.query(
		{email: Data.profesor.email},
		function(data){
			Data.permuta = data[0];
			$scope.permuta = data[0];
			console.log('$scope.permuta.destinos: ');
			console.log($scope.permuta.destinos);
			console.log('success');
			console.log(data[0]);
		},
		function(data){
			console.log('error');
			console.log(data);
		}
	);

	$scope.handlerAgregarDestino = function(destino){
		console.log('Destino Agregar');
		console.log('departamentoDestino: ' + $scope.departamentoDestino);
		console.log('distritoDestino: ' + $scope.distritoDestino);

		$scope.permuta.destinos.push({
			departamento: $scope.departamentoDestino,
			distrito: $scope.distritoDestino
		});

		console.log('$scope.permuta.destinos.length: ' + $scope.permuta.destinos.length);

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
		console.log('Destino Eliminar');
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