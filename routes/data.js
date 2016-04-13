var express = require('express');
var router = express.Router();
var sessionHandler = require('../core/session');
var ciaoAdapter = require('../core/ciao_adapter');


var adapter = new ciaoAdapter();

// Scope token validation
// This function checks if current token is scoped, if it isn't then
// it will replace the token for an scoped one using the tenant ID
// if it is scoped but the tenant differs, then it will update the token.
var validateTokenScope = function (req, res, next) {

    var callback = function () {
        if (next instanceof Function)
            next();
        else
            next.success();
    };
    console.log("validating scope");
    console.log("req.tenant:" +req.params.tenant);
    if (req.params.tenant) {
        var id = req.params.tenant;
        if (req.session.token_scope == null ||
            req.session.token_scope != id) {
            // get scoped token
            console.log("Current token: "+req.session.token);
            console.log("Get scoped token with tenant-id:"+id);

            // At this point user must have a token, therefore use token method
            var bundle = {
                "username":req.session.username,
                "password": req.session.password,
                "method": "token",
                "user_id": req.session.user_uuid,
                "token": req.session.token
            };
            sessionHandler.getToken(req,
                                    res,
                                    bundle,
                                    id,
                                    next);
        } else {
            callback();
        }
    } else {
        callback();
    }
};

// Validate session as an authorized token is required
router.use(sessionHandler.validateSession);

router.delete('/:tenant/servers/:server', function (req, res, next) {
    validateTokenScope(req, res, {
        "success": (t) => {
            var uri = "/v2.1/" + req.params.tenant +
                "/servers/" + req.params.server;
            var data = adapter.delete(uri,req.session.token, () => {
                res.send(data.raw);
            });
        }

        });
});


router.get('/:tenant/servers/detail/count',function(req, res, next) {

    validateTokenScope(req, res, {
            "success": (t) => {
                var uri = "/v2.1/" + req.params.tenant + "/servers/detail";
                var token = (t)? t: req.session.token;
                var data = adapter.get(uri,token, () => {
                    if (data.json) {
                        if (data.json.servers)
                            res.send({count:data.json.servers.length});
                        else
                            res.send({count:0});
                    } else {
                        res.send({count:0});
                    }

                });
            },

            "fail": (resp) => {
                if(resp) {
                    res.status(resp.error.code)
                        .send({"count":0})
                        .end();
                } else {
                    res.status(500)
                        .send({"count":0});
                }
            }
    });
});


router.get('/:tenant/servers/detail',function(req, res, next) {


    //TODO: Implement ForEach
    var query = '?';
    if(req.query.limit){
        query = '?limit='+req.query.limit;
    }
    if(req.query.marker){
        query += '&marker='+req.query.marker;
    }

    console.log('query', query);
    validateTokenScope(req, res, {
        "success": (t) => {
            var uri = "/v2.1/" + req.params.tenant + "/servers/detail"+query;
            var token = (t)? t: req.session.token;
            console.log("Request to "+uri+ " - token:" + token);
            var data = adapter.get(uri,token, () => {
                if (data.json) {
                    var servers = data.json.servers;
                    if (Array.prototype.isPrototypeOf(servers)) {

                        res.send(servers
                                 .map((value) => {
                                     var address = value.addresses.private[0];
                                     return {
                                         "instance_id": value.id,
                                         "State": value.status,
                                         "Node ID": value.hostId,
                                         "IP Address": address.addr,
                                         "MAC address":address[
                                             "OS-EXT-IPS-MAC:mac_addr"],
                                         "Image": value.image.id
                                     };
                                 }));
                    } else {
                        res.send({servers:[]});
                    }
                } else {
                    res.send({servers:[]});
                }
            });
        },

        "fail": (resp) => {
            if(resp) {
                res.status(resp.error.code)
                    .send({"servers":[]})
                    .end();
            } else {
                res.status(500)
                    .send({"servers":[]});
            }
        }
    });

});

router.get('/:tenant/servers/:server', function(req, res, next) {
    var uri = "/v2.1/" + req.params.tenant + "/servers/" + req.params.server;
    var data = adapter.get(uri,req.session.token, () => res.send(data.json));
});

router.get('/:tenant/flavors', function(req, res, next) {
    validateTokenScope(req, res, {
        "success": (t) => {
            var uri = "/v2.1/" + req.params.tenant + "/flavors";
            var data = adapter.get(
                uri,req.session.token,
                () => {
                    // Temporal optimization
                    // Cache current workload information.
                    // Workloads aren't likely to change while UI is
                    // running. If workloads change, users must logout and
                    // login again..
                    // TODO: remove once a better optimization is implemented
                    if (!req.session.workloads) {
                        req.session.workloads = data.json.flavors;
                    }
                    res.send({flavors:req.session.workloads});
                });
        },
        "fail": () => {
            res.status(500).end();
        }
    });
});

