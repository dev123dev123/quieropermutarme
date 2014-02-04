var request = require('supertest');
var app = require('../app');
var mongoose = require('mongoose');
var should = require('should');
var util = require('util');
var currentDateTime = new Date();
var token1, token2, token3;

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

anotherProfesor = new Profesor(
  'wilson.balderrama@gmail.com'
  , 'Cochabamba2014'
  , 'Wilson'
  , 'Balderrama'
);

anotherProfesor.departamento = 'Cochabamba';

thirdProfesor = new Profesor(
  'gonzalo.cuevas@gmail.com'
  , 'gonazalito123'
  , 'Gonzalo'
  , 'Cuevas'
);

thirdProfesor.departamento = 'Cochabamba';

var thirdPermutaToCreate = {
  profesorEmail: thirdProfesor.email,
  createdAt: currentDateTime,
  updatedAt: currentDateTime,
  destinos: [
    {
      departamento: 'Cochabamba',
      distrito: 'Quillacollo'
    }
  ],
  origen: {
    departamento: 'Cochabamba',
    distrito: 'Morochata'
  },
  isPublished: true
}

var anotherPermutaToCreate = {
  profesorEmail: anotherProfesor.email,
  createdAt: currentDateTime,
  updatedAt: currentDateTime,
  destinos:[
    {
      departamento: 'Cochabamba',
      distrito: 'Quillacollo'
    }
  ],
  origen:
  {
    departamento: 'Cochabamba',
    distrito: 'Morochata'
  }
  ,
  isPublished: true
};

var permutaToCreate = {
  profesorEmail: profesor.email,
  createdAt: currentDateTime,
  updateAt: currentDateTime,
  destinos: 
  [
    {
      departamento: 'Cochabamba',
      distrito: 'Quillacollo'
    }
  ],
  origen:
  {
    departamento: 'Cochabamba',
    distrito: 'Morochata'
  }
  ,
  isPublished: true
};

var permutaToUpdate = {
  email: permutaToCreate.profesorEmail,
  destinos: [
    {
      departamento: 'Cochabamba',
      distrito: 'Cercado'
    },
    {
      departamento: 'Cochabamba',
      distrito: 'Quillacollo'
    },
    {
      departamento: 'Cochabamba',
      distrito: 'Cliza'
    }
  ],
  origen:
  {
    departamento: 'Cochabamba',
    distrito: 'Arani'
  }
};

