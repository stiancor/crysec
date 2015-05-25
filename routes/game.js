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

    var game = {name: req.body.name, parties: parseInt(req.body.parties), threshold: parseInt(req.body.threshold), connectedParties: 0, ref: secretRef}
    var shares = shares.map(function(obj){
    	return {share: obj, gameId: secretRef, tagRef: ''}
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
  	if(doc != null) {
  	  doc.percent = doc.connectedParties / doc.parties * 100;	
  	  res.render('game/show', doc);
  	}  
    else 
      res.sendStatus(404);
  });    
});

router.post('/concede', function(req, res, next) {
  var games = req.db.get('games');
  games.findOne({ ref: req.body.uuidCode }, function(err, game) {
  	if (err) 
  		throw err;
  	if(game != null) {
  	  	if(game.parties > game.connectedParties) {
  			games.find({gameId: game.ref}, function(err, doc) {
  		  	if (err)
      	    	throw err;
      	  	var connectedTags = doc.filter(function(obj) {return obj.tagRef.length > 0}).length;
      	  	if(doc.filter(function(obj) {return obj.tagRef === req.body.token}).length < 1 && connectedTags < game.parties) {
      	    	var firstNotConnected = doc.filter(function(obj) {return obj.tagRef === ''})[0];
      			firstNotConnected.tagRef = req.body.token;
      			games.update({_id: firstNotConnected._id}, {$set: firstNotConnected}, function(err, doc) {
      		  		if(err) 
      		    		throw err;      		
      		    	game.connectedParties++;	   
      		    	games.update({_id: game._id}, {$set: game}, function(err,doc){
      		    		if(err) throw error;
      		    		res.render('game/progress', {percent: ((game.connectedParties) /game.parties)*100})
      		    	});	
      			});
      		} else {
      			res.render('game/progress', {percent: (game.connectedParties/game.parties)*100})
      		}	
  			});	
  		} 
  		else res.render('game/progress', {percent: 100})
  	} 
  	else res.sendStatus(404);
  });    
});

module.exports = router;