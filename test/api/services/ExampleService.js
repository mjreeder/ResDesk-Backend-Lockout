'use strict';

//TODO: Adjust this per service

var expect = require("chai").expect;
var mailService = require("../../../api/services/MailService.js");
var config = require('../../../config/env/development.js');

var postData = {
  "subject": "Unit Test Email",
  "message": "This was called from a unit test",
  "service": "Calender Service",
  "emails": [
    {"email": "resdeskreceiveremail@gmail.com"},
    {"email": "resdeskmailer@gmail.com"}
  ]
}

describe("Mail Service", function() {
  describe("Validate Params", function() {
    it("Subject, message, service all exist and all emails have valid format", function() {
      var valid = mailService.validParams(postData);
      expect(valid).to.equal(true);
    });
  });

  describe("Get Mail Options", function() {
    var mailOptions = mailService.getMailOptions(postData);
    it("Converts email array to string", function() {
      expect(mailOptions.to).to.equal("resdeskreceiveremail@gmail.com,resdeskmailer@gmail.com");
    });
    it("Maps Subject", function() {
      expect(mailOptions.subject).to.equal("Unit Test Email");
    });
    it("Maps Service to From", function() {
      expect(mailOptions.from).to.equal("Calender Service");
    });
    it("Maps Message to Text", function() {
      expect(mailOptions.text).to.equal("This was called from a unit test");
    });
    it("Maps Config Email to Sender", function() {
      expect(mailOptions.sender).to.equal(config.sender_email);
    });
  })
});
