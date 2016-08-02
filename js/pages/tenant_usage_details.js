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
        label:'< Back to [Overview]',
        url: '/tenant',
    }

    nprops.username = datamanager.data.username;
    var n = React.createElement(navbar, nprops);
    ReactDOM.render(n, document.getElementById("main-top-navbar"));

    // Usage Summary
    datamanager.onDataSourceSet('usage-summary', function (sourceData) {
        sourceData.source = "/quotas";
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

    startDate.setHours(0,0,0,0);
    endDate.setDate(startDate.getDate() +1);

    console.log("startDate",startDate);
    console.log("endDate", endDate);

    //sample linechart render

    var d1 = new Date();

    var d2 = new Date();
    d2.setDate(d1.getDate() -2);

    var d3 = new Date();
    d3.setDate(d1.getDate() -4);

    var lcdata = {
        data: [{id: 1, dateValue:d1, usageValue:3},
               {id: 2, dateValue:d2, usageValue:10},
               {id: 3, dateValue:d3, usageValue:1}],
        title: "Memory usage"
    };
    lcdata.data.forEach((d)=> console.log(d.x));

    /*datamanager.onDataSourceSet('line-chart1', function (sourceData) {
        ReactDOM.render(<LineChartDetail {...sourceData}/>,
            document.getElementById("memory-usage-details"));
    });
    datamanager.setDataSource('line-chart1', lcdata);*/
    // LineChart Usage data
    datamanager.onDataSourceSet('memory-usage-summary', function (sourceData) {
        sourceData.source = "/resources";
        sourceData.start_date = startDate.toISOString();
        sourceData.end_date = endDate.toISOString();
        sourceData.title = "Memory usage";
        ReactDOM.render(<LineChartDetail {...sourceData}/>,
            document.getElementById('memory-usage-details'));
    });

    //set data sources
    datamanager.setDataSource('memory-usage-summary', lcdata);

});
