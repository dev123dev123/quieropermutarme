var crypto = require('crypto');
var validator = require('validator');
var lodash = require('lodash');
var toString = Object.prototype.toString;
var config = require('../config');
var mailgun = require('mailgun-js')(config.mailgun.api_key, config.mailgun.domain);

function isString(value){
    return toString.call(value) === '[object String]';
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

function isNullOrEmpty(value){
    var isValidString = !isNull(value) && !isUndefined(value) && isString(value);
    if (isValidString) {
        return (value.trim().length === 0);
    }
    return true;
}  

function encryptPassword(password, salt){
  return crypto.createHmac('sha1', salt).update(password).digest('hex');
}

function createSalt(){
  return crypto.randomBytes(32).toString('base64');
}

function generateGenericPassword() {
  return crypto.randomBytes(8).toString('base64');
}

function hasTokenExpired(token, tokenLife){
  return (Math.round((Date.now()-token.created)/1000) > tokenLife);
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

function sendEmail(message, callback) {
  mailgun.messages.send(message, function(error, response, body) {
    if (error) {
      return callback(error, null);
    }

    callback(null, body);
  });
}

module.exports = {
  encryptPassword: encryptPassword,
  createSalt: createSalt,
  getImportantPropertiesOfProfesor: getImportantPropertiesOfProfesor,
  isNullOrEmptyString: isNullOrEmpty,
  isEmptyArray: isEmptyArray,
  isEmail: validator.isEmail,
  isNumber: lodash.isNumber,
  hasTokenExpired: hasTokenExpired,
  generateGenericPassword: generateGenericPassword,
  sendEmail: sendEmail
}