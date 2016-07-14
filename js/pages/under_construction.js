var React = require('react');
var ReactDOM = require('react-dom');
var navbar = require('../components/navbar.js');
var Notice = require('../components/underConstruction.js');
var $ = require('jquery');

$('document').ready(function () {
    var activeTenant = datamanager.data.activeTenant;
    // Navigation bar
    var nprops = { logoutUrl: "/authenticate/logout"};
    // Data manager gets tenants which was passed through  routes:/tenant
    nprops.tenants = datamanager.data.tenants;
    nprops.activeTenant = activeTenant;
    nprops.back = {
            label:'< Back to [Overview]',
            url: '/tenant',
        }

    nprops.username = document
        .getElementById("main-top-navbar")
        .getAttribute("attr-user");
    var n = React.createElement(navbar, nprops);
    ReactDOM.render(n, document.getElementById("main-top-navbar"));
    ReactDOM.render(<Notice/>, document.getElementById('construction-notice'));
});
