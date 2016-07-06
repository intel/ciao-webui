// usage Summary display current instances,memory,vCPUs and disk vs quota
var React = require('react');
var ReactDOM = require('react-dom/server');
var d3Element = require("../d3_components/d3DonutChartSummary.js");
var dom = require("react-faux-dom");

var nodeSummaryChart = React.createClass({

    getInitialState: function() {
        return {
            d3node: null
        };
    },
    getDefaultProps: function() {
        var base = 250;
        return {
            width: base,
            height: base * 1.3,
            DonutChart: null
        };
    },
    componentDidMount: function() {
        var callSource = function () {
            var n = dom.createElement('svg');
            n = d3Element.create(n, this.props, null);
            n = d3Element.update(n, this.props, null);
            this.setState({d3node:n});

        }.bind(this);
        callSource();

        window.setInterval(function () {
            callSource();
        }.bind(this),2000);
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        return true;
    },

    render: function() {

        if (this.state.d3node != null) {
            var DonutChart = this.state.d3node.toReact();
            return (
                <div>
                <div className="d3-container text-center">
                {DonutChart}
                </div>
                </div>
            );
        } else {
            return (<div>loading..</div>)
        }
    }

});

module.exports = nodeSummaryChart;
