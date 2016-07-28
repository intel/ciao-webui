var repl = require("repl");

var ciaoAdapter = require('../core/ciao_adapter');
var querystring = require('querystring');
var TokenManager = new require('../core/tokenManager');
var NodeService = require('../core/nodeService');
var TenantService = require('../core/tenantService');
var sessionHandler = require('../core/session');
var username, password, token;

process.argv.forEach((value) => {
    if (value.includes("username"))
        username = value.split("=").pop();
    if (value.includes("password"))
        password = value.split("=").pop();
});

var blockHostname = "hostname";
var blockPort = "port";
var blockProtocol = "http";

var req = {session:{}};

var bundle = {
    username: username,
    password: password
};

var adapter = new ciaoAdapter();
var tokenManager;

token = sessionHandler
    .getToken(req,
              null,
              bundle,
              null,
              { success:
                function () {
                    tokenManager = new TokenManager(sessionHandler);
                    var replServer = repl.start({
                        prompt: "ciao-webui >"
                    });

                    replServer.context.sessionHandler = sessionHandler;
                    replServer.context.req = req;
                    replServer.context.adapter = adapter;

                    var scope = function (tenant) {
                        replServer.context.project = tenant;
                        replServer.context.req.session.token =
                            sessionHandler
                            .getToken(req,
                                      null,
                                      bundle,
                                      tenant,{
                                          success: function (){},
                                          fail: function (err) {
                                              console.log(err);}
                                      });
                    };

                    replServer.context.scope = scope;
                    replServer.context.block = {};
                    replServer.context.block.adapter =
                        new ciaoAdapter(blockHostname,blockPort, blockProtocol);
                    replServer.context.block.volumes = function () {
                        return replServer.context.block.adapter.onSuccess(
                            (data) => {return data;})
                            .get("/v2/"+replServer.context.project+"/volumes",
                                 replServer.context.req.session.token);
                    };
                    replServer.context.block.createVolume = function (name,
                                                                      size) {
                        var obj = {volume: {name:name, size:size}};
                        return replServer.context.block.adapter.onSuccess(
                            (data) => {return data;})
                            .post("/v2/"+replServer.context.project+"/volumes",
                                  obj,
                                  replServer.context.req.session.token);
                    };

                    var tenants = sessionHandler
                            .keystoneGetTenants(
                                req.session.user_uuid,
                                req.session.token,
                                function(){
                                    replServer.context.tenants =
                                        tenants.json.projects.map(
                                            (x) => {
                                                return {id:x.id,name:x.name};});
                                });

                }
                , fail: function (err) {
                    console.log(err);
                }
              });
