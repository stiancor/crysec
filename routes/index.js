var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res, next) {
  res.render('index', { title: 'LOG IN', uuid: req.params.id });
});

module.exports = router;
