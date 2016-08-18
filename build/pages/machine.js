var React = require('react');
var ReactDOM = require('react-dom');
var InstancesHost = require('../components/instancesHost.js');
var navbar = require('../components/navbar.js');
var Overview = require('../components/overview.js');
var $ = require('jquery');

$('document').ready(function () {

    // Navigation bar
    var nprops = { logoutUrl: "/authenticate/logout" };

    nprops.username = document.getElementById("main-top-navbar").getAttribute("attr-user");

    nprops.back = {
        label: '< Back to Admin',
        url: '/admin'
    };
    var n = React.createElement(navbar, nprops);
    ReactDOM.render(n, document.getElementById("main-top-navbar"));

    var keyOverview = 'overview';

    datamanager.onDataSourceSet(keyOverview, function (sourceData) {
        ReactDOM.render(React.createElement(Overview, sourceData), document.getElementById(keyOverview));
    });
    $.get({ url: "/data/nodes/" + datamanager.data.idMachine }).done(function (data) {
        if (data) {
            var tags = [];
            // generate default tags
            for (key in data) {
                switch (key) {
                    case 'ram_total':
                        tags.push("Max Memory: " + data[key]);
                        break;

                    case 'disk_total':
                        tags.push("Disk capacity: " + data[key]);
                        break;

                }
            }

            datamanager.setDataSource(keyOverview, {
                state: data.status,
                cpu: data.online_cpus,
                rack_identifier: data.id,
                tags: tags
            });
        }
    });

    //Set up table to view instances running on current node
    var key = 'instances-host';

    datamanager.onDataSourceSet(key, function (sourceData) {
        sourceData.source = "/data/nodes/" + datamanager.data.idMachine + "/servers/detail";

        var refresh = datamanager.data.REFRESH | 3000;
        sourceData.refresh = Number(refresh);
        sourceData.recordsPerPage = 10;
        sourceData.dataKey = key;

        ReactDOM.render(React.createElement(InstancesHost, sourceData), document.getElementById('instances-host'));
    });

    datamanager.setDataSource('instances-host', { data: [] });
});