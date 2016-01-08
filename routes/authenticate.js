var express = require('express');
var router = express.Router();
var sessionHandler = require('../core/session');

//config object is passed on to ejs view
var config = {
    title: 'CIAO',
    page: 'pages/login.ejs',
    scripts: [
        '/javascripts/bundle_login.js'
    ],
    data: {}

};

/* GET login page*/
router.get('/login', function (req, res, next) {
    res.render(process.env.NODE_ENV+'_template', config);
});

router.post('/logout', function (req, res, next) {

    req.session.destroy();
    res.status(200)
        .send({next: "/authenticate/login"})
        .end();
});

/* POST user auth. */
router.post('/login', function(req, res, next) {

    var username = req.body.username;
    var password = req.body.password;
    // scope not mandatory but supported through login POST service
    var scope = (req.body.scope)? req.body.scope: null;
    var callback = {

        success: function () {

            var isAdmin = false;
            var next = "";
            try {
                req.session.roles.forEach((role) => {
                    if(role.name == 'admin') {
                        isAdmin = true;
                    }
                });
            } catch(err){}
            if (isAdmin) {
                next = '/admin';
            }else {
                next = '/tenant';
            }
            req.session.isAdmin = isAdmin;
            res.status(200)
                .send({next: next})
                .end();

        },
        fail: function (resp) {
            console.log(resp);
            if(resp) {
                res.status(resp.error.code)
                    .send(resp.error)
                    .end();
            } else {
                res.status(500)
                    .end();
            }
        }
    };

    var bundle = {
        username:username,
        password:password
    };
    sessionHandler.getToken(req,
                            res,
                            bundle,
                            scope, callback);

});

module.exports = router;
