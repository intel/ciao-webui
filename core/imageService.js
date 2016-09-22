/*Image service component
  Client implementation for Image service api
*/

var imageService = function (adapter, tokenManager) {
    this.adapter = adapter;
    this.tokenManager = tokenManager;
};

module.exports = imageService;
