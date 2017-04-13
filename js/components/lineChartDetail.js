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
var d3LineChartDetail = require("../d3_components/d3LineChartDetail.js");
var dom = require("react-faux-dom");
var currentDate = "";
var currentTime = "";
var currentDateTime = "";

var lineChartDetail = React.createClass({

    getInitialState: function() {
        // Default selection is the current day
        var now = new Date();
        var today_00 = new Date();
        today_00.setMilliseconds(0);
        today_00.setSeconds(0);
        today_00.setMinutes(0);
        today_00.setHours(0);

        return {
            d3node: null,
            timeFrom:today_00,
            timeTo: now
        };
    },

    getDefaultProps: function() {
        return {
            width: 300,
            height: 350,
            timeframe: 1,
            refresh: 3500
        };
    },

    componentWillUpdate: function(nextProps, nextState) {
    },

    componentDidUpdate: function(prevProps, prevState) {
    },

    lineChart: null,

    componentDidMount: function() {
        // Call for current date and time
        //this.getRealTime();
        // Call update function
        this.drawingChart();
    },

    drawingChart: function () {
        var state = {};

        var callSource = function () {
            /*if (this.state.updating == true)
                return;
            this.setState({updating: true});*/

            var n = dom.createElement('svg');
            var bundle = {props: this.props};
            if (this._dcontainer) {
                bundle.dimensions = {};

                if (this._dcontainer.offsetWidth > 50)
                    bundle.dimensions.width = this._dcontainer.offsetWidth;
                    bundle.dimensions.height = this.props.height;
            }

            this.lineChart = d3LineChartDetail.create(n, bundle, this.state);
            this.setState({d3node: this.lineChart.render()});

            var url;
            var memoryUsageData = [];

            if (!datamanager.data.activeTenant){
                // admin
            } else {
                // tenant
                url = "/data/"+datamanager.data.activeTenant.id+
                    this.props.source+"?start_date="+this.props.start_date+
                    "&end_date="+this.props.end_date;
            }
            $.get({
                url:url})
                .done(function (data) {
                    if (data) {
                        state.timeFrom = new Date(data.from);
                        state.timeTo = new Date(data.to);

                        if (this.props.title === "Memory usage") {
                            datamanager.setDataSource('memory-usage-summary',{
                                source: this.props.source,
                                start_date: this.props.start_date,
                                end_date: this.props.end_date,
                                data:data.memoryUsageData
                            });
                        } else if (this.props.title === "Processor usage") {
                            datamanager.setDataSource('processor-usage-summary',{
                                source: this.props.source,
                                start_date: this.props.start_date,
                                end_date: this.props.end_date,
                                data:data.cpusUsageData
                            });
                        } else if (this.props.title === "Disk usage") {
                            datamanager.setDataSource('disk-usage-summary',{
                                source: this.props.source,
                                start_date: this.props.start_date,
                                end_date: this.props.end_date,
                                data:data.diskUsageData
                            });
                        } else {
                            console.log("no data to show");
                        }
                    }
                }.bind(this))
                .fail(function (err) {
                    datamanager.setDataSource('memory-usage-summary',{
                        source: this.props.source,
                        start_date: this.props.start_date,
                        end_date: this.props.end_date
                    });
                }.bind(this));

        }.bind(this);
        callSource();

        window.setInterval(function () {
            callSource();
            this.lineChart.setState(state);
            state.d3node = this.lineChart.render();
            this.setState(state);
        }.bind(this), Number(this.props.refresh));
    },

    getRealTime: function () {

        var startTime = function () {
            var today = new Date();
            currentDateTime = today.toString();
            t = setTimeout(function () {
                startTime()
            }, 500);
        }
        startTime();
    },

    render: function() {
        this.getRealTime();
        if (this.state.d3node != null) {
            var LineChart = this.state.d3node.toReact();
            return (<div>
                        <div>
                          <h3><b>{this.props.title}</b></h3>
                          <div className="frm-panel-heading frm-panel-standar">
                          </div>
                          <div className="frm-panel">
                            <div className="frm-bold-text frm-secondary-text">
                                <h2 id="currentDate"
                                    className="pull-right frm-chart-title">
                                    {currentDateTime}
                                </h2>
                            </div>
                            <div
                               ref={(ref) => this._dcontainer = ref }
                              className="d3-container text-center">
                              {LineChart}
                            </div>
                          </div>
                        </div>
                    </div>);
        } else {
            return (<div ref={(ref) => this._dcontainer = ref }>
                    loading..</div>);
        }
    }

});

module.exports = lineChartDetail;
