// React js component
var React = require('react');
var reactBootstrap = require('react-bootstrap');
//var NodeSummaryChart = require('./nodeSummaryChart.js');
var NoData = require('./noData.js');

var nodeSummary = React.createClass({

    componentDidMount: function() {
        var update = function () {
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
                    console.log("nodes summary data");
                    console.log(fmtData);
                    datamanager.setDataSource('node-summary',fmtData);
                }
            });
        }.bind(this);
        update();
        window.setInterval(function () {
            update();
        }.bind(this), 2000);
    },

    render: function() {
        console.log(this.props);
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
