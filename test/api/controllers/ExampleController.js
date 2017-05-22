'use strict'

//TODO: Adjust this per service

var chai = require('chai');
let should = chai.should();
var chaiHttp = require('chai-http');
var request = require('request');

chai.use(chaiHttp);


describe('Mail Controller', function() {

  describe('/POST mail/create', function() {

    var host = 'http://localhost:1337';
    var path = '/mail/create';

    var postData = {
      "subject": "Unit Test Email",
      "message": "This was called from a unit test",
      "service": "calender service",
      "emails": [{
        "email": "resdeskreceiveremail@gmail.com"
      }]
    }

    this.timeout(0);

    it('returns status 200', function(done) {
      chai.request(host).post(path).send(postData).end(function(error, response, body) {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('description')
        response.body.should.have.property('error').eql(false);
        response.body.should.have.property('data');
        response.body.data.should.have.property('accepted');
        response.body.data.accepted.length.should.be.eql(1);
        done();
        return;
      });
    });

  });

});
