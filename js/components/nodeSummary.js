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
        console.log("rendering");

        if(this.props.sections.length > 0){
            console.log(this.props.sections.length);
            var section = function (data) {
                return (
                <div className="element-summary-panel">
                    <div className={"frm-panel-default frm-panel-title-"+data.name}>
                        <div className="frm-bold-text">{data.name} </div>
                    </div>
                    <div className="panel frm-panel frm-panel-default">
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
            console.log(sections);
            console.log(sections);
            return (
                    <div className="element-summary-panel">
                        <div className="frm-panel-heading frm-panel-regular">
                        </div>
                        <div className="panel frm-panel frm-panel-default">
                            <div className="panel-body">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <h4 className="frm-bold-text pull-left">
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
