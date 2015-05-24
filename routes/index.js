var express = require('express');
var router = express.Router();

router.get('/:uuid', function(req, res, next) {
  res.render('index', { title: 'LOG IN', uuid: req.param("uuid") });
});

module.exports = router;
