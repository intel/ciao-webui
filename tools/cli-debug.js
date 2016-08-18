var repl = require("repl");

var ciaoAdapter = require('../core/ciao_adapter');
var querystring = require('querystring');
var TokenManager = new require('../core/tokenManager');
var sessionHandler = require('../core/session');
var BlockService = require('../core/blockService');

var username, password, token;

process.argv.forEach((value) => {
    if (value.includes("username"))
        username = value.split("=").pop();
    if (value.includes("password"))
        password = value.split("=").pop();
});

var blockHostname = "";
var blockPort = "";
var blockProtocol = "";

var req = {session:{}};

var bundle = {
    username: "",
    password: ""
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

                    // Block service methods
                    replServer.context.block = {};
                    replServer.context.block.adapter =
                        new ciaoAdapter(blockHostname,blockPort, blockProtocol);

                    var blockService = new BlockService(
                        replServer.context.block.adapter,
                        tokenManager);

                    replServer.context.block.volumes = function () {
                        return blockService.getVolumes()(
                            Object.assign({
                                params:{tenant:replServer.context.project}
                            },replServer.context.req),
                            {send:function(d){
                                console.log(d);
                            }}
                            ,null);
                    };

                    replServer.context.block.deleteVolume = function (id) {
                        return blockService.deleteVolume()(
                            Object.assign({
                                params:{tenant:replServer.context.project,
                                        volume_id:id}
                            },replServer.context.req),
                            {send:function(d){
                                console.log(d);
                            }}
                            ,null);
                    };

                    replServer.context.block.createVolume = function (n, s) {
                        return blockService.createVolume()(
                            Object.assign({
                                params:{tenant:replServer.context.project},
                                body: {name:n,size:s}
                            },replServer.context.req),
                            {send:function(d){
                                console.log(d);
                            }}
                            ,null);

                    };

                    replServer.context.block.attach = function (id, instance) {
                        return blockService.attachVolume()(
                            Object.assign({
                                params:{tenant:replServer.context.project,
                                        volume_id:id},
                                body: {"os-attach":{
                                    "instance_uuid":instance}}
                            },replServer.context.req),
                            {send:function(d){
                                console.log(d);
                            }}
                            ,null);

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
