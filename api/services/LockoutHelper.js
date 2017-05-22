var DirectoryService = require('../services/DirectoryService.js');
var moment = require('moment');

module.exports = {
  getLockoutsWithCount: function (findOptions = {}, authHeader) {

    var prom = new Promise(function (resolve, reject) {
      Lockout.find(findOptions)
        .exec(function (err, results) {
          if (err) {
            reject(err);
            return;
          }
          
          module.exports.parseLockoutsToCount(results, authHeader)
            .then(function (parsed) {
              resolve(parsed);
            }).catch(function (error) {
              reject(error);
            });

        });
    });
    return prom;
  },
  getRecentLockoutsWithCount: function (sinceTime, findOptions = {}, authHeader) {
    if (!sinceTime) {
      sinceTime = moment().subtract(7, 'days');
    }

    findOptions.createdAt = {
      '>=': sinceTime.toDate()
    };

    var prom = new Promise(function (resolve, reject) {
      Lockout.find(findOptions)
        .exec(function (err, results) {
          if (err) {
            reject(err);
            return;
          }

          module.exports.parseLockoutsToCount(results, authHeader)
            .then(function (parsed) {
              resolve(parsed);
            }).catch(function (error) {
              reject(error);
            });

        });
    });
    return prom;
  },
  parseLockoutsToCount: function (lockouts, authHeader) {

    if (!lockouts || lockouts.length == 0) {
      return module.exports.mapLockoutsToUser([], authHeader)
    }

    var removeAtIndex = function (arr, index) {
      return arr.splice(index, 1);
    };

    var idMap = {};
    var i = 0;
    while (i < lockouts.length) {
      var lockout = lockouts[i];

      if (!idMap[lockout.bsuid]) {
        idMap[lockout.bsuid] = 1;
        i += 1;
      } else {
        idMap[lockout.bsuid] += 1;
        removeAtIndex(lockouts, i);
      }
    }

    
    lockouts.forEach(function (lockout) {
      lockout.lockouts = idMap[lockout.bsuid];
    });

    return module.exports.mapLockoutsToUser(lockouts, authHeader)
  },
  mapLockoutsToUser: function (lockouts, authHeader) {
    var idArr = [];
    lockouts.forEach(function (lockout) {
      if (idArr.indexOf(lockout.bsuid) == -1) {
        idArr.push("" + lockout.bsuid);
      }
    });

    var prom = new Promise(function (resolve, reject) {
      
      if (idArr.length == 0) {
        return resolve([]);
      }
      
      DirectoryService.getUsersForIds(idArr, authHeader)
        .then(function (responseBody) {

          if (responseBody.data.length == 0) {
            reject(new Error("ID Mapping returned empty"));
            return;
          }

          for (var i = 0; i < lockouts.length; i++) {
            var lockout = lockouts[i];
            for (var j = 0; j < responseBody.data.length; j++) {
              var user = responseBody.data[j];
              if (lockout.bsuid == user.bsu_id) {
                lockout.user = user;
                lockout.createdAt = undefined;
                lockout.updatedAt = undefined;
              }
            }
          }
          resolve(lockouts);
        }).catch(function (error) {
          reject(error);
        });
    });


    return prom;
  }
}