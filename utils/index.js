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

module.exports = {
	encryptPassword: encryptPassword,
	createSalt: createSalt
}