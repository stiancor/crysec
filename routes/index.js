var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:uuid', function(req, res, next) {
  res.render('index', { title: 'RESTRICTED ACCESS', uuid: req.param("uuid") });
});

module.exports = router;
