var express = require('express');
var secrets = require('secrets.js');
var router = express.Router();

router.get('/new', function(req, res, next) {
  res.render('game/new');
});

router.post('/create', function(req, res, next) {
  res.json({token: "accepted", percentage: 50});
});

router.get('/show', function(req, res, next) {
  res.json({token: "accepted", percentage: 50});
});

router.post('/concede', function(req, res, next) {
  res.json({token: "accepted", percentage: 50});
});

module.exports = router;