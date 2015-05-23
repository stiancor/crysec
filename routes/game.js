var express = require('express');
var secrets = require('secrets.js');
var router = express.Router();
var validate = require('../validators/game/new.js');

router.get('/new', function(req, res, next) {
  res.render('game/new', {errors: {}});
});

router.post('/create', function(req, res, next) {
  var v = validate(req, res);
  if (Object.keys(v.errors).length === 0) {
  	var secretHex = secrets.str2hex(v.secret);
    var shares = secrets.share(secretHex, parseInt(v.parties), parseInt(v.threshold));    
  	res.json({token: "accepted", percentage: 50});	
  } else {
    res.render('game/new', v);	
  }
});

router.get('/show', function(req, res, next) {
  res.json({token: "accepted", percentage: 50});
});

router.post('/concede', function(req, res, next) {
  res.json({token: "accepted", percentage: 50});
});

module.exports = router;