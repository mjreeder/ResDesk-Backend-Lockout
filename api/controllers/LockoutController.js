/**
 * LockoutController
 *
 * @description ::
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';
var util = require('util');
var ProfileService = require('../services/ProfileService.js');
var DirectoryService = require('../services/DirectoryService.js');
var Parser = require('../services/Parser.js');
var LockoutHelper = require('../services/LockoutHelper.js');
var responseFormatter = require('../../helpers/format-response.js');
var moment = require('moment');


module.exports = {

  getAll: function (req, res) {
    var authHeader = req.swagger.params.Authorization.value;

    //2: Get the lockouts for the activeHall
    var getLockoutsForHall = function (hall, authHeader) {
      LockoutHelper.getLockoutsWithCount({
        hall: hall
      }).then(function (data) {
        var response = responseFormatter.success("Lockouts for " + hall, data);
        return res.status(response.status).json(response);
      }).catch(function (error) {
        var errResponse = responseFormatter.fail("Lockouts getAll error", error, 500)
        return res.status(errResponse.status).json(errResponse);
      });
    };


    //1: Validate the user and use their activeHall
    ProfileService.validateUser(authHeader)
      .then(function (user) {

        var hall = Parser.hallParser(user.term_detail);
        getLockoutsForHall(hall);

      }, function (error) {

        if (error.status) {
          return res.status(error.status).json(error);
        }
        var errResponse = responseFormatter.fail("Profile Service request error", error, 500)
        return res.status(errResponse.status).json(errResponse);
      });

  },

  getRecent: function (req, res) {
    var authHeader = req.swagger.params.Authorization.value;
    var recent = moment().subtract(7, 'days');

    //1: Validate the user and use their activeHall
    ProfileService.validateUser(authHeader)
      .then(function (user) {

        var hall = Parser.hallParser(user.term_detail);
        LockoutHelper.getRecentLockoutsWithCount(recent, {
            hall: hall
          }, authHeader)
          .then(function (data) {
            var response = responseFormatter.success("Lockouts for " + hall, data);
            return res.status(response.status).json(response);
          }).catch(function (error) {
            var errResponse = responseFormatter.fail("Lockouts getRecent error", error, 500)
            return res.status(errResponse.status).json(errResponse);
          });

      }, function (error) {

        if (error.status) {
          return res.status(error.status).json(error);
        }
        var errResponse = responseFormatter.fail("Profile Service request error", error, 500)
        return res.status(errResponse.status).json(errResponse);
      });



  },

  createLockout: function (req, res) {

    var authHeader = req.swagger.params.Authorization.value;
    var bsuid = req.swagger.params.PostBody.value.bsuid;

    //1: Lookup the student
    DirectoryService.getById(bsuid, authHeader)
      .then(function (user) {

        //TODO: Correct this, don't use term detail
        var hall = Parser.hallParser(user.term_detail);

        //2: Create the Lockout using the student's id and hall, and the request user
        Lockout.create({
          bsuid: bsuid,
          hall: hall,
          createdBy: user
        }).exec(function (err, result) {
          if (err) {
            return res.serverError(responseFormatter.fail("Server Error", err, 500));
          }

          var response = responseFormatter.success("Lockout added", result, 200);
          return res.status(response.status).json(response);
        });



      }, function (error) {

        if (error.status) {
          return res.status(error.status).json(error);
        }
        var errResponse = responseFormatter.fail("Directory Service request error", error, 500)
        return res.status(errResponse.status).json(errResponse);
      });

  },

  getById: function (req, res) {

    var authHeader = req.swagger.params.Authorization.value;
    var lockoutId = req.swagger.params.id.value;

    ProfileService.validateUser(authHeader)
      .then(function (user) {
        Lockout.findOne({
          id: lockoutId
        }).exec(function (err, lockout) {
          if (err) {
            return res.serverError(responseFormatter.fail("Server Error", err, 500));
          }

          if (!lockout) {
            return res.badRequest(responseFormatter.fail("Lockout not found", {
              lockoutId: lockoutId
            }, 400));
          }

          LockoutHelper.mapLockoutsToUser([lockout], authHeader)
            .then(function (results) {
              lockout = results[0];
              var response = responseFormatter.success("Lockout found", lockout, 200);
              return res.status(response.status).json(response);

            }).catch(function (error) {
              if (error.status) {
                return res.status(error.status).json(error);
              }
              var errResponse = responseFormatter.fail("Directory Service request error", error, 500)
              return res.status(errResponse.status).json(errResponse);
            });

        });


      }, function (error) {

        if (error.status) {
          return res.status(error.status).json(error);
        }
        var errResponse = responseFormatter.fail("Profile Service request error", error, 500)
        return res.status(errResponse.status).json(errResponse);
      });

  },

  getByUser: function (req, res) {

    var authHeader = req.swagger.params.Authorization.value;
    var userId = req.swagger.params.bsuid.value;

    ProfileService.validateUser(authHeader)
      .then(function (user) {
        Lockout.find({
          bsuid: userId
        }).exec(function (err, lockouts) {
          if (err) {
            return res.serverError(responseFormatter.fail("Server Error", err, 500));
          }

          if (lockouts.length == 0) {
            var response = responseFormatter.success("Lockouts for User " + userId, lockouts, 200);
            return res.status(response.status).json(response);
          }


          DirectoryService.getById(userId, authHeader)
            .then(function (user) {

              lockouts.forEach(function (lockout) {
                lockout.user = user;
              });
              
              var response = responseFormatter.success("Lockouts for User " + userId, lockouts, 200);
              return res.status(response.status).json(response);

            }).catch(function (error) {
              if (error.status) {
                return res.status(error.status).json(error);
              }
              var errResponse = responseFormatter.fail("Directory Service request error", error, 500)
              return res.status(errResponse.status).json(errResponse);
            });

        });


      }, function (error) {

        if (error.status) {
          return res.status(error.status).json(error);
        }
        var errResponse = responseFormatter.fail("Profile Service request error", error, 500)
        return res.status(errResponse.status).json(errResponse);
      });

  },

  deleteLockout: function (req, res) {

    var authHeader = req.swagger.params.Authorization.value;
    var lockoutId = req.swagger.params.id.value;

    ProfileService.validateUser(authHeader)
      .then(function (user) {
        //TODO: FIX!! Currently deletes all
        //TODO: if !user.admin, abort
        Lockout.destroy({
          id: lockoutId
        }).exec(function (err, deleted) {
          if (err) {
            return res.serverError(responseFormatter.fail("Server Error", err, 500));
          }

          var success = responseFormatter.success("Deleted entry", deleted);
          return res.status(success.status).json(success);
        });

      }).catch(function (error) {
        if (error.status) {
          return res.status(error.status).json(error);
        }
        var errResponse = responseFormatter.fail("Profile Service request error", error, 500)
        return res.status(errResponse.status).json(errResponse);
      });

  }

}
