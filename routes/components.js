var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('components', { title: 'Ux Components' });
});

module.exports = router;
