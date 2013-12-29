var request = require('supertest');
var app = require('../server.js');
var mongoose = require('mongoose');
var should = require('should');
var config = require('../config');
var connection = mongoose.connection;

describe('Profesor', function(){

    describe('POST /profesores (save profesor)', function(){
    this.timeout(50000);
    it('should save the profesor and responds with a json success message', function(done){
      request(app)
        .post('/api/profesores')
        .send({
          email: 'santiago.balderrama@gmail.com', 
          password: 'porotos2014'
        })
        .end(function(err, res){
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('GET /profesores (get profesor by his email)', function(){
    this.timeout(5000);
    it('should get a profesor by a email given with a json success message', function(done){
      request(app)
	.get('/api/profesores/santiago.balderrama@gmail.com')
	.end(function(err, res){
	  res.should.have.status(200);
	  done();
	});
    });
  });

  describe('PUT /profesores (update profesor by his email)', function(){
    this.timeout(5000);

    it('should update an profesor with a json sucess message', function(done){
      request(app)
        .put('/api/profesores')
        .send({
          email: 'santiago.balderrama@gmail.com',
          nombres: 'Santiago',
          apellidos: 'Balderrama Carrasco', 
          celular: '76345345',
          especialidad: 'Matematicas',
          item: {
            cargo: 'Profesor Primaria',
            turno: 'Maniana', 
            departamento: 'Cochabamba',
            distrito: 'Tiquirani',
            horasTrabajo: '96'
          }
        })
        .end(function(err, res){
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('GET /profesores (get a profesor by his email)', function(){
    this.timeout(5000);
    
    it('should get a profesor and verify if its name is Santiago ', function(done){
      request(app)
        .get('/api/profesores/santiago.balderrama@gmail.com')
        .end(function(err, res){
	    //res.should.equal('Santiago');
          res.body.nombres.should.equal('Santiago');
          done();          
        });
    });
  });

  after(function(done){
    connection.db.dropCollection('profesors', function(){
    connection.close(function(){
        done();
      });
    });
  });
});
