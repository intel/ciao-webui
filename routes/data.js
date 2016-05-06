var express = require('express');
var router = express.Router();
var sessionHandler = require('../core/session');
var ciaoAdapter = require('../core/ciao_adapter');
var spawn = require('child_process').fork;
var querystring = require('querystring');
var adapter = new ciaoAdapter();
var TokenManager = new require('../core/tokenManager');
var NodeService = require('../core/nodeService');
// Set up
var tokenManager = new TokenManager(sessionHandler);
var nodeService = new NodeService(adapter, tokenManager);

// Validate session as an authorized token is required
router.use(sessionHandler.validateSession);

router.delete('/:tenant/servers/:server', function (req, res, next) {
    tokenManager.onSuccess(
        (t) => {
            var uri = "/v2.1/" + req.params.tenant +
                "/servers/" + req.params.server;
            var data = adapter.delete(uri,req.session.token, () => {
                res.send(data.raw);
            });
        })
        .validate(req, res);
});

router.get('/:tenant/servers/detail/count',function(req, res, next) {

    tokenManager.onSuccess((t) => {
                var uri = "/v2.1/" + req.params.tenant + "/servers/detail";
                var token = (t)? t: req.session.token;
                var data = adapter.get(uri,token, () => {
                    if (data.json) {
                        var rcount;
                        try {
                             rcount = (data.json.total_servers)?
                                data.json.total_servers
                                :data.json.servers.length;
                            ;
                        } catch(e){
                            rcount = 0;
                        } finally {
                            res.send({count: rcount});
                        }
                    } else {
                        res.send({count:0});
                    }

                });
            })
        .onError((resp) => {
                if(resp) {
                    res.status(resp.error.code)
                        .send({"count":0})
                        .end();
                } else {
                    res.status(500)
                        .send({"count":0});
                }
        })
        .validate(req, res);
});


router.get('/:tenant/servers/detail',function(req, res, next) {

    var query = '?' + querystring.stringify(req.query);

    if (process.env.NODE_ENV != 'production') {
        console.log('servers/detail :query string:', query);
    }

    tokenManager.onSuccess((t) => {
        var uri = "/v2.1/" + req.params.tenant + "/servers/detail"+query;
        var token = (t)? t: req.session.token;
        var data = adapter.get(uri,token, () => {
            if (data.json) {
                var servers = data.json.servers;
                if (Array.prototype.isPrototypeOf(servers)) {
                    res.send(servers
                             .map((value) => {
                                 var image = value.image.id;
                                 var address = value.addresses.private[0];
                                 return {
                                     "instance_id": value.id,
                                     "State": value.status,
                                     "Node ID": value.hostId,
                                     "IP Address": address.addr,
                                     "MAC address":address[
                                         "OS-EXT-IPS-MAC:mac_addr"],
                                     "Image": image
                                 };
                             }));
                } else {
                    res.send({servers:[]});
                }
            } else {
                res.send({servers:[]});
            }
        });
    })
        .onError((resp) => {
            if(resp) {
                res.status(resp.error.code)
                    .send({"servers":[]})
                    .end();
            } else {
                res.status(500)
                    .send({"servers":[]});
            }
        }).validate(req,res);
});

router.get('/:tenant/servers/:server', function(req, res, next) {
    var uri = "/v2.1/" + req.params.tenant + "/servers/" + req.params.server;
    var data = adapter.get(uri,req.session.token, () => res.send(data.json));
});

router.get('/:tenant/flavors', function(req, res, next) {
    tokenManager.onSuccess(
        (t) => {
            var uri = "/v2.1/" + req.params.tenant + "/flavors";
            var data = adapter.get(
                uri,req.session.token,
                function() {
                    // Temporal optimization
                    // Cache current workload information.
                    // Workloads aren't likely to change while UI is
                    // running. If workloads change, users must logout and
                    // login again..
                    // TODO: remove once a better optimization is implemented
                    if (!req.session.workloads || req.session.workloads == []) {
                        req.session.workloads = data.json.flavors;
                    }
                    res.send({flavors:req.session.workloads});
                }.bind(req));
        })
        .onError( () => {
            res.status(500).end();
        })
        .validate(req, res);
});

// Ciao-webui only:
// This helper service optimize usage for current Grouped Instances
// implementation.

router.get('/:tenant/flavors/detail', function(req, res, next) {
    tokenManager.onSuccess((t) => {
        var query = '?' + querystring.stringify(req.query);
        if (process.env.NODE_ENV != 'production') {
            console.log('servers/detail :query string:', query);
        }
        // Implement a processing flag to prevent overload
        if (!req.session.wrefresh)
            req.session.wrefresh = false;
        if (req.session.wrefresh == false && req.session.workloads)  {
            var uri = "/v2.1/" + req.params.tenant + "/servers/detail" +
                query;
            req.session.wrefresh = true;

            // Spawn new process to handle
            var child = spawn('./core/helpers/flavorDetails.js');
            // send message to child
            var globals = {
                controller_addr:global.CONTROLLER_ADDR,
                controller_port:global.CONTROLLER_PORT,
                protocol: global.PROTOCOL
            };
            child.send(JSON.stringify({
                uri: uri,
                token: req.session.token,
                workloads: req.session.workloads,
                globals: globals
            }));
            //child.send("hello mundo");
            child.on('message', function(m) {
                req.session.wrefresh = false;
                var resp = JSON.parse(m)
                    .workloads;
                req.session.workloads = resp;
                res.send({flavors: resp});
            });
        }
        else {
            res.send({
                flavors:req.session.workloads?
                    req.session.workloads:[]});
        }
    })
        .onError(() => {
            res.send({
                flavors:req.session.workloads?
                    req.session.workloads:[]});
        })
        .validate(req,res);
});

