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

// Get expiration time
router.get('/expires', function(req, res, next) {
    if (req.session)
        res.send({
            expires: req.session.expires
        });
    else
        res.status(403).end();
});

// Renew's current session by getting a new token
router.post('/renew', function(req, res, next) {

    var callback = {
        success: function() {

            var isAdmin = false;
            var next = "";
            try {
                req.session.roles.forEach((role) => {
                    if (role.name == 'admin') {
                        isAdmin = true;
                    }
                });
            } catch (err) {}

            res.status(200)
                .send({
                    "message": "Token renewed"
                })
                .end();

        },
        fail: function(err) {
            if (process.env.NODE_ENV != 'production') {
                console.log(err);
            }
            res.status(500)
                .send(err ? err : {
                    error: "Unknown error"
                })
                .end();
        }
    };

    var id = req.session.activeTenant.id;
    var bundle = {
        "username":req.session.username,
        "password": req.session.password,
         "method": "password"
        // "user_id": req.session.user_uuid,
        //"token": req.session.token
    };
    // seems to work on token method but doesn't renew well
    // var bundle = {
    //     "username":req.session.username,
    //     //"password": req.session.password
    //      "method": "token",
    //     // "user_id": req.session.user_uuid,
    //     "token": req.session.token
    // };
    console.log("getting token with:", bundle, id, callback);
    sessionHandler
        .getToken(req, res, bundle, id, callback);
    console.log("session", req.session);
});

/* GET login page*/
router.get('/login', function(req, res, next) {
    res.render(process.env.NODE_ENV + '_template', config);
});

router.post('/logout', function(req, res, next) {

    res.status(200)
        .send({
            next: "/authenticate/login"
        });
    req.session.destroy();
});

/* POST user auth. */
router.post('/login', function(req, res, next) {

    var username = req.body.username;
    var password = req.body.password;
    // scope not mandatory but supported through login POST service
    var scope = (req.body.scope) ? req.body.scope : null;
    var callback = {

        success: function() {

            var isAdmin = false;
            var next = "";
            try {
                req.session.roles.forEach((role) => {
                    if (role.name == 'admin') {
                        isAdmin = true;
                    }
                });
            } catch (err) {}
            if (isAdmin) {
                next = '/admin';
            } else {
                next = '/tenant';
            }
            req.session.isAdmin = isAdmin;
            res.status(200)
                .send({
                    next: next
                })
                .end();

        },
        fail: function (err) {
            for (var error in err) {
                var status = ['EHOSTDOWN',
                              'ETIMEDOUT',
                              'ECONNREFUSED',
                              'EHOSTUNREACH']
                        .indexOf(err[error].code) >= 0 ? 503 : 401;
            }
            if (process.env.NODE_ENV != 'production') {
                console.log(err);
            }
            if (err.error.title === undefined)
                err.error.title = err.error.title = "A '"
                + err.error.code
                +"' has ocurred";
            res.status(status)
                .send(err?err:{error: "Unknown error"})
                .end();
        }
    };

    var bundle = {
        username: username,
        password: password
    };
    sessionHandler.getToken(req,
        res,
        bundle,
        scope, callback);

});

module.exports = router;
