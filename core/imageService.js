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
        var uri = "/v2/images";
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
