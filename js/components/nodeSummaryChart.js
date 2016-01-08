// usage Summary display current instances,memory,vCPUs and disk vs quota
var React = require('react');
var ReactDOM = require('react-dom/server');
var ElementSummary = require('./elementSummary.js');

var nodeSummaryChart = React.createClass({

    getDefaultProps: function() {
        return {};
    },
    componentDidMount: function() {
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        return this.props !== nextProps;
    },
    render: function() {
        console.log(this.props);
        console.log("propiedades",this.props.elements);
        var dynamicWidth = Math.round(12 / this.props.elements.length);
        var elements = [];
        if (this.props.elements) this.props.elements.forEach(
            (props) => {
                elements.push(
                    <div key={props.name} className={"col-xs-12 col-sm-12"}>
                        <ElementSummary {...props}/>
                    </div>);
                }
        );

        return (
            <div className="row">
                {elements}
            </div>);
    }

});

module.exports = nodeSummaryChart;
