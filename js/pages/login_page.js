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
var loginComponent = require('../components/login');
var navbar = require('../components/navbar.js');
var Logger = require('../util/logger.js');
var Messages = require('../components/messages.js');

$('document').ready(function () {

    //Create logger instance
    var logger = new Logger('log-container');
    window.logger = logger;
    // create logger visual component
    ReactDOM.render(<Messages data={[]} logger={logger}/>,
                    document.getElementById("logger"));

    var n = React.createElement(navbar, {});
    ReactDOM.render(n, document.getElementById("main-top-navbar"));

    var l = React.createElement(loginComponent, {logger: logger});
    ReactDOM.render(l,document.getElementById("login-container"));

});
