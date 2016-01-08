var express = require('express');
var router = express.Router();

var forbiddenConfig = {
    title: 'Forbbiden',
    page: 'pages/forbbiden.ejs',
    scripts: [
        '/javascripts/bundle_forbidden.js'
    ],
    data:{}
};

/* Forbidden page. */
router.get('/', function(req, res, next) {
    res.render(process.env.NODE_ENV+'_template', forbiddenConfig);
});

module.exports = router;
