var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  var uuid = req.body.uuidCode;	
  var token = req.body.token;
  console.log(req.body)

  res.json({token: "accepted", percentage: 50});
});

module.exports = router;