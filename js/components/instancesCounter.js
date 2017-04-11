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

// React js component
var React = require('react');
var reactBootstrap = require('react-bootstrap');
var Button = reactBootstrap.Button;

var instancesCounter = React.createClass({

    getDefaultProps: function() {
        // source defaults to server details url
        return {
            data: {}
        };
    },

    getInitialState: function() {
        return {updating: false};
    },

    componentDidMount: function() {
        var callSource = function () {
            if (this.state.updating == true)
                return;
            this.setState({updating: true});
            var url;
            var instancesQuota=0;
            url = "/data"+this.props.source;

            $.get({
                url:url})
                .done(function (data) {
                    if (data) {
                        data.nodes.map((node) => {
                            //console.log(node.total_instances);
                            instancesQuota+= node.total_instances;
                        });
                        data = {total_instances: instancesQuota};
                    }
                    this.setState({updating: false});
                    datamanager.setDataSource('instances-counter',{
                        source: this.props.source,
                        data:data
                    });
                }.bind(this))
                .fail(function (err) {
                    this.setState({updating: false});
                    datamanager.setDataSource('instances-counter',{
                        source: this.props.source});
            }.bind(this));
        }.bind(this);
        callSource();

        window.setInterval(function () {
            callSource();
        }.bind(this),2000);
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        //return this.props !== nextProps;
        if (nextState.updating != this.state.updating)
            return false;
        return true;
    },

    render: function() {

        return (
            <div className="element-summary-panel usageSummary">
            <div className="frm-panel-heading frm-panel-standar">
            </div>
                <div className="panel frm-panel-default">
                    <div className="panel-body">
                        <h3 className="frm-secondary-text frm-bold-text">
                           Total Instances
                        </h3>
                        <div>
                            <h6 className="frm-bold-text frm-body-h6">
                                {this.props.data.total_instances}
                            </h6>
                        </div>
                    </div>
                    <div className="panel-footer frm-panel-footer-secondary">
                        <Button bsStyle={null}
                            className="btn frm-btn-secondary"
                            href="admin/underConstruction">
                            Instance Overview
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
});


module.exports = instancesCounter;
