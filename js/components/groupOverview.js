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
var InstancesGroup = require('./instancesGroup.js');

var groupOverview = React.createClass({
    getInitialState: function() {
        return {
            updates:0,
            logger:null
        };
    },

    instancesWereAdded: function(){
        console.log('Instances were added - groupOverview');
    },

    flavorsDesc: [],

    loadFlavors: function () {
        var load = function () {
            if(this.flavorsDesc.length == 0)
                this.props.flavors.forEach(function (flavor) {
                    $.get({
                        url:this.props.detailUrl + "/flavors/" + flavor.id,
                        timeout:5000})
                        .done(function (data) {
                            if (data) {
                                this.flavorsDesc.push({
                                    id:data.flavor.id,
                                    name:data.flavor.name,
                                    disk:data.flavor.disk});
                                datamanager.data.flavors = this.flavorsDesc;
                                console.log("Retrieved flavor information:");
                                console.log(data);
                            }
                        }.bind(this));
                }.bind(this));
        }.bind(this);
        load();
        window.setInterval(load, this.props.refresh);
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        if (!nextProps.flavors || nextProps.flavors.length == 0)
            return false;
        else
            return true;
    },

    componentDidMount: function() {
        this.loadFlavors();
        datamanager.addEvent('add-instances', function(){
            this.instancesWereAdded();
        }.bind(this));

        var update = function () {
            $.get({
                url: this.props.detailUrl + "/flavors/detail"
                ,timeout:5000
            }).done(function (data) {
                // this.setState({
                //     updates:this.state.updates+1});
                datamanager.setDataSource('group-overview',
                                          {
                                              dataKey: 'group-overview',
                                              detailUrl: '/data/' +
                                              datamanager.data.activeTenant.id,
                                              flavors:data.flavors});
                // Fallback, fix empty workloads
                if (data.flavors.length == 0) {
                    $.get({url: this.props.detailUrl + "/flavors"})
                    .done(function (data) {
                        datamanager
                            .setDataSource('group-overview',
                                           {
                                               dataKey: 'group-overview',
                                               detailUrl: '/data/'+
                                               datamanager.data.activeTenant.id,
                                               flavors:data.flavors});
                    }.bind(this))
                        .fail(function (err) {
                            console.log("Error:",err);
                            if (this.props.logger != null) {
                                this.props.logger.error(
                                    err.responseJSON.error.title,
                                    err.responseJSON.error.message);
                            }
                        });
                }
            }.bind(this))
                .fail(function (err) {
                    console.log("Error:",err);
                    if (this.props.logger != null) {
                        this.props.logger.error(err.responseJSON.error.title,
                                                err.responseJSON.error.message);
                    }
                });
        }.bind(this);

        update();
        window.groupInterval = setInterval(update, 5000);
    },

    componentWillUnmount: function() {
        datamanager.clearEvent('add-instances');
    },

    render: function() {
        var groups = this.props.flavors
            .map((props, i) => (
                <div className="col-md-6" key={i}>
                    <InstancesGroup {...props}/>
                </div>));

        return (<div className="row">
                    {groups}
                </div>);
    }


});

module.exports = groupOverview;
