/**
 * Lockout.js
 *
 * @description :: Lockout Item
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var moment = require('moment');

module.exports = {

  attributes: {
    bsuid: {
      type: 'string',
      required: true
    },
    hall: {
      type: 'string',
      required: true
    },
    //A User object
    createdBy: {
      type: 'object',
      required: true
    },
    createdAt: {
      type: 'datetime'
    },
    updatedAt: {
      type: 'datetime'
    },
    _id: {
      type: 'string'
    }
  }
};