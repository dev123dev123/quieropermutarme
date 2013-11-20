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
        .post('/profesores')
        .send({
          email: 'feyoada@brazil.com', 
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
        .get('/profesores/feyoada@brazil.com')
        .end(function(err, res){
          res.should.have.status(200);
          done();
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
  
});
