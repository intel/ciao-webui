var querystring = require('querystring');

var nodeService = function (adapter, tokenManager) {
    this.adapter = adapter;
    this.tokenManager = tokenManager;
};

nodeService.prototype.nodes = function () {
    var adapter = this.adapter;
    return function (req, res, next) {
        var uri = "/v2.1/nodes";
        var query = '?' + querystring.stringify(req.query);
        var data = adapter.get(uri + query,req.session.token, () => {
            res.set('Content-Type','application/json');
            res.send(data.json);
        });
    };
};

nodeService.prototype.nodesCount = function () {
    var adapter = this.adapter;
    return function (req, res, next) {
        var uri = "/v2.1/nodes";
        var data = adapter.get(uri,req.session.token, () => {
            res.set('Content-Type','application/json');
            if (data.json)
                res.send({count:data.json.nodes.length});
            else {
                res.status(500);
                res.send({error:"Nodes not available"});
            }
        });
    };
};

nodeService.prototype.nodesSummary = function () {
    var adapter = this.adapter;
    return function (req, res, next) {
        var uri = "/v2.1/nodes/summary";
        var data = adapter.get(uri,req.session.token, () => {
            console.log("send");
            console.log(data);
            res.set('Content-Type','application/json');
            res.send(data.json);
        });
    };
};

nodeService.prototype.getNode = function () {
    var adapter = this.adapter;
    return function (req, res, next) {
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
        });
    };
};

nodeService.prototype.serversDetail = function () {
    var adapter = this.adapter;
    return function (req, res, next) {
        var query = '?' + querystring.stringify(req.query);
        if (process.env.NODE_ENV != 'production') {
            console.log('servers/detail :query string:', query);
        }
        var uri = "/v2.1/nodes/" + req.params.node + "/servers/detail" +
            query;
        var data = adapter.get(uri,req.session.token, () => {
            if (data.json) {
                var servers = data.json.servers;
                if (Array.prototype.isPrototypeOf(servers)) {
                    res.send(servers
                             .map((value) => {
                                 for(key in value) {
                                     if(Array.prototype
                                        .isPrototypeOf(value[key]))
                                         value[key] = value[key].toString();
                                 }
                                 delete value.cpus_usage;
                                 return value;
                             }));
                } else {
                    res.send([]);
                }
            }
        });
    };
};

nodeService.prototype.serversDetailCount = function () {
    var adapter = this.adapter;
    var tokenManager = this.tokenManager;
    return function(req, res, next) {
        tokenManager.onSuccess((t) => {
            var uri = "/v2.1/nodes/" + req.params.node + "/servers/detail";
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
            }
                    )
            .validate(req, res);
    };
};

module.exports = nodeService;
