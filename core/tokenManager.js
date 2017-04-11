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
// Token Manager class
/*
* This class is in charge of handling token validation when performing requests
* Request and response objects are required in order to work properly.
* Note: As req.params object is needed, use within any express router get, post,
* delete or update methods. Do not include in router.use method.
**/

var tokenManager = function (handler) {
    this.handler = handler;
    this.sucessCallback = null;
    this.errorCallback = null;
};

tokenManager.prototype.validate = function (req, res) {

    // Validate that a successCallback is given
    if (this.sucessCallback == null || this.sucessCallback == undefined) {
        if (process.env.NODE_ENV != 'production') {
            console.log("TokenManager: Did not provide successful callback");
        }
        return null;
    }

    var next = {};
    next.success = this.sucessCallback;
    // failure callback is not mandatory.
    next.fail = (this.errorCallback != null || this.errorCallback == undefined)?
        this.errorCallback:
        () => {return;};
    if (process.env.NODE_ENV != 'production') {
        console.log("validating scope");
        console.log("req.tenant:" +req.params.tenant);
        console.log("Current token: "+req.session.token);
        console.log("Get scoped token with tenant-id:"+id);
    }
    // if tenant is available on the parameters, then we need to check
    // if the token is scoped to that tenant
    if (req.params.tenant && req.session.isAdmin === false) {
        var id = req.params.tenant;
        if ((req.session.token_scope == null
            || req.session.token_scope != id)
            && id != undefined) {
            // get scoped token
            if (process.env.NODE_ENV != 'production') {
                console.log("Current token: "+req.session.token);
                console.log("Get scoped token with tenant-id:"+id);
            }

            // At this point user must have a token, therefore use token method
            var bundle = {
                "username":req.session.username,
                "password": req.session.password,
                "method": "token",
                "user_id": req.session.user_uuid,
                "token": req.session.token
            };
            var result = this.handler
                .getToken(req, res, bundle, id, next);
            return result;
        } else {
            next.success();
        }
    } else {
        next.success();
    }
    return null;
};

tokenManager.prototype.onSuccess = function (callback) {
    var tm = Object.assign(new tokenManager, this);
    tm.sucessCallback = callback;
    return tm;
};

tokenManager.prototype.onError = function (callback) {
    var tm = Object.assign(new tokenManager, this);
    tm.errorCallback = callback;
    return tm;
};

module.exports = tokenManager;
