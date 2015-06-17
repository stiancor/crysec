var express = require('express');
var router = express.Router();
var loginPlot = require('../loginPlot.js');
events = require('events'),
serverEmitter = new events.EventEmitter();

module.exports = function(io) {

  router.post('/', function(req, res, next) {
  	var token = req.body.token;
  	var id = req.body.uuidCode;
  	var games = req.db.get('games');

  	games.findOne({ ref: id }, function(err, game) {
  		if(err) throw err;
  		if(game == null) {
  			res.sendStatus(404);
  		} else {
  			games.findAndModify({gameId: id, tagRef: token}, {$set: {isScanned: true}}, function(err, doc) {
  				games.find({gameId: id, isScanned: true}, function(err, doc) {
            if (doc.length >= game.threshold) {
              var millis = 0;
              loginPlot().forEach(function(entry) {
                 millis += entry[1];
                 console.log(entry[0]);
                 setTimeout(function() {serverEmitter.emit('successfulLogin', entry[0])}, millis) 
              });
            }
  					res.render('loginProgress', {percent: ((doc.length) / game.threshold)*100})
  				})
  			});		
  		}
  	});
  });

  io.on('connection', function (socket) {
    console.log('############## a user connected');
    serverEmitter.on('successfulLogin', function (data) {
      socket.emit('loggedIn', data);
    });
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });

  return router;
}