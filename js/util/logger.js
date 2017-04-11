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

/* Logger: Use within all "page" script
   Note: logger requires datamanager to be loaded
   make sure to include within $("document").ready

   Fields:
   - id: unique to manage rows
   - title: a code or title for an error/warning/message
   - type: error, warning or message
   - message: description of the error
   - action: Object with contains a function to be executed associated with
     a log object.

       action.fn: function to be executed
       action.msg: message related to the action in place
*/

var React = require('react');
var ReactDOM = require('react-dom');
var Messages = require('../components/messages.js');
var container = "logger";

var logger = function(name) {
    this.cindex = 0; //initial index start at 0
    this.name = name;
    datamanager.onDataSourceSet(container,
                                this.update);

    // Initialize as empty object
    datamanager.setDataSource(container, {
        "data": []
    });
};

logger.prototype.push = function(title, message, action) {
    var log = {
        title: title,
        message: message
    };
    log.id = this.cindex;
    log.type = 'message';
    if (action) log.action = action;
    this.cindex++;
    var data = [];
    datamanager.sources[container].data.forEach((x) => {
        data.push(x);
    });
    data.push(log);
    datamanager.setDataSource(container, {
        "data": data
    });
    return log.id;
};

logger.prototype.warning = function(title, message, action) {
    var log = {
        title: title,
        message: message
    };
    log.id = this.cindex;
    log.type = 'warning';
    if (action) log.action = action;
    this.cindex++;
    var data = [];
    datamanager.sources[container].data.forEach((x) => {
        data.push(x);
    });
    data.push(log);
    datamanager.setDataSource(container, {
        "data": data
    });
    return log.id;
};

logger.prototype.error = function(title, message, action) {
    var log = {
        title: title,
        message: message
    };
    log.id = this.cindex;
    log.type = 'error';
    if (action) log.action = action;
    this.cindex++;
    var data = [];
    datamanager.sources[container].data.forEach((x) => {
        data.push(x);
    });
    data.push(log);
    datamanager.setDataSource(container, {
        "data": data
    });
    return log.id;
};

logger.prototype.remove = function(id) {
    var data = datamanager.sources[container].data
            .filter((d) => d.id != id );
    datamanager.setDataSource(container, {data: data});
};

logger.prototype.removeAll = function(id) {
    datamanager.setDataSource(container, {
        data: []
    });
};

logger.prototype.update = function(sourceData) {
    var _this = this;
    // TODO: requires logger visual component
    ReactDOM.render(
        <Messages {...sourceData}/>,
        document.getElementById(container));
};

module.exports = logger;
