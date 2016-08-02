var React = require('react');
var ReactDOM = require('react-dom');
var d3LineChartDetail = require("../d3_components/d3LineChartDetail.js");
var dom = require("react-faux-dom");
//var $ = require('jquery');

var lineChartDetail = React.createClass({

    datepicker: {},
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
        $(".lc-datepicker").datepicker({
            onSelect: this.updateTimeFrame
        });
    },

    lineChart: null,

    componentDidMount: function() {
        //set up Datepicker widget

        // TO DO: Refactor code for create and update chart
        // Current behaviour is not the expected
        $(".lc-datepicker").datepicker({
            onSelect: this.updateTimeFrame
        });

        var n = dom.createElement('svg');
        var bundle = {props: this.props};

        if (this._dcontainer) {
            bundle.dimensions = {};
            if (this._dcontainer.offsetWidth > 50)
                bundle.dimensions.width = this._dcontainer.offsetWidth;
            if (this._dcontainer.offsetHeight > 50)
                bundle.dimensions.height = this._dcontainer.offsetHeight;
        }
        this.lineChart = d3LineChartDetail.create(n, bundle, this.state);
        this.setState({d3node: this.lineChart.render()});
    },

    updateTimeFrame: function (dateObj) {
        var state = {};

        state.timeFrom = new Date(this.datepicker.from.value);
        state.timeTo = new Date(this.datepicker.to.value);

/* Functional code for connect data begin*/

        // TO DO: relocate this function in the proper placeholder
        // Current behaviour: is working with duplicated code for testing
        // purposes

        var callSource = function () {
            if (this.state.updating == true)
                return;
            this.setState({updating: true});

            var n = dom.createElement('svg');
            var bundle = {props: this.props};

            console.log("bundle",bundle);

            if (this._dcontainer) {
                bundle.dimensions = {};
                console.log("www", this._dcontainer.offsetWidth);
                console.log("hhh", this._dcontainer.offsetHeight);
                if (this._dcontainer.offsetWidth > 50)
                    bundle.dimensions.width = this._dcontainer.offsetWidth;
                    bundle.dimensions.height = this.props.height;
            }
            this.lineChart.setData(this.props.data);
            this.lineChart = d3LineChartDetail.create(n, bundle, this.state);
            this.setState({d3node: this.lineChart.render()});

            var url;
            var memoryUsageData = [];

            if (!datamanager.data.activeTenant){
                // admin
            } else {
                // tenant
                url = "/data/"+datamanager.data.activeTenant.id+
                    this.props.source+"?start_date="+(state.timeFrom).toISOString()+
                    "&end_date="+(state.timeTo).toISOString();
            }
            $.get({
                url:url})
                .done(function (data) {
                    var fmtData;
                    if (data) {
                        if (this.props.title === "Memory usage") {
                            data.usage.forEach((rowData) => {
                                memoryUsageData.push({
                                    dateValue : new Date(rowData.timestamp),
                                    usageValue: rowData.ram_usage
                                });
                            });
                            console.log("MemoryUsageData ",this.props.data);
                            this.setState({updating: false});
                            datamanager.setDataSource('memory-usage-summary',{
                                source: this.props.source,
                                start_date: state.timeFrom.toISOString(),
                                end_date: state.timeFrom.toISOString(),
                                data:memoryUsageData
                            });
                        } else {
                            console.log("no data to show");
                        }
                        /*} else {
                            console.log("no entro");
                            this.setState({updating: false});
                            datamanager.setDataSource('memory-usage-summary',{
                                source: this.props.source,
                                start_date: this.props.start_date,
                                end_date: this.props.end_date,
                                data:data
                            });
                        }*/
                    }
                }.bind(this))
                .fail(function (err) {
                    this.setState({updating: false});
                    datamanager.setDataSource('memory-usage-summary',{
                        source: this.props.source,
                        start_date: this.props.start_date,
                        end_date: this.props.end_date});
                }.bind(this));

        }.bind(this);
        callSource();

        window.setInterval(function () {
            callSource();
            this.lineChart.setState(state);
            state.d3node = this.lineChart.render();
            this.setState(state);
        }.bind(this), Number(this.props.refresh));


/* Functional code for connect data ends*/

        //console.log("propiedades", this.props);


        //console.log("de",state.timeFrom);
        //console.log("a ",state.timeTo);
        //time to goes to the end of the day
        //state.timeTo.setMinutes(1439);
        //update state only if date is valid
        /*if (!isNaN(state.timeFrom.getTime()) &&
            !isNaN(state.timeTo.getTime())) {*/
            this.lineChart.setState(state);
            state.d3node = this.lineChart.render();
            this.setState(state);
        //}
    },

    getTimeFrameControl: function () {

        return (
            <div className="line-chart-time-control">
                <select className="btn frm-btn-secondary col-md-2">
                    <option>Today</option>
                    <option>Last 7 Days</option>
                </select>
                <div className="line-chart-date-form
                                col-md-6 pull-right">
                    <div className="col-md-5 ">
                        <div className="glyphicon input-group">
                            <input
                                ref={(ref) => this.datepicker.from = ref}
                                placeholder="MM/DD/YY"
                                className="form-control lc-datepicker"
                                type="text"
                                onChange={this.updateTimeFrame}
                                value={this.state.timeFrom
                                    .toLocaleString().split(',')[0]}
                            />
                            <span className=
                                  "input-group-addon glyphicon-calendar"/>
                        </div>
                    </div>
                    <span className="col-md-2">to</span>
                    <div className="col-md-5 ">
                        <div className="glyphicon input-group">
                            <input
                                ref={(ref) => this.datepicker.to = ref}
                                placeholder="MM/DD/YY"
                                className="form-control lc-datepicker"
                                type="text"
                                onChange={this.updateTimeFrame}
                                value={this.state.timeTo
                                    .toLocaleString().split(',')[0]}
                            />
                            <span className=
                                  "input-group-addon glyphicon-calendar" />
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    render: function() {
        console.log("propiedades", this.props);
        if (this.state.d3node != null) {
            var LineChart = this.state.d3node.toReact();
            return (<div>
                        <div>
                          <h3><b>{this.props.title}</b></h3>
                          <div className="frm-panel-heading frm-panel-standar">
                          </div>
                          <div className="frm-panel">
                            {this.getTimeFrameControl()}
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
