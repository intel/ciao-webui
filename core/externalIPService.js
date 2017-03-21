/*Pool service component
  This is a client implementation to handle Ciao's  external-ip API.
*/

var externalIPService = function (adapter, tokenManager) {
    this.adapter = adapter;
    this.tokenManager = tokenManager;
};

//POOLS

// Retrieve a list of all public pools
// Method: GET
externalIPService.prototype.listPools = function () {
    var adapter = this.adapter;
    var tokenManager = this.tokenManager;
    return function (req, res, next) {
        var uri = "/pools";
        return adapter.onSuccess((data) => {
            res.set('Content-Type','application/json');
            res.send(data.json);
        }).onError((data) => res.send(data))
            .get(uri,req.session.token);
    };
};

// retrieve information about a pool
// Method GET
externalIPService.prototype.listPoolByID = function () {
    var adapter = this.adapter;
    var tokenManager = this.tokenManager;
    return function (req, res, next) {
        var uri = "/pools";
        return adapter.onSuccess((data) => {
            res.set('Content-Type','application/json');
            if (data.json.pools) {
                var pools = data.json.pools.filter(
                    (pool) => pool.id == req.params.pool_id);
                if (pools.length > 0) {
                    res.send(pools.pop());
                } else {
                    res.send([]);
                }
            } else {
                res.send([]);
            }
        }).onError((data) => res.send(data))
            .get(url,req.session.token);
    };
}

// Method: POST
// Create a new external IP pool
externalIPService.prototype.createPool = function () {
    var adapter = this.adapter;
    var tokenManager = this.tokenManager;
    return function (req, res, next) {
        var uri = "/pools";

        var pool = req.body.pool? req.body :{
            name:req.body.name,
            Subnet: req.body.Subnet,
            ips: JSON.parse(req.body.ips),
            ip: req.body.ip
        };

        return adapter.onSuccess((data) => res.send(data.json))
            .onError((data) => res.send(data))
            .post(uri,pool,req.session.token);
    };
};

// Method: POST
// Add external IPs to a Pool
externalIPService.prototype.addExternalIPsTOPool = function () {
    var adapter = this.adapter;
    var tokenManager = this.tokenManager;
    return function (req, res, next) {
        var uri = "/pools/"+req.params.pool_id;

        var externalIPs = req.body.externalIPs? req.body :{
            pool_id:req.body.pool_id,
            Subnet: req.body.subnet,
            ips: req.body.ips,
            ip: req.body.ip
        };
        return adapter.onSuccess((data) => res.send(data.json))
            .onError((data) => res.send(data))
            .post(uri,externalIPs,req.session.token);
    };
};

// Method: DELETE
// Remove a an empty pool
externalIPService.prototype.deletePool = function () {
    var adapter = this.adapter;
    var tokenManager = this.tokenManager;
    return function (req, res, next) {
        var uri = "/pools/"+req.params.pool_id;
        return adapter.onSuccess((data) => res.send(data.json))
            .onError((data) => res.send(data))
            .delete(uri,req.session.token);
    };
};

// EXTERNAL IPs

// List all external IPs that are currently mapped across ciao
// Method: GET
externalIPService.prototype.listExternalIPs = function () {
    var adapter = this.adapter;
    var tokenManager = this.tokenManager;
    return function (req, res, next) {
        var uri = "/external-ips";
        return adapter.onSuccess((data) => {
            res.set('Content-Type','application/json');
            res.send(data.json);
        }).onError((data) => res.send(data))
            .get(uri,req.session.token);
    };
};



module.exports = externalIPService;
