var request = require('supertest');
var app = require('../app.js');
var mongoose = require('mongoose');
var should = require('should');
var profesor, profesorWithUpdate, token1, passwordGenerated;


function Item(){}
function Permuta(){}

function Profesor(email, password, nombres, apellidos) {
  this.email = email;
  this.password = password;
  this.nombres = nombres;
  this.apellidos = apellidos;
}

profesor = new Profesor(
  'pedro.fernandez@gmail.com'
  , 'Bolivia2014'
  , 'Pedro'
  , 'Fernandez'
);

profesor.departamento = 'Cochabamba';

profesorToUpdate = new Profesor('pedro.fernandez@gmail.com', ''
                                  , 'Alejandro', 'Castro');
profesorToUpdate.celular = 78567484;
profesorToUpdate.especialidad = 'Javascript Programmer';
profesorToUpdate.item = {
  cargo: 'Teacher',
  turno: 'Morning',
  departamento: 'Cochabamba',
  distrito: 'Cercado',
  horasTrabajo: 100
};

var profesorNewPassword = {
  email: profesor.email,
  password: profesor.password,
  newPassword: '123'
};

beforeEach(function(done){
  setTimeout(function (){
    // mongoose.connections[0].collections['Profesores'].drop(function(err){
    //   mongoose.connections[0].collections['Profesores'].insert(profesor, function(err, docs){
    //       console.log(err);
    //       profesorID = docs[0]._id; 
    //       done();
    //     });
    // }); 
    done(); 
  }, 4000);
});

