var Utils = require('./utils')
var salt = "aWj7NqpzEyghipZPuH7SRtQ0Z+FVOCL/3pVkkoLYzS8=";
var password = "Santiago"
console.log(Utils.encryptPassword(password, salt));