router.get('/:tenant/flavors/:flavor', function(req, res, next) {
    tokenManager.onSuccess((t) => {
        var uri = "/v2.1/" + req.params.tenant + "/flavors/" +
            req.params.flavor;
        var data = adapter.get(
            uri,req.session.token,
            function() {
                //Add detailes to cached workloads
                if (req.session.workloads)
                    var workloads = req.session.workloads
                    .map((w) => {
                        if (w.id == req.params.flavor) {
                            w.disk = data.json.flavor.disk;
                        }
                        return w;
                    });
                req.session.workloads = workloads;
                res.send(data.json);
            }.bind(req));
    })
        .onError(() => {
            res.send({});
        })
        .validate(req,res);
});

// TODO: this services only works for users with admin role.
// enable for common users
router.get('/flavors/:flavor/servers/detail', function(req, res, next) {
    var uri = "/v2.1/flavors/" +
        req.params.flavor + "/servers/detail";
    var data = adapter.get(
        uri,req.session.token,
        () => res.send(data.json));
});

router.get('/:tenant/resources', function(req, res, next) {
    tokenManager.onSuccess((t) => {
        var start = req.query.start;
        var end = req.query.end;
        var query = "?start="+start+"&end="+end;
        var uri = "/v2.1/" + req.params.tenant + "/resources" + query;
        var data = adapter.get(
            uri,req.session.token,
            () => res.send(data.json));
    })
        .onError(() => {
            res.send({});
        }
                )
        .validate(req, res);
});

router.get('/:tenant/quotas', function (req, res, next) {
    tokenManager.onSuccess((t) => {
        // validate Units for usage sumary components
        var getUnitString = function (value) {
            if (value == null)
                return function (arg) {return arg;};
            return value < 1500 ?
                value + "GB" :
                (value / 1000) + "TB";
        };
        var uri = "/v2.1/" + req.params.tenant + "/quotas";
        var data = adapter.get(uri,req.session.token, () => {
            if (data.json) {
                var validateQuota = (value) => {
                    if (value !== -1){
                        return value;
                    } else {
                        return null;
                    }
                };
                var usageSummaryData = [
                    {
                        value: data.json.instances_usage,
                        quota: validateQuota(data.json.instances_limit),
                        name: "Instances",
                        unit: ""
                    },
                    {
                        value: data.json.ram_usage,
                        quota: validateQuota(data.json.ram_limit),
                        name: "Memory",
                        unit: ""
                    },
                    {
                        value: data.json.cpus_usage,
                        name: "Processors",
                        quota: validateQuota(data.json.cpus_limit),
                        unit: ""
                    },
                    {
                        value: data.json.disk_usage,
                        quota: validateQuota(data.json.disk_limit),
                        name: "Disk",
                        unit: ""
                    }
                ];
                res.send(usageSummaryData);
            } else {
                res.send({usageSummaryData:{}});
            }
        });
    })
        .onError(() => {
            res.send({usageSummaryData:{}});
        })
        .validate(req, res);
});

// Handle node resources
router.get('/nodes', nodeService.nodes());
router.get('/nodes/count', nodeService.nodesCount());
router.get('/nodes/summary', nodeService.nodesSummary());
router.get('/nodes/:node', nodeService.getNode());
router.get('/nodes/:node/servers/detail', nodeService.serversDetail());
router.get('/nodes/:node/servers/detail/count',
           nodeService.serversDetailCount());

router.get('/cncis', function (req, res, next) {
    var uri = "/v2.1/cncis";
    var data = adapter.get(uri,req.session.token, () => {
        res.set('Content-Type','application/json');
        res.send(data.json);
    });
});

router.get('/cncis/:cnci/detail', function (req, res, next) {
    var uri = "/v2.1/cncis/" + req.params.cnci + "/detail";
    var data = adapter.get(uri,req.session.token, () => res.send(data.json));
});

// POST Methods
router.post('/:tenant/servers', function (req, res, next) {
    tokenManager.onSuccess((t) => {
        var token = (t)?t:req.session.token;
        var uri = "/v2.1/" + req.params.tenant + "/servers";
        req.body.min_count = parseInt(req.body.min_count);
        req.body.max_count = parseInt(req.body.max_count);

        var server = {server:req.body};
        var data = adapter.post(uri,
                                server,
                                token,
                                () => res.send(
                                    (data.json)?data.json:data.raw));
    })
        .onerror(function () {
            res.status(500)
                .end();
        })
        .validate(req, res);
});

router.post('/:tenant/servers/action', function (req, res, next) {
    tokenManager.onSuccess((t) => {
        var token = (t)?t:req.session.token;
        var uri = "/v2.1/" + req.params.tenant +
            "/servers/action";
        // Implemented actions are:
        // "-os-start":
        // "-os-stop"
        // " os-delete"
        var d = {};
        d["action"] = req.body.action;
        d["status"] = req.body.status;
        var data = adapter.post(uri,
                                d,
                                token,
                                () => res.send(data.raw));
    }
                          )
        .validate(req, res);
});

router.post('/:tenant/servers/:server/action', function (req, res, next) {
    tokenManager.onSuccess((t) => {
        var token = (t)?t:req.session.token;
        var uri = "/v2.1/" + req.params.tenant +
            "/servers/"+req.params.server + "/action";
        // Implemented actions are:
        // "-os-start":
        // "-os-stop"
        var d = {};
        d["server"] = req.body.server;
        d[req.body.action] = req.body.action;
        var data = adapter.post(uri,
                                d,
                                token,
                                () => res.send(data.json));
    }
                          )
        .validate(req, res);
});

module.exports = router;