// Ciao-webui only:
// This helper service optimize usage for current Grouped Instances
// implementation.

router.get('/:tenant/flavors/detail', function(req, res, next) {
    validateTokenScope(req, res, {
        "success": (t) => {
            // Implement a processing flag to prevent overload
            if (!req.session.wrefresh)
                req.session.wrefresh = false;
            if (req.session.wrefresh == false && req.session.workloads)  {
                var uri = "/v2.1/" + req.params.tenant + "/servers/detail";
                req.session.wrefresh = true;
                var data = adapter.get(
                    uri,req.session.token,
                    function () {
                        var workloads = req.session.workloads.map((w,index) => {
                            var filteredData = data.json.servers.filter(
                                (server) => {
                                    return server.image.id == w.disk;
                                });
                            // total instances and running instances respectively
                            var ti = filteredData.length;
                            var tri = filteredData.filter((server) => {
                                return server.status == 'running';
                            }).length;

                            w.totalInstances = ti;
                            w.totalRunningInstances = tri;
                            return w;
                        });
                        req.session.workloads = workloads;
                        // Refresh has been completed
                        req.session.wrefresh = false;
                        res.send({flavors:req.session.workloads});
                    });
                } else {
                    res.send({flavors:req.session.workloads});
                }
        },
        "fail": () => {
            res.send({flavors:[]});
        }
    });
});

router.get('/:tenant/flavors/:flavor', function(req, res, next) {
    validateTokenScope(req, res, {
        "success": (t) => {
            var uri = "/v2.1/" + req.params.tenant + "/flavors/" +
                req.params.flavor;
            var data = adapter.get(
                uri,req.session.token,
                () => {
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
                });
        },
        "fail": () => {
            res.send({});
        }
    });
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
    validateTokenScope(req, res, {
        "success": (t) => {
            var start = req.query.start;
            var end = req.query.end;
            var query = "?start="+start+"&end="+end;
            var uri = "/v2.1/" + req.params.tenant + "/resources" + query;
            var data = adapter.get(
                uri,req.session.token,
                () => res.send(data.json));
        },
        "fail": () => {
            res.send({});
        }
    });
});

router.get('/:tenant/quotas', function (req, res, next) {
    validateTokenScope(req, res, {
        "success": (t) => {
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
        },
        "fail": () => {
            res.send({usageSummaryData:{}});
        }
    });
});

router.get('/nodes', function (req, res, next) {
    var uri = "/v2.1/nodes";
    var data = adapter.get(uri,req.session.token, () => {
        res.set('Content-Type','application/json');
        res.send(data.json);
    });
});

router.get('/nodes/summary', function (req, res, next) {
    var uri = "/v2.1/nodes/summary";
    var data = adapter.get(uri,req.session.token, () => {
        console.log("Response");
        console.log(data);
        res.set('Content-Type','application/json');
        res.send(data.json);
    });
});

router.get('/nodes/:node', function (req, res, next) {
    var uri = "/v2.1/nodes";
    var data = adapter.get(uri,req.session.token, () => {

            if(data.json){
                var nodes = data.json.nodes.filter(
                        (node) => node.id == req.params.node);
                if (nodes.length > 0)
                    res.send(nodes.pop());
                else
                    res.send([]);
            }else{
                res.send([]);
            }

    }
    );
});

router.get('/nodes/:node/servers/detail', function (req, res, next) {
    var uri = "/v2.1/nodes/" + req.params.node + "/servers/detail";
    var data = adapter.get(uri,req.session.token, () => {
        if (data.json) {
            var servers = data.json.servers;
            if (Array.prototype.isPrototypeOf(servers)) {

                res.send(servers
                         .map((value) => {
                             for(key in value) {
                                 if(Array.prototype.isPrototypeOf(value[key]))
                                     value[key] = value[key].toString();
                             }
                             return value;
                         }));
            } else {
                res.send([]);
            }
        }
    });
});

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
    validateTokenScope(req, res, {
        "success": (t) => {
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
        },
        "fail": function () {
            res.status(500)
            .end();
        }
    });
});

router.post('/:tenant/servers/:server/action', function (req, res, next) {
    validateTokenScope(req, res, {
        "success": (t) => {
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
    });
});

module.exports = router;
