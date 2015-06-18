var express = require('express');
var router = express.Router();
var secrets = require('secrets.js');

router.get('/:id', function(req, res, next) {
  var games = req.db.get('games');	
  games.findOne({ ref: req.params.id }, function(err, game) {
  	if(err) throw err;
  	if(game != null) {
  		games.find({gameId: req.params.id, isScanned: true}, function(err, doc) {
  			if(err) throw err;
  			res.render('index', { title: 'LOG IN', id: req.params.id, percent: (doc.length / game.threshold) * 100 });	
  		});
  	} else {
  		res.sendStatus(404);
  	}
  });
});

router.get('/secret/:id', function(req, res, next) { 
  var games = req.db.get('games');  
  games.findOne({ ref: req.params.id }, function(err, game) {
    if(err) throw err;
    if(game != null) {
       games.find({gameId: req.params.id, isScanned: true}, function(err, doc) {
        if(err) throw err;
        if(doc.length >= game.threshold) {
          var shares = doc.map(function(part) {return part.share});
          var secret = secrets.hex2str(secrets.combine(shares));
          res.render('secret', {title: 'SECRET', secret: secret});
        } else {
          res.sendStatus(403);    
        }
      }); 
    } else {
      res.sendStatus(404);
    }
  });
});

module.exports = router;
