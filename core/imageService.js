/*Image service component
  Client implementation for Image service api
  Functionality not ready, still under development.
*/

var imageService = function (adapter, tokenManager) {
    this.adapter = adapter;
    this.tokenManager = tokenManager;
};

imageService.prototype.getImages = function () {
    var adapter = this.adapter;
    var tokenManager = this.tokenManager;
    return function(req, res, next) {
        var uri = "/v2/"+req.params.tenant+"/images";
        return adapter.onSuccess((data) => res.send(data.json))
            .onError((data) => res.send(data))
            .get(uri,req.session.token);
    };
};

imageService.prototype.getImageDetails = function () {
    var adapter = this.adapter;
    var tokenManager = this.tokenManager;
    return function(req, res, next) {
        var uri = "/v2/"+req.params.tenant+"/images/"+req.params.image_id;
        return adapter.onSuccess((data) => res.send(data.json))
            .onError((data) => res.send(data))
            .get(uri,req.session.token);
    };
};

imageService.prototype.createImage = function () {
    var adapter = this.adapter;
    var tokenManager = this.tokenManager;
    return function (req, res, next) {
        var uri = "/v2/"+req.params.tenant+"/images";

        var image = req.body.image? req.body :{
            disk_format:req.body.disk_format,
            name: req.body.name
        };
        return adapter.onSuccess((data) => res.send(data.json))
            .onError((data) => res.send(data))
            .post(uri,image,req.session.token);
    };
};

// Placeholder for upload Image method
// imageService.prototype.uploadImage = function () {
// }

imageService.prototype.deleteImage = function () {
    var adapter = this.adapter;
    var tokenManager = this.tokenManager;
    return function (req, res, next) {
        var uri = "/v2/"+req.params.tenant+"/images/"+req.params.image_id;
        return adapter.onSuccess((data) => res.send(data.json))
            .onError((data) => res.send(data))
            .delete(uri,req.session.token);
    };
};

module.exports = imageService;
