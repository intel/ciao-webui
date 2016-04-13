var React = require('react');
var ReactDOM = require('react-dom/server');

// InstancesGroup is a single group of instances shown inside the Group Overview

var instancesGroup = React.createClass({

    componentDidMount: function(rootNode) {
    },
    componentDidUpdate: function(prevProps, prevState, rootNode) {
    },
    render: function() {
        //h4  {this.props.instances.length}
        //h4 { this.props.instances.filter( (i) =>
        ///                       i.instance_state == "running" ).length}
        var getBody = function () {
            return (<div className="panel-body">
                    <div className="frm-panel-title">
                        {this.props.name}
                    </div>
                    <div className="row">
                        <div className="col-xs-6 text-center">
                            <h4>
                            </h4>
                            <h3 className="frm-secondary-text">
                                {this.props.totalInstances} Instances
                            </h3>
                        </div>
                        <div className="col-xs-6 text-center">
                            <h4>
                            </h4>
                            <h3 className="frm-secondary-text">
                                {this.props.totalRunningInstances} Running
                            </h3>
                        </div>
                    </div></div>
                   );
                   }.bind(this);

        return (
            <div group={this.props.name}>
                <div className="frm-panel-heading frm-panel-standar">
                </div>
                <div className="panel frm-panel frm-panel-default">
                  {(function(){
                      if (this.props.name)
                          return getBody();
                      else
                          return (<h3 className="frm-secondary-text">
                                  Loading..</h3>);
                  }.bind(this))()}
                </div>
            </div>);
    }

});

module.exports = instancesGroup;
