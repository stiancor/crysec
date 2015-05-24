var express = require('express');

module.exports = function(req, res, next) {
  var v = {errors: {}};
  v.name = req.body.name;	
  v.secret = req.body.secret;
  v.parties = req.body.parties;
  v.threshold = req.body.threshold;
  if(v.name == undefined || v.name.length < 1) {
  	v.errors.name = 'Please supply a name';
  }
  if(v.secret == undefined || v.secret.length < 10) {
  	v.errors.secret = 'Secret needs to be at least 10 characters';
  }
  var tempPart = parseInt(v.parties);
  if(tempPart < 2 || tempPart > 10) {
  	v.errors.parties = 'Not a valid number of parties';
  }
  var tempThres = parseInt(v.threshold);
  if(tempThres < 2 || tempThres > 10) {
  	v.errors.tempThres = 'Not a valid threshold';
  }
  return v;
};

 