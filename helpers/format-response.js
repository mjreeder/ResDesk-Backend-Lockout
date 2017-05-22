'use strict';

function pass(httpStatus) {
  if (!httpStatus) {
    httpStatus = 200;
  }
  this.status = httpStatus;
  this.error = false;
  this.description = "Call successful";
}

function error(httpStatus) {
  if (!httpStatus) {
    httpStatus = 500;
  }
  this.status = httpStatus;
  this.error = true;
  this.description = "Call unsuccessful";
};

var replaceResponseValues = function(val, description, data) {
  if (description) {
    val.description = description;
  }
  if (data) {
    val.data = data;
  }
  return val;
};

var format = {};

format.success = function(description, data, httpStatus) {
  return replaceResponseValues(new pass(httpStatus), description, data);
};

format.fail = function(description, data, httpStatus) {
  return replaceResponseValues(new error(httpStatus), description, data);
};

module.exports = format;