describe('Permuta API', function(){
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
      it('should return a new profesor', function(done){
        request(app)
            .post('/api/profesores')
            .send(anotherProfesor)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res){
              if (err) {
                done(err);
              } else {
                var profesorReturned = JSON.parse(res.text);
                profesorReturned.should.have.property('email', anotherProfesor.email);
                profesorReturned.should.have.property('nombres', anotherProfesor.nombres);
                profesorReturned.should.have.property('apellidos', anotherProfesor.apellidos);

                request(app)
                  .post('/auth/token')
                  .send({
                    email: anotherProfesor.email,
                    password: anotherProfesor.password
                  })
                  .expect(200)
                  .end(function(err, res){
                    if(err) {
                      done(err);
                    } else {
                      var accessToken = JSON.parse(res.text);
                      token2 = accessToken.token;
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
      it('should return a new profesor', function(done){
        request(app)
            .post('/api/profesores')
            .send(thirdProfesor)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res){
              if (err) {
                done(err);
              } else {
                var profesorReturned = JSON.parse(res.text);
                profesorReturned.should.have.property('email', thirdProfesor.email);
                profesorReturned.should.have.property('nombres', thirdProfesor.nombres);
                profesorReturned.should.have.property('apellidos', thirdProfesor.apellidos);

                request(app)
                  .post('/auth/token')
                  .send({
                    email: thirdProfesor.email,
                    password: thirdProfesor.password
                  })
                  .expect(200)
                  .end(function(err, res){
                    if(err) {
                      done(err);
                    } else {
                      var accessToken = JSON.parse(res.text);
                      token3 = accessToken.token;
                      done();  
                    }
                  });
              }
            });
      });
    });
  });


  beforeEach(function(done){
    setTimeout(function (){
      mongoose.connections[0].collections['Profesores'].drop(function(err){
        mongoose.connections[0].collections['Profesores'].insert(profesor, function(err, docs){
          if (err) {
            done(err);
          }

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

          mongoose.connections[0].collections['Profesores'].insert(anotherProfesor, function(err, docs){
              if(err){
                done(err);
              }

              request(app)
                .post('/auth/token')
                .send({
                  email: anotherProfesor.email,
                  password: anotherProfesor.password
                })
                .expect(200)
                .end(function(err, res){
                  if(err) {
                    done(err);
                  } else {
                    var accessToken = JSON.parse(res.text);
                    token2 = accessToken.token;
                    done();  
                  }
                });
              mongoose.connections[0].collections['Profesores'].insert(thirdProfesor, function(err, docs){
                if(err){
                  done(err);
                }

                request(app)
                  .post('/auth/token')
                  .send({
                    email: thirdProfesor.email,
                    password: thirdProfesor.password
                  })
                  .expect(200)
                  .end(function(err, res){
                    if(err) {
                      done(err);
                    } else {
                      var accessToken = JSON.parse(res.text);
                      token3 = accessToken.token;
                      done();  
                    }
                  });

                done();
              });
            });
          });
      });  
    }, 3000);
  });

  describe('POST /api/permutas', function(){
    describe('when creating a permuta', function(){
      it('should return a new permuta', function(done){
        request(app)
          .post('/api/permutas')
          .send(permutaToCreate)
          .expect(200)
          .set('token', token2)
          .expect('Content-Type', /json/)
          .end(function(err, res){
            if (err) {
              done(err);
            } else {
              var permutaCreated = JSON.parse(res.text);
              permutaCreated.should.have.property('profesorEmail', permutaToCreate.profesorEmail);
              done();
            }
          });
      });  
    });
  });

  describe('POST /api/permutas', function(){
    describe('when creating a permuta', function(){
      it('should return a new permuta', function(done){
        request(app)
          .post('/api/permutas')
          .send(anotherPermutaToCreate)
          .expect(200)
          .expect('Content-Type', /json/)
          .set('token', token1)
          .end(function(err, res){
            if (err) {
              done(err);
            } else {
              var permutaCreated = JSON.parse(res.text);
              permutaCreated.should.have.property('profesorEmail', anotherPermutaToCreate.profesorEmail);
              done();
            }
          });
      });  
    });
  });

  describe('POST /api/permutas', function(){
    describe('when creating a permuta', function(){
      it('should return a new permuta', function(done){
        request(app)
          .post('/api/permutas')
          .send(thirdPermutaToCreate)
          .expect(200)
          .expect('Content-Type', /json/)
          .set('token', token3)
          .end(function(err, res){
            if (err) {
              done(err);
            } else {
              var permutaCreated = JSON.parse(res.text);
              permutaCreated.should.have.property('profesorEmail', thirdPermutaToCreate.profesorEmail);
              done();
            }
          });
      });  
    });
  });

  describe('POST /api/permutas', function(){
    describe('when creating a permuta', function(){
      it('should not saved anything because it is not sending a email valid', 
      function(done){
        request(app)
          .post('/api/permutas')
          .send({
            profesorEmail: 'w@w.com'
          })
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

  describe('POST /api/permutas', function(){
    describe('when creating a permuta', function(){
      it('should not saved anything since it is sending empty data to the request',
        function(done){
          request(app)
            .post('/api/permutas')
            .send({})
            .expect(400)
            .set('token', token2)
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

  describe('PUT /api/permutas', function(){
    describe('when updating a permuta', function(){
      it('should update the permuta', function(done){
        request(app)
          .put('/api/permutas')
          .send(permutaToUpdate)
          .expect(200)
          .expect('Content-Type', /json/)
          .set('token', token1)
          .end(function(err, res){
            if (err) {
              done(err);
            } else {
              var permutaUpdated = JSON.parse(res.text);
              permutaUpdated.should.have.property('profesorEmail', permutaToUpdate.email);
              // permutaUpdated.destinos.should.have.property('length', permutaToUpdate.destinos.length);  
              done();
            }
          });
      });
    });
  });

  describe('GET /api/profesores/:email/permutas', function(){
    describe('when requesting permuta of a profesor', function(){
      it('should return the total of permutas of a profesor has', function(done){
        request(app)
          .get('/api/profesores/' + permutaToUpdate.email + '/permutas')
          .expect(200)
          .expect('Content-Type', /json/)
          .set('token', token2)
          .end(function(err, res){
            if (err) {
              done(err);
            } else {
              var permutaReturned = JSON.parse(res.text)[0];
              // permutaReturned.should.have.property('destinos').with.lengthOf(permutaToUpdate.destinos.length);
              // for (var i = permutaReturned.destinos.length - 1; i >= 0; i--) {
              //   permutaReturned.destinos[i].should.have.property('departamento', permutaToUpdate.destinos[i].departamento);
              //   permutaReturned.destinos[i].should.have.property('distrito', permutaToUpdate.destinos[i].distrito);
              // };              
              done();
            }
          });
      });
    });
  });

  describe('GET /api/profesores/:email/permutas', function(){
    describe('when requesting permuta of a profesor', function(){
      it('should return the total of permutas of a profesor has', function(done){
        request(app)
          .get('/api/profesores/' + anotherPermutaToCreate.profesorEmail + '/permutas')
          .expect(200)
          .expect('Content-Type', /json/)
          .set('token', token3)
          .end(function(err, res){
            if (err) {
              done(err);
            } else {
              var permutaReturned = JSON.parse(res.text)[0];
              // permutaReturned.should.have.property('destinos').with.lengthOf(permutaToUpdate.destinos.length);
              // for (var i = permutaReturned.destinos.length - 1; i >= 0; i--) {
              //   permutaReturned.destinos[i].should.have.property('departamento', permutaToUpdate.destinos[i].departamento);
              //   permutaReturned.destinos[i].should.have.property('distrito', permutaToUpdate.destinos[i].distrito);
              // };              
              done();
            }
          });
      });
    });
  });

  describe('GET /api/profesores/:email/permutas', function(){
    describe('when requesting permuta of a profesor', function(){
      it('should return an error 400 http error code because an email not valid was sent', function(done){
        request(app)
          .get('/api/profesores/slkadfj3f1/permutas')
          .expect(400)
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

  describe('GET /api/profesores/:email/permutas', function(){
    describe('when requesting permuta of a profesor', function(){
      it('should return an error 400 http error code since an email that not exists in the db was sent', function(done){
        request(app)
          .get('/api/profesores/notexists@gmail.com/permutas')
          .expect(404)
          .set('token', token2)
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

  describe('GET /api/permutas', function(){
    describe('when requesting permutas of all profesores', function(){
      it('should return all the permutas posted by profesores', function(done){
        request(app)
          .get(util.format('/api/permutas?origenDepartamento=%s&origenDistrito=%s&destinoDepartamento=%s&destinoDistrito=%s',
            'Cochabamba','Morochata','Cochabamba','Quillacollo'))
          .expect(200)
          .expect('Content-Type', /json/) 
          .set('token', token3)
          .end(function(err, res){
            if(err){
              done(err);
            } else {
              var permutasReturned = JSON.parse(res.text);
              permutasReturned.should.not.be.empty;
              // for (var i = permutasReturned.length - 1; i >= 0; i--) {
              //   permutasReturned[i].destino.should.have.property('distrito', 'Quillacollo');
              // };
              done();
            }
          });
      });
    });
  });

  after(function(done){
    mongoose.connections[0].collections['Permutas'].drop(function(){
      mongoose.connections[0].collections['Profesores'].drop(function(){
        mongoose.connections[0].collections['AccessTokens'].drop(function(){
          done();
        });
      });
    });
  });

});
