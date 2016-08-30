var React = require('react');
var ReactDOM = require('react-dom/server');
//var AddInstances = require('../components/addInstances.js');
var ElementSummary = require('./elementSummary.js');

// InstancesGroup is a single group of instances shown inside the Group Overview

var instancesGroup = React.createClass({

    componentDidMount: function(rootNode) {
    },
    componentDidUpdate: function(prevProps, prevState, rootNode) {
    },
    render: function() {
        var panelStyle;
        // Getting panel class
        if (this.props.quota !== 0) {
            // panel with chart
            panelStyle = "panel frm-panel frm-panel-default";
        } else {
            // empty panel
            panelStyle = "panel frm-panel frm-panel-secondary-full";
        }

        var getBody = function () {
            var chartWidth = 120;
            var chartHeight = chartWidth * 1.5;
            if (this.props.quota !== 0) {
                return (
                    <div className="panel-body">
                        <div className="frm-panel-title">
                            <h3 className="frm-bold-text frm-remake frm-secondary-text">
                                {this.props.name}
                            </h3>
                        </div>
                        <div className="row">
                            <div className="col-xs-6">
                                <div className="col-xs-9 frm-align-v">
                                    <h6 className="frm-bold-text frm-panel-pull-left">
                                        {this.props.quota}
                                    </h6>
                                </div>
                                <div className="col-xs-5">
                                    <h5 className="frm-bold-text frm-panel-pull-left">
                                        Instances
                                    </h5>
                                </div>
                            </div>
                            <div className="col-xs-6 text-center">
                                <div key={this.props.name}>
                                    <ElementSummary {...this.props}
                                    width={chartWidth}
                                    height={chartHeight}/>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="panel-body element-summary-panel">
                        <div className="frm-panel-title frm-align-v2">
                            <h4 className="frm-bold-text frm-remake">
                                No {this.props.name}
                            </h4>
                            <h4 className="frm-bold-text frm-remake">
                                Instances
                            </h4>
                        </div>
                        <div className="col-xs-12 frm-align-v2 add-padding-bottom">
                            <div  id="add-instances">

                            </div>
                        </div>
                    </div>
                );
            }
        }.bind(this);

        return (
            <div group={this.props.name}>
                <div className="frm-panel-heading frm-panel-standar">
                </div>
                <div className={panelStyle}>
                    {(function(){
                        if (this.props.name)
                            return getBody();
                        else
                            return (<h3 className="frm-secondary-text">
                                Loading..</h3>);
                    }.bind(this))()}
                    <div className="panel-footer frm-panel-footer-secondary">
                    </div>
                </div>
            </div>);
    }

});

module.exports = instancesGroup;
