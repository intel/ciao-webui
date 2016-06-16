/* Logger: Use within all "page" script
   Note: logger requires datamanager to be loaded
   make sure to include within $("document").ready
   
   Fields:
   - id: unique to manage rows
   - title: a code or title for an error/warning/message
   - type: error, warning or message
   - message: description of the error
   - action: an executable function associated with 
*/

var React = require('react');
var ReactDOM = require('react-dom');
var Messages = require('../components/messages.js');
var container = "logger";

var logger = function (name) {
    this.cindex = 0; //initial index start at 0
    this.name = name;
    datamanager.onDataSourceSet(container,
				this.update);
    // Initialize as empty object
    datamanager.setDataSource(container, {"data": []});
};

logger.prototype.push = function (title, message) {
    var log = {title: title, message: message};
    log.id = this.cindex;
    log.type = 'message';
    this.cindex++;
    var data = [];
    datamanager.sources[container].data.forEach((x) => {
	data.push(x);
    });
    data.push(log);
    datamanager.setDataSource(container,{"data": data});
    return log.id;
};

logger.prototype.error = function (title, message) {
    var log = {title: title, message: message}; 
    log.id = this.cindex;
    log.type = 'error';
    this.cindex++;
    var data = [];
    datamanager.sources[container].data.forEach((x) => {
	data.push(x);
    });
    data.push(log);
    datamanager.setDataSource(container,{"data": data});
    return log.id;
};

logger.prototype.remove = function (id) {
    var data = datamanager.sources[container].data
	.filter((d) => d.id != id );
    datamanager.setDataSource(container, {data: data});
};

logger.prototype.update = function (sourceData) {
    // TODO: requires logger visual component
    console.log("updating..", sourceData);
    ReactDOM.render(
        <Messages {...sourceData}/>,
	document.getElementById(container));
};

module.exports = logger;
