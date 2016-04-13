// single summary element, plugs into usageSummary compoenent

var React = require('react');
var ReactDOM = require('react-dom');
var d3Element = require("../d3_components/d3ElementSummary.js");
var dom = require("react-faux-dom");

var elementSummary = React.createClass({

    getInitialState: function() {
        return {
            d3node: null
        };
    },

    getDefaultProps: function() {
        // put some default data
        var base = 120;
        return {
            width: base,
            height: base * 1.5,
            DonutChart: null
        };
    },

    componentWillUpdate: function(nextProps,nextState) {

    },
    shouldComponentUpdate: function(nextProps, nextState) {
        //return this.props !== nextProps;
        return true;
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
    renderDonutChart: function(){
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
    },
    renderPanel: function(){
        var body = this.props.value;
        var title = this.props.name;
        var secondaryBody = (title == 'Memory' || title == 'Disk')?'MB':'';
        var secondaryTitle = (title == 'Processor')?'':'';
        return (
            <div className="element-summary-panel">
                <div className="frm-panel-heading frm-panel-standar">
                </div>
                <div className="panel frm-panel frm-panel-default frm-panel-remake">
                    <div className="panel-body">
                        <h6 className="frm-bold-text frm-body-h6">
                            {body}
                        </h6>
                        <div className="frm-secondary-text frm-bold-text">
                            {secondaryBody}
                        </div>
                    </div>
                </div>
                <div className="row" >
                    <div className="col-xs-12 text-center">
                        <div className="frm-bold-text">
                            {title}
                        </div>
                        <div className="frm-secondary-text">
                            {secondaryTitle}
                        </div>
                    </div>
                </div>
            </div>);
    },
    render: function() {
        if(this.props.quota){
            return this.renderDonutChart();
        }else{
            return this.renderPanel();
        }
    }

});

module.exports = elementSummary;
