// React js component
var React = require('react');
var reactBootstrap = require('react-bootstrap');

var instancesCounter = React.createClass({
    getDefaultProps: function() {
        // source defaults to server details url
        return {
            data: {}
        };
    },
    componentDidMount: function() {
        var callSource = function () {
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
                        var data = {total_instances: instancesQuota};
                    }
                    datamanager.setDataSource('instances-counter',{
                        source: this.props.source,
                        data:data
                    });
                    console.log(data);
                }.bind(this))
                .fail(function (err) {
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
        return true;
    },
    render: function() {
        console.log(this.props);
        console.log("total Instances",this.props.data.total_instances);

        return (
            <div className="element-summary-panel">
                <div className="panel frm-panel frm-panel-default">
                    <div className="panel-body">
                        <h2 className="frm-bold-text pull-left">
                           Instances
                        </h2>
                        <h6 className="frm-bold-text pull-left">
                            {this.props.data.total_instances}
                        </h6>
                    </div>
                </div>
            </div>
        );
    }
});


module.exports = instancesCounter;
