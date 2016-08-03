var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var NetworkCnci = require('../components/network_cnci.js');
var UsageSummary = require('../components/usageSummary.js');
var NodeSummary = require('../components/nodeSummary.js');
var Nodes = require('../components/nodes.js');
var navbar = require('../components/navbar.js');
var InstancesCounter = require('../components/instancesCounter.js');
var Logger = require('../util/logger.js');

$('document').ready(function () {

    // Create Logger object
    window.logger = new Logger('logger-container');

    var getUnitString = function (value) {

        if (value == null) return function (arg) {
            return arg;
        };

        return value < 1500 ? value + "GB" : value / 1000 + "TB";
    };

    //Node Summary
    datamanager.onDataSourceSet('node-summary', function (sourceData) {

        ReactDOM.render(React.createElement(NodeSummary, _extends({}, sourceData, { logger: logger })), document.getElementById("node-summary"));
    });
    // react hierarchy would be re-rendered
    datamanager.setDataSource('node-summary', { sections: [], usageSummary: { elements: [] } });

    //Usage Summary
    datamanager.onDataSourceSet('usage-summary', function (sourceData) {
        sourceData.source = "/nodes";
        ReactDOM.render(React.createElement(UsageSummary, _extends({}, sourceData, { logger: logger })), document.getElementById("usage-summary"));
    });
    datamanager.setDataSource('usage-summary', { data: [] });

    datamanager.onDataSourceSet('instances-counter', function (sourceData) {
        sourceData.source = "/nodes";
        ReactDOM.render(React.createElement(InstancesCounter, sourceData), document.getElementById("instances-counter"));
    });
    datamanager.setDataSource('instances-counter', { data: [] });

    //Nodes
    datamanager.onDataSourceSet('nodes', function (sourceData) {
        ReactDOM.render(React.createElement(Nodes, sourceData), document.getElementById('nodes'));
    });
    datamanager.setDataSource('nodes', {
        source: "/data/nodes",
        data: []
    });

    //CNCI
    datamanager.onDataSourceSet('network-cnci', function (sourceData) {
        ReactDOM.render(React.createElement(NetworkCnci, sourceData), document.getElementById('network-cnci'));
    });
    datamanager.setDataSource('network-cnci', { source: '/data/cncis' });

    // Navigation bar
    var nprops = { logoutUrl: "/authenticate/logout" };
    // Data manager gets tenants which was passed through  routes:/tenant
    nprops.tenants = datamanager.data.tenants;
    nprops.username = document.getElementById("main-top-navbar").getAttribute("attr-user");
    var n = React.createElement(navbar, nprops);
    ReactDOM.render(n, document.getElementById("main-top-navbar"));
});