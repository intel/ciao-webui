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
var UsageSummary = require('../components/usageSummary.js');
var AddInstances = require('../components/addInstances.js');
var navbar = require('../components/navbar.js');
var $ = require('jquery');

$('document').ready(function () {

    //create usage summary
    // How to use Usage Summary
    // first use a data source compatible for componenet.

    var getUnitString = function (value) {

        if (value == null)
            return function (arg) {return arg;};

        return value < 1500 ?
        value + "GB" :
        (value / 1000) + "TB";
    };
    // default data to be used with usage summary
    var usageSummaryData = {
        elements:[
            {
                value: 7,
                quota: 8,
                name: "Instances",
                unit: getUnitString(null)
            },
            {
                value: 2.5,
                quota: 1700,
                name: "Memory",
                unit: getUnitString
            },
            {
                value: 9,
                quota: 1700,
                name: "Processors",
                unit: getUnitString(null)
            },
            {
                value: 120,
                quota: 1700,
                name: "Disk",
                unit: getUnitString
            },
            {
                value: 3100,
                quota: 1700,
                name: "IP Adresses",
                unit: getUnitString(null)
            }
        ]
    };
    //default data to use with add-instances and group-overview


    var workload = [
        {
            name:"BitCoin",
            title:"BitCoin",
            id:1,
            instances: [
                {
                    "instance_id": "925ea79d",
                    "tenant_id": "68a76514-5c8e-40a8",
                    "instance_state": "active",
                    "workload_id": "69e84267-ed01",
                    "node_id": "4ec9b270-c48-f95ff877e252",
                    "mac_address": "73:6f:2b:59:bb:2c"
                }
            ]
        },{
            name:"WordPress",
            title:"WordPress",
            id:2,
            instances: [
                {
                    "instance_id": "925ea79d",
                    "tenant_id": "68a76514-5c8e-40a8",
                    "instance_state": "active",
                    "workload_id": "69e84267-ed01",
                    "node_id": "4ec9b270-c48-f95ff877e252",
                    "mac_address": "73:6f:2b:59:bb:2c"
                }
            ]
        },{
            name:"GroupLabel3",
            id:3,
            title:"GroupLabel3",
            instances: [
                {
                    "instance_id": "925ea79-9dcd-c26b729d67c9",
                    "tenant_id": "68a76514-0570a11d035b",
                    "instance_state": "active",
                    "workload_id": "69e842-b15f-b47de06b62e7",
                    "node_id": "4ec9b270-c488-4b59-a376-f95ff877e252",
                    "mac_address": "73:6f:2b:59:bb:2c"
                },
                {
                    "instance_id": "925ea79-9dcd-c26b729d67c9",
                    "tenant_id": "68a76514-0570a11d035b",
                    "instance_state": "hold",
                    "workload_id": "69e842-b15f-b47de06b62e7",
                    "node_id": "4ec9b270-c488-4b59-a376-f95ff877e252",
                    "mac_address": "73:6f:2b:59:bb:2c"
                }
            ]
        }
    ];
    var activeTenant = datamanager.data.activeTenant;
    var groupId = datamanager.data.groupId;

    console.log('groupId', groupId);

    // Component to Add instances
    datamanager.onDataSourceSet('add-instances', function (sourceData) {
        ReactDOM.render(
        <AddInstances sourceData={sourceData}/>,
            document.getElementById("add-instances"));
    });
    datamanager.setDataSource('add-instances', {activeTenant});

    //Usage summary
    datamanager.onDataSourceSet('usage-summary', function (sourceData) {
        ReactDOM.render(
        <UsageSummary {...sourceData}/>,
        document.getElementById("usage-summary"));
    });
    // react hierarchy would be re-rendered
    datamanager.setDataSource('usage-summary', usageSummaryData);

    //create instances host
    datamanager.onDataSourceSet('instances-host', function (sourceData) {
        sourceData.source = "/servers/detail";
        ReactDOM.render(
        <InstancesHost {...sourceData}/>,
        document.getElementById("instances-host"));
    });

    datamanager.setDataSource('instances-host',{data:[]});


    // Navigation bar
    var nprops = { logoutUrl: "/authenticate/logout"};
    // Data manager gets tenants which was passed through  routes:/tenant
    nprops.tenants = datamanager.data.tenants;
    nprops.activeTenant = activeTenant;
    nprops.back = {
        label:'< Back to ['+activeTenant.name+']',
        url: '/tenant'
    }

    nprops.username = document
        .getElementById("main-top-navbar")
        .getAttribute("attr-user");
    var n = React.createElement(navbar, nprops);
    ReactDOM.render(n, document.getElementById("main-top-navbar"));
});
