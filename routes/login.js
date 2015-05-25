var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  var token = req.body.token;
  var id = req.body.uuidCode;
  var games = req.db.get('games');

  games.findOne({ ref: req.body.uuidCode }, function(err, game) {
  	if(err) throw err;
  	if(game == null) {
  		res.sendStatus(404);
  	} else {
  		games.findAndModify({gameId: id, tagRef: token}, {$set: {isScanned: true}}, function(err, doc) {
  		console.log(doc);
  			games.find({gameId: id, isScanned: true}, function(err, doc) {
  				res.render('game/progress', {percent: ((doc.length) / game.threshold)*100})
  			})
  		});		
  	}
  });
});

module.exports = router;