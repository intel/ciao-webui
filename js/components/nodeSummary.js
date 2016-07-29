// React js component
var React = require('react');
var reactBootstrap = require('react-bootstrap');
var NodeSummaryChart = require('./nodeSummaryChart.js');
var NoData = require('./noData.js');

var nodeSummary = React.createClass({

    getInitialState: function() {
        return {
            updating: false,
            logger: null
        };
    },

    componentDidMount: function() {
        var update = function () {
            if (this.state.updating == true)
                return;
            this.setState({updating: true});
            $.get({
                url:"/data/nodes/summary"
            }).done(function (data) {
                if (data) {
                    var sections = [];
                    for(key in data.cluster) {
                        sections.push({
                            name: key,
                            number:data.cluster[key]
                        });
                    }
                    fmtData = {
                        sections:sections,
                    usageSummary:{
                        elements:[]
                    }};
                    this.setState({updating:false});
                    datamanager.setDataSource('node-summary',fmtData);
                }
            }.bind(this))
                .fail(function (err) {
                    console.log("Error:",err);
                    if (this.props.logger != null) {
                        this.props.logger.error(
                            err.responseJSON.error.title,
                            err.responseJSON.error.message);
                    }
                });
        }.bind(this);
        update();
        window.setInterval(function () {
            update();
        }.bind(this), 2000);
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        if(nextState.updating != this.state.updating)
            return false;
        return true;
    },

    render: function() {
        var panelTitle;

        if(this.props.sections.length > 0){
            var section = function (data) {
                if(data.name==="total_nodes"){
                    panelTitle = (data.name).substring(6);
                } else {
                    panelTitle = (data.name).substring(12);
                }
                return (
                <div className="element-summary-panel">
                    <div className={"frm-panel-default frm-panel-title-"+panelTitle}>
                        <div className="frm-bold-text">{panelTitle}</div>
                    </div>
                    <div className="panel frm-panel frm-panel-default frm-panel-pull-left">
                        <h6 className="frm-bold-text">
                            {data.number}
                        </h6>
                    </div>
                </div>);
            };

            var sections = this.props.sections.map(function(data, i){
                return (
                    <div className="col-xs-6" key={i}>
                    {section(data)}
                    </div>
                );
            });

            return (
                    <div className="element-summary-panel">
                        <div className="frm-panel-heading frm-panel-regular">
                        </div>
                        <div className="panel frm-panel frm-panel-default">
                            <div className="panel-body">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <h4 className="frm-bold-text frm-secondary-text pull-left">
                                            Node Summary
                                        </h4>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-8">
                                        <div className="row">
                                            {sections}
                                        </div>
                                    </div>
                                    <div className="col-xs-4">
                                        <div className="row">
                                            <NodeSummaryChart {...this.props}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>);
        }else{
           return  <NoData />;
        }

    }
});


module.exports = nodeSummary;
