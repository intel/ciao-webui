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

var React = require('react');
var ReactDOM = require('react-dom');
var InstancesHost = require('../components/instancesHost.js');
var navbar = require('../components/navbar.js');
var Overview = require('../components/overview.js');
var $ = require('jquery');
var Logger = require('../util/logger.js');

$('document').ready(function () {

    // Create Logger object
    window.logger = new Logger('logger-container');

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

    var keyInstanceHost = 'instances-host';
    datamanager.onDataSourceSet(keyInstanceHost, function (sourceData) {
        sourceData.source = "/data/nodes/" + datamanager.data.idMachine + "/servers/detail";

        var refresh = datamanager.data.REFRESH | 3000;
        sourceData.refresh = Number(refresh);
        sourceData.recordsPerPage = 10;
        sourceData.dataKey = keyInstanceHost;
        if (datamanager.data.flavors) {
            try {
                if (datamanager.data.flavors[0].name) sourceData.data = sourceData.data.map(x => {
                    try {
                        x.Image = datamanager.data.flavors.filter(function (y) {
                            return y.disk.localeCompare(x.Image) == 0;
                        }).pop().name;
                    } catch (e) {}
                    return x;
                });
            } catch (e) {}
        }
        ReactDOM.render(React.createElement(InstancesHost, sourceData), document.getElementById('instances-host'));
    });

    datamanager.setDataSource('instances-host', { data: [] });

    // Navigation bar
    var nprops = { logoutUrl: "/authenticate/logout" };

    nprops.username = document.getElementById("main-top-navbar").getAttribute("attr-user");

    nprops.back = {
        label: '< Back to [Admin Overview]',
        url: '/admin'
    };
    var n = React.createElement(navbar, nprops);
    ReactDOM.render(n, document.getElementById("main-top-navbar"));
});