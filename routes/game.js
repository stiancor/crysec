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

    var game = req.body;
    delete game['secret']; 
    game['_id'] = secretRef;
    var shares = shares.map(function(obj){
    	return {share: obj, gameId: secretRef}
    });
    var dataToSave = [game].concat(shares);

    var games = req.db.get('games');
    games.insert(dataToSave, function (err, doc) {
  		if (err) throw err;
	});
    games.find({},{},function(e,docs) {
    	console.log(docs);
    });
  	res.redirect('show/?id=' + secrets.random(128));	
  } else {
    res.render('game/new', v);	
  }
});

router.get('/create', function(req, res, next) {	
  res.redirect('new');
});

router.get('/show', function(req, res, next) {
  console.log(req.query.id)	
  res.render('game/show', {message: req.query.id});
});

router.post('/concede', function(req, res, next) {
  res.json({token: "accepted", percentage: 50});
});

module.exports = router;