var crypto = require('crypto');

function encryptPassword(password, salt){
	console.log('inside utils');
	console.log('password: ' + password);
	console.log('salt: ' + salt);	
	return crypto.createHmac('sha1', salt).update(password).digest('hex');
}

function createSalt(){
	return crypto.randomBytes(32).toString('base64');
}

function getImportantPropertiesOfProfesor(profesor){
	return {
      nombres: profesor.nombres,
      apellidos: profesor.apellidos,
      email: profesor.email,
      celular: profesor.celular,
      especialidad: profesor.especialidad,
      item:{
      	cargo: profesor.item.cargo,
      	turno: profesor.item.turno,
      	departamento: profesor.item.departamento,
      	distrito: profesor.item.distrito,
      	horasTrabajo: profesor.item.horasTrabajo
      }
    };
}

module.exports = {
	encryptPassword: encryptPassword,
	createSalt: createSalt,
	getImportantPropertiesOfProfesor: getImportantPropertiesOfProfesor
}