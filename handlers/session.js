/* Copyright (c) 2017 Intel Corporation

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
// Core session policy handler for CIAO UI

 var sessionHandler = {

     configSession: function (req, res, next) {
         if (!req.session.authorized) {
             req.session.authorized = false;
         }
         next();
     },
     //Add keystone token to http requests
     addAuthToken: function (req, res, next) {
         console.log("Session Id:"+req.session.id);
         // TODO: this is a dummy
         res.append('token',req.session);
         next();
     },

     validateSession: function (req, res, next) {
         if (req.session.authorized == true)
             next();
         else {
             var config = {
                 title: 'Not authorized',
                 scripts: [],
                 data: {},
                 page: 'pages/401.ejs'
             };
             res.render('default_template',config);
         }
     },

     getCurrentUser: function (req,res,next) {

         if (!req.session.view) {
             req.session.view = { count:0 };
         }

         req.session.view.count++;
         console.log("user view counter: "+req.session.view.count);

         next();
     },

     getIdentityFile: function () {
         var file = __dirname +"/../config/identity_config.json";
         var fs = require('fs');
         var config = JSON.parse(fs.readFileSync(file, 'utf8'));
         return config;
     }
     ,
     // TODO: test this function with proper username, password,and options
     keystoneAuthenticate: function (username, pass, next) {
         var http = require('http');

         var config = this.getIdentityFile()[process.env.NODE_ENV];
         var data = this.keystoneBuildAuth(username, pass, config);

         var options = { host: config.host,
                         port: config.port,
                         method:'POST',
                         path: 'http://' + config.host  +
                         ':' + config.port +
                         config.uri,
                         headers: {
                             "Content-Length": JSON.stringify(data).length,
                             "Content-Type": "application/json"
                         }
                       };

         // Bind result object into call back for easier access to response
         var result = new function () {
             this.callback = function (response) {
                 var chunk = '';
                 response.on('data', function(c){chunk += c;});
                 response.on('end', function() {
                     this.response = response;
                     this.json = JSON.parse(chunk);
                     next(); // callback passed
                 }.bind(this));
             }.bind(this);
         };

         // Send data to keystone service
         var req = http.request(options, result.callback);
         req.write(JSON.stringify(data));
         req.end();

         return result;
     },

     // /v3/users/<user_UUID>/projects
     keystoneGetTenants: function (user_uuid, token, next) {

         var http = require('http');
         var config = this.getIdentityFile()[process.env.NODE_ENV];

         var options = { host: config.host,
                         port: config.port,
                         method:'GET',
                         path: 'http://' + config.host  +
                         ':' + config.port +
                         '/v3/users/' + user_uuid + '/projects',
                         headers: {
                             "Content-Type": "application/json",
                             "X-Auth-Token":token,
                             "X-Service-Token":token
                         }
                       };

         var result = new function () {
             this.callback = function (response) {
                 var chunk = '';
                 response.on('data', function(c){chunk += c;});
                 response.on('end', function() {
                     this.response = response;
                     this.json = JSON.parse(chunk);
                     next(); // callback passed
                 }.bind(this));
             }.bind(this);
         };

         // Send data to keystone service
         var req = http.request(options, result.callback);
         req.end();
         return result;
     },

     keystoneBuildAuth: function (username, pass, config) {
         var data = {
             auth: {
                 identity: {
                     methods: ["password"],
                     password: {
                         user: {
                             name: username,
                             domain: { id: "default" },
                             password: pass
                         }
                     }
                 }
             }
         };
         if (config.scope) {
                 data.auth.scope = config.scope;
         }
        return data;
     },

     keystoneGetUsers: function (token,next) {
         var http = require('http');
         var config = this.getIdentityFile()[process.env.NODE_ENV];

         var options = { host: config.host,
                         port: config.port,
                         method:'GET',
                         path: 'http://' + config.host  +
                         ':' + config.port +
                         '/v3/users',
                         headers: {
                             "Content-Type": "application/json",
                             "X-Auth-Token":token,
                             "X-Service-Token":token
                         }
                       };

         var result = new function () {
             this.callback = function (response) {
                 var chunk = '';
                 response.on('data', function(c){chunk += c;});
                 response.on('end', function() {
                     this.response = response;
                     this.json = JSON.parse(chunk);
                     next(); // callback passed
                 }.bind(this));
             }.bind(this);
         };

         // Send data to keystone service
         var req = http.request(options, result.callback);
         req.end();
         return result;
     }

 };


module.exports = sessionHandler;
