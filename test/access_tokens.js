// var request = require('supertest');
// var should = require('should');
// var app = require('../app');
// var mongoose = require('mongoose');
// var tokenValue;


// function Profesor(email, password, nombres, apellidos) {
//   this.email = email;
//   this.password = password;
//   this.nombres = nombres;
//   this.apellidos = apellidos;
// }

// profesor = new Profesor(
//   'pedro.fernandez@gmail.com'
//   , 'Bolivia2014'
//   , 'Pedro'
//   , 'Fernandez'
// );

// profesor.departamento = 'Cochabamba';

// describe('API Access Token', function(){
//   // beforeEach(function(done){
//   //   //insert a profesor
//   // });

//     describe('POST /api/profesores', function(){
//       describe('when creating a profesor', function(){
//         it('should return a new profesor', function(done){
//           request(app)
//               .post('/api/profesores')
//               .send(profesor)
//               .expect(200)
//               .expect('Content-Type', /json/)
//               .end(function(err, res){
//                 if (err) {
//                   done(err);
//                 } else {
//                   var profesorReturned = JSON.parse(res.text);
//                   profesorReturned.should.have.property('email', profesor.email);
//                   profesorReturned.should.have.property('nombres', profesor.nombres);
//                   profesorReturned.should.have.property('apellidos', profesor.apellidos);

//                   request(app)
//                     .post('/auth/token')
//                     .send({
//                       email: profesor.email,
//                       password: profesor.password
//                     })
//                     .expect(200)
//                     .end(function(err, res){
//                       if(err) {
//                         done(err);
//                       } else {
//                         var accessToken = JSON.parse(res.text);
//                         token1 = accessToken.token;
//                         done();  
//                       }
//                     });
//                 }
//               });
//         });
//       });
//   });

//   //create a token
//   describe('POST /auth/token', function(){
//     describe('when requesting a token', function(){
//       it('should return a new token genereted for the profesor', function(done){
//         request(app)
//           .post('/auth/token')
//           .send({
//             email: profesor.email,
//             password: profesor.password
//           })
//           .expect(200)
//           .end(function(err, res){
//             if (err) {
//               done(err);
//             } else {
//               var accessTokenGenerated = JSON.parse(res.text);
//               tokenValue = accessTokenGenerated.token;
//               accessTokenGenerated.should.have.property('userEmail', profesor.email);  
//               done();
//             }
//           });
//       });  
//     });
//   });

//   describe('POST /auth/token', function(){
//     describe('when requesting a token', function(){
//       it('should return an error since a profesor invalid is sent', function(done){
//         request(app)
//           .post('/auth/token')
//           .send({})
//           .expect(400)
//           .end(function(err, res){
//             if (err) {
//               done(err);
//             } else {
//               done();
//             }
//           });
//       });
//     });
//   });

//   describe('GET /api', function(){
//     describe('when using a service sending the token', function(){
//       it('should be working ok', function(done){
//         request(app)
//           .get('/api')
//           .set('token', tokenValue)
//           .expect(200)
//           .end(function(err, res){
//             if (err) {
//               done(err);
//             } else {
//               done();
//             }
//           });
//       });
//     });
//   });

//   describe('GET /api', function(){
//     describe('when using a service sending the token', function(){
//       it('should be returning an error since a invalid token was sent', function(done){
//         request(app)
//           .get('/api')
//           .set('token', 'invalid token')
//           .expect(404)
//           .end(function(err, res){
//             if (err) {
//               done(err);
//             } else {
//               done();
//             }
//           });
//       });
//     });
//   });

//   after(function(done){
//     mongoose.connections[0].collections['Profesores'].drop(function(err){
//       mongoose.connections[0].collections['AccessTokens'].drop(function(err){
//         if (err) {
//           done(err);
//         } else {
//           done();
//         }
//       });
//     });
//   });

// });