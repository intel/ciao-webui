var React = require('react');
var InstancesGroup = require('./instancesGroup.js');

var groupOverview = React.createClass({
    getInitialState: function() {
        return {updates:0};
    },

    instancesWereAdded: function(){
        console.log('Instances were added - groupOverview');
    },

    flavorsDesc: [],

    loadFlavors: function () {
        if(this.flavorsDesc.length == 0)
            this.props.flavors.forEach(function (flavor) {
                $.get({url:this.props.detailUrl + "/flavors/" + flavor.id})
                    .done(function (data) {
                        if (data) {
                            this.flavorsDesc.push({
                                id:data.flavor.id,
                                disk:data.flavor.disk});
                            console.log("Retrieved flavor information:");
                            console.log(data);
                        }
                    }.bind(this));
            }.bind(this));
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return true;
    },

    componentDidMount: function() {
        this.loadFlavors();
        datamanager.addEvent('add-instances', function(){
            this.instancesWereAdded();
        }.bind(this));

        var update = function () {
            $.get({
                url: this.props.detailUrl + "/servers/detail"
            }).done(function (data) {
                var flavors = this.flavorsDesc;

                var fmtData = this.props.flavors.map(function (val) {
                    var disks = flavors.filter(
                        (element) => val.id == element.id);
                    var filteredData = data.filter(
                        (server) => server.Image == disks[0].disk);
                    val.totalInstances = filteredData.length;
                    val.runningInstances =filteredData.filter(
                        (x) => x.State == 'running').length;
                    return val;
                }.bind(this));
                this.setState({
                    updates:this.state.updates+1});
                datamanager.setDataSource('group-overview',
                                          {
                                              dataKey: 'group-overview',
                                              detailUrl: this.props.detailUrl,
                                              flavors:fmtData});
            }.bind(this))
                .fail(function (err) {
                    console.log("Group overview update failed: "+err);
                });
        }.bind(this);

        update();
        window.groupInterval = setInterval(update, 2000);
    },

    componentWillUnmount: function() {
        datamanager.clearEvent('add-instances');
    },
    render: function() {
        var groups = this.props.flavors
            .map((props, i) => (
                <div className="col-md-4" key={i}>
                    <InstancesGroup {...props}/>
                </div>));

        return (<div className="row">
                    {groups}
                </div>);
    }


});

module.exports = groupOverview;
