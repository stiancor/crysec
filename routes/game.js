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
    var shares = secrets.share(secrets.str2hex(v.secret), parseInt(v.parties), parseInt(v.threshold));    
    var secretRef = secrets.random(128);

    var game = {name: req.body.name, parties: req.body.parties, threshold: req.body.threshold, active: false, ref: secretRef}
    var shares = shares.map(function(obj){
    	return {share: obj, gameId: secretRef}
    });
    var dataToSave = [game].concat(shares);

    var games = req.db.get('games');
    games.insert(dataToSave, function (err, doc) {
  		if (err) throw err;
	});

  	res.redirect('show/' + secretRef);	
  } else {
    res.render('game/new', v);	
  }
});

router.get('/create', function(req, res, next) {
  res.redirect('new');
});

router.get('/show/:id', function(req, res, next) {
  var games = req.db.get('games');
  games.findOne({ ref: req.params.id }, function(err, doc) {
  	if (err) 
  		throw err;
  	res.render('game/show', doc);
  });    
});

router.post('/concede', function(req, res, next) {
  res.json({token: "accepted", percentage: 50});
});

module.exports = router;