describe('Profesor API', function(){
  describe('POST /api/profesores', function(){
    describe('when creating a profesor', function(){
      it('should return a new profesor', function(done){
        request(app)
            .post('/api/profesores')
            .send(profesor)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res){
              if (err) {
                done(err);
              } else {
                var profesorReturned = JSON.parse(res.text);
                profesorReturned.should.have.property('email', profesor.email);
                profesorReturned.should.have.property('nombres', profesor.nombres);
                profesorReturned.should.have.property('apellidos', profesor.apellidos);

                request(app)
                  .post('/auth/token')
                  .send({
                    email: profesor.email,
                    password: profesor.password
                  })
                  .expect(200)
                  .end(function(err, res){
                    if(err) {
                      done(err);
                    } else {
                      var accessToken = JSON.parse(res.text);
                      token1 = accessToken.token;
                      done();  
                    }
                  });
              }
            });
      });
    });
  });


  describe('POST /api/profesores', function(){
    describe('when creating a profesor', function(){
      it('should return an error because empty object was sent', function(done){
        request(app)
            .post('/api/profesores')
            .send({})
            .expect(400)
            .end(function(err, res){
              if(err){
                done(err);
              }else{
                done();
              }
            });
      });
    });
  });

  describe('POST /api/profesors/login', function(){
    describe('when logging in a profesor', function(){
      it('should log in without any problem', function(done){
        request(app)
            .post('/api/profesores/login')
            .expect(200)
            .send(profesor)
            .set('token', token1)
            .expect('Content-Type', /json/)
            .end(function(err, res){
              if (err) {
                done(err);
              } else {
                done();
              }
            });
      });
    });
  });

  describe('POST /api/profesors/login', function(){
    describe('when logging in a profesor', function(){
      it('should not log in because user that not exists was sent', function(done){
        request(app)
          .post('/api/profesores/login')
          .set('token', token1)
          .send({
            email: 'xmen@marvels.com',
            password: 'MagNetO'
          })
          .expect('Content-Type', /json/)
          .expect(401)
          .end(function(err, res){
            if (err) {
              done(err);
            } else {
              done();
            }
          });
      });
    });
  });

  describe('POST /api/profesors/login', function(){
    describe('when a profesor is logging in', function(){
      it('should not login because data sent is garbage', function(done){
        request(app)
          .post('/api/profesores/login')
          .send({})
          .set('token', token1)
          .expect(400)
          .end(function(err, res){
            if (err) {
              done(err);
            } else {
              done();
            }
          });
      });
    });
  });

  describe('PUT /api/profesores', function(){
    describe('when updating a profesor', function(){
      it('should return a profesor with the new values', function(done){
        request(app)
          .put('/api/profesores')
          .send(profesorToUpdate)
          .expect(200)
          .expect('Content-Type', /json/)
          .set('token', token1)
          .end(function(err, res){
            if (err) {
              done(err);
            } else {
              var profesorReturned = JSON.parse(res.text);
              profesorReturned.should.have.property('nombres', profesorToUpdate.nombres);
              profesorReturned.should.have.property('apellidos', profesorToUpdate.apellidos);
              profesorReturned.should.have.property('celular', profesorToUpdate.celular);
              profesorReturned.should.have.property('especialidad', profesorToUpdate.especialidad);
              profesorReturned.item.should.have.property('cargo', profesorToUpdate.item.cargo);
              profesorReturned.item.should.have.property('turno', profesorToUpdate.item.turno);
              profesorReturned.item.should.have.property('departamento', profesorToUpdate.item.departamento);
              profesorReturned.item.should.have.property('distrito', profesorToUpdate.item.distrito);
              profesorReturned.item.should.have.property('horasTrabajo', profesorToUpdate.item.horasTrabajo);
              done();
            }
          });
      });
    });
  });

  describe('PUT /api/profesores', function(){
    describe('when updating a profesor', function(){
      it('should return an error because it was not sent correct data', function(done){
        request(app)
          .put('/api/profesores')
          .send({})
          .expect(400)
          .expect('Content-Type', /json/)
          .set('token', token1)
          .end(function(err, res){
            if (err) {
              done(err);
            } else {
              done();
            }
          });
      });
    });
  });

  describe('POST /api/profesores/password/reset', function(){
    describe("when requesting to reset a profesor's password by his email", function(done){
      it("should send a 200 http status because a new password was sent to the profesor's email", function(done){
        request(app)
          .post('/api/profesores/password/reset')
          .send({
            email: profesor.email
          })
          .expect(200)
          .end(function(err, res){
            if (err) {
              done(err);
            } else {
              passwordGenerated = JSON.parse(res.text);
              profesorNewPassword.password = passwordGenerated;
              console.log('PASSWORD GENERATED !!! : ' + passwordGenerated)
              done();
            }
          });
      });
    });
  });

  describe('POST /api/profesores/password/reset', function(){
    describe("when requesting to reset a profesor's password by empty email", function(){
      it("should send a 400 http status since the email sent was empty", function(done){
        request(app)
          .post('/api/profesores/password/reset')
          .send({})
          .expect(400)
          .end(function(err, res){
            if (err) {
              done(err);
            } else {
              done();
            }
          });
      });
    });
  });
  
  describe('POST /api/profesores/password/reset', function(){
    describe("when requesting to reset a profesor's password by invalid email", function(){
      it('should send a 404 http status since the email sent was invalid', function(done){
        request(app)
          .post('/api/profesores/password/reset')
          .send({
            email: 'IamNoOne@microsoft.com'
          })
          .end(function(err, res){
            if (err) {
              done(err);
            } else {
              done();
            }
          });
      });
    });
  });

  describe('POST /api/profesores/password/change', function(){
    describe("when requesting to change a profesor's password", function(){
      it('should send a 200 http status since the profesores provided his right last password', function(done){
        request(app)
          .post('/api/profesores/password/change')
          .set('token', token1)
          .send(profesorNewPassword)
          .expect(200)
          .end(function(err, res){
            if (err) {
              done(err);
            } else {
              profesorNewPassword.password = profesorNewPassword.newPassword;
              done();
            }
          });
      });
    });
  });

  describe('POST /api/profesors/login', function(){
    describe('when logging in a profesor', function(){
      it('should log in without any problem', function(done){
        request(app)
            .post('/api/profesores/login')
            .set('token', token1)
            .send(profesorNewPassword)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res){
              if (err) {
                done(err);
              } else {
                done();
              }
            });
      });
    });
  });


  describe('GET /api/profesores/:email', function(){
    describe('when requesting a profesor by email', function(){
      it('should return a profesor with the initial values', function(done){
        request(app)
            .get('/api/profesores/' + profesor.email)
            .expect('Content-Type', /json/)
            .expect(200)
            .set('token', token1)
            .end(function(err, res){
              if(err){
                done(err);
              } else{
                var profesorReturned = JSON.parse(res.text);
                profesorReturned.should.have.property('email', profesorToUpdate.email);
                profesorReturned.should.have.property('nombres', profesorToUpdate.nombres);
                profesorReturned.should.have.property('apellidos', profesorToUpdate.apellidos);
                done();  
              }
            });
      });

      it('should not return anything because it was a email that not exits', function(done){
        request(app)
            .get('/api/profesores/' + 'notExists@gmial.com')
            .expect(404)
            .set('token', token1)
            .end(function(err, res){
              if (err) {
                done(err);
              } else {
                done();
              }
            });
      });

      it('should return an error because I am not sending any email', function(done){
        request(app)
            .get('/api/profesores/')
            .expect(404)
            .set('token', token1)
            .end(function(err, res){
              if (err) {
                done(err);
              } else {
                done();                
              }
            });
      });

      it('should return an error because I am sending garbage as parameter', function(done){
        request(app)
            .get('/api/profesores/sdfsdfdsfsvbjp')
            .expect(404)
            .set('token', token1)
            .end(function(err, res){
              if (err) {
                done(err);
              } else {
                done();
              }
            });
      });
    });
  });

  after(function(done){
    mongoose.connections[0].collections['Profesores'].drop(function(){
      mongoose.connections[0].collections['AccessTokens'].drop(function(){
        done();
      });
    });
  });
  
});


