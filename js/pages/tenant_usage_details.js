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
var UsageSummary = require('../components/usageSummary.js');
var navbar = require('../components/navbar.js');
var LineChartDetail = require('../components/lineChartDetail.js');

jQuery('document').ready(function () {

    // Navbar configuration
    var nprops = { logoutUrl: datamanager.data.navbar.logoutUrl};
    nprops.tenants = datamanager.data.tenants;
    nprops.activeTenant = datamanager.data.activeTenant;
    nprops.back = {
        label:datamanager.data.label,
        url: '/tenant',
    }

    nprops.username = datamanager.data.username;
    var n = React.createElement(navbar, nprops);
    ReactDOM.render(n, document.getElementById("main-top-navbar"));

    // Usage Summary
    datamanager.onDataSourceSet('usage-summary', function (sourceData) {
        sourceData.source = "/quotas";
        sourceData.reference = "tenant/"+datamanager.data.tenantName+"/usage";
        sourceData.history = false;
        ReactDOM.render(<UsageSummary {...sourceData}/>,
            document.getElementById('usage-summary'));
    });

    //set data sources
    datamanager.setDataSource('usage-summary', {data:[]});

/* ----------------------- New features ------------------------ */
    // setting initial dates
    var startDate = new Date();
    var endDate = new Date();

    //startDate.setHours(0,0,0,0);

    /**** Correct Dates ****/
    //startDate.setDate(startDate.getDate() -2);
    /*** end ***/
    startDate.setDate(startDate.getDate() -2);

    // default data
    var usageData = {
        data: [{}]
    };

    /* Memory Usage */
    datamanager.onDataSourceSet('memory-usage-summary', function (sourceData) {
        sourceData.source = "/resources";
        sourceData.start_date = startDate.toISOString();
        sourceData.end_date = endDate.toISOString();
        sourceData.title = "Memory usage";
        ReactDOM.render(<LineChartDetail {...sourceData}/>,
            document.getElementById('memory-usage-details'));
    });

    //set data sources
    datamanager.setDataSource('memory-usage-summary', usageData);

    /* Processor Usage */
    datamanager.onDataSourceSet('processor-usage-summary', function (sourceData) {
        sourceData.source = "/resources";
        sourceData.start_date = startDate.toISOString();
        sourceData.end_date = endDate.toISOString();
        sourceData.title = "Processor usage";
        ReactDOM.render(<LineChartDetail {...sourceData}/>,
            document.getElementById('processor-usage-details'));
    });

    //set data sources
    datamanager.setDataSource('processor-usage-summary', usageData);

    /* Disk Usage */
    datamanager.onDataSourceSet('disk-usage-summary', function (sourceData) {
        sourceData.source = "/resources";
        sourceData.start_date = startDate.toISOString();
        sourceData.end_date = endDate.toISOString();
        sourceData.title = "Disk usage";
        ReactDOM.render(<LineChartDetail {...sourceData}/>,
            document.getElementById('disk-usage-details'));
    });

    //set data sources
    datamanager.setDataSource('disk-usage-summary', usageData);

});
