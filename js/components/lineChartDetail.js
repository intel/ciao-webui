var React = require('react');
var ReactDOM = require('react-dom');
var d3LineChartDetail = require("../d3_components/d3LineChartDetail.js");
var dom = require("react-faux-dom");

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

        // timeframe: measured in days. 1 = 1 day

        return {
            width: 300,
            height: 350,
            timeframe: 1
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
        //time to goes to the end of the day
        state.timeTo.setMinutes(1439);
        //update state only if date is valid
        if (!isNaN(state.timeFrom.getTime()) &&
            !isNaN(state.timeTo.getTime())) {
            this.lineChart.setState(state);
            state.d3node = this.lineChart.render();
            this.setState(state);
        }
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
