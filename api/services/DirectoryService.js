var request = require('request');
//require('request-debug')(request);

module.exports = {

  getById: function (bsuid, authHeader) {

    return new Promise(function (resolve, reject) {
      request({
        method: 'GET',
        url: sails.config.directoryService.url + '/students/' + bsuid,
        headers: {
          Authorization: authHeader
        }
      }, function (error, response, body) {
        if (error) {
          reject(error);
        } else {

          body = JSON.parse(body);
          if (body.status != 200) {
            reject(body);
            return;
          }

          resolve(body.data[0]);
        }
      });
    });
  },
  getUsersForIds: function (idArr, authHeader) {
    return new Promise(function (resolve, reject) {
      request({
        method: 'POST',
        url: sails.config.directoryService.url + '/students/map',
        headers: {
          Authorization: authHeader
//          "Content-Type": "application/json"
        },
        json: {
          idArray: idArr
        }
      }, function (error, response, body) {
        
        if (error) {
          reject(error);
        } else {

          if (body.status != 200) {
            reject(body);
            return;
          }
          resolve(body);
        }
      });
    });
  }

};