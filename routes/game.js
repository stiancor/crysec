var express = require('express');
var secrets = require('secrets.js');
var router = express.Router();
var validate = require('../validators/game/new.js');

router.get('/new', function(req, res, next) {
  res.render('game/new', {errors: {}});
});

router.post('/create', function(req, res, next) {
  var validated = validate(req, res);
  if (Object.keys(validated.errors).length === 0) {
  	res.json({token: "accepted", percentage: 50});	
  } else {
    res.render('game/new', validated);	
  }
});

router.get('/show', function(req, res, next) {
  res.json({token: "accepted", percentage: 50});
});

router.post('/concede', function(req, res, next) {
  res.json({token: "accepted", percentage: 50});
});

module.exports = router;