/*Block service component
  This is a client implementation for openstack's block storage api
*/

var blockService = function (adapter, tokenManager) {
    this.adapter = adapter;
    this.tokenManager = tokenManager;
};

blockService.prototype.getVolumes = function () {
    var adapter = this.adapter;
    var tokenManager = this.tokenManager;
    return function (req, res, next) {
        var uri = "/v2/"+req.params.tenant+"/volumes";
        return adapter.onSuccess((data) => res.send(data.json))
            .onError((data) => res.send(data))
            .get(uri,req.session.token);
    };
};

blockService.prototype.deleteVolume = function () {
    var adapter = this.adapter;
    var tokenManager = this.tokenManager;
    return function (req, res, next) {
        var uri = "/v2/"+req.params.tenant+"/volumes/"+req.params.volume_id;
        return adapter.onSuccess((data) => res.send(data.json))
            .onError((data) => res.send(data))
            .delete(uri,req.session.token);
    };
};

blockService.prototype.createVolume = function () {
    var adapter = this.adapter;
    var tokenManager = this.tokenManager;
    return function (req, res, next) {
        var uri = "/v2/"+req.params.tenant+"/volumes";

        var volume = req.body.volume? req.body :{ volume: {
            size:req.body.size,
            name: req.body.name
        }};
        return adapter.onSuccess((data) => res.send(data.json))
            .onError((data) => res.send(data))
            .post(uri,volume,req.session.token);
    };
};

module.exports = blockService;
