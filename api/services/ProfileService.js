var request = require('request');

module.exports = {

  validateUser: function (authHeader) {

    return new Promise(function (resolve, reject) {
      request({
        method: 'GET',
        url: sails.config.profileService.url + '/user',
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
  }


};