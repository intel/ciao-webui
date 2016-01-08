// React js component
var React = require('react');
var CustomeCatalogue = require('./catalogue/customeCatalogue.js');

var instancesHost = React.createClass({
    getDefaultProps: function() {
        // source defaults to server details url
        return {
            data: []
        };
    },
    startInstance: function(elements) {
        console.log('Starting instance: ', elements);
        elements.forEach((el) => {
            var url = "/data/" +
                datamanager.data.activeTenant.id+
                //TODO: not having tenant_id may cause bugs for users with more than one tenant
                    // el.tenant_id +
                    "/servers/" + el.instance_id + "/action";
            $.post({
                url: url,
                data: {server:el.instance_id, action:"os-start"},
                dataType: "application/json"
            })
            .done((data) => {
                console.log(data);
            }).fail((err) => {
                console.log(err);
            });
        });
    },
    stopInstance: function(elements) {
        console.log('Stopping instance: ', elements);
        elements.forEach((el) => {
            var url = "/data/" +
                datamanager.data.activeTenant.id+
                    //el.tenant_id +
                    "/servers/" + el.instance_id + "/action";
            $.post({
                url: url,
                data: {server:el.instance_id, action:"os-stop"},
                dataType: "application/json"
            })
            .done((data) => {
                console.log(data);
            }).fail((err) => {
                console.log(err);
            });
        });
    },
    deleteInstance: function(elements) {
        console.log('deleting instance: ', elements);
        elements.forEach((el) => {
            var url = "/data/" +
                datamanager.data.activeTenant.id+
                //el.tenant_id +
                    "/servers/" + el.instance_id ;
            console.log(url);
            $.ajax({
                url: url,
                type: "DELETE",
                data: {server:el.instance_id, action:"os-delete"},
                dataType: "application/json"
            })
            .done((data) => {
                console.log(data);
            }).fail((err) => {
                console.log(err);
            });
        });
    },
    confirmDelete: function(){
        this.refs.catalogue.showModal({
            title:'Remove Instance(s)',
            body:"You're about to remove an instance, this may result in "+
                    "a loss of data. Are you sure you want to remove?",
            onAccept:this.deleteInstance,
            acceptText:'Remove'
        });
    },
    disabledStartButton: function(item){
        var disabled = true;
        if(item.length > 0){
            var firstElement = item[0];
            if(firstElement.State != 'running'
                && firstElement.State != 'starting') {
                disabled = false;
            }
        }
        return disabled;
    },
    disabledStopButton: function(item){
        var disabled = true;
        if(item.length > 0){
            var firstElement = item[0];
            if(firstElement.State != 'stopped'
            && firstElement.State != 'exited') {
                disabled = false;
            }
        }
        return disabled;
    },
    disabledRemoveButton: function(item){
        var disabled = true;
        if(item.length > 0){
            disabled =  false;
        }
        return disabled;
    },
    getActions: function(){
        return [
            {
                label:'Start',
                name:'start',
                onClick:this.startInstance,
                onDisabled:this.disabledStartButton
            },
            {
                label:'Stop',
                name:'stop',
                onClick:this.stopInstance,
                onDisabled:this.disabledStopButton
            },
            {
                label:'Remove',
                name:'remove',
                onClick:this.confirmDelete,
                onDisabled:this.disabledRemoveButton
            }
        ];
    },
    getDropdownActions: function(){
        return [
            {
                label:'All Running',
                name:'running',
                query:{'State':'running'}
            },
            {
                label:'All Stopped',
                name:'stopped',
                query:{'State':'exited'}
            }
        ];
    },
    getSearchfields: function(){
        return  ['instance_label', 'instance_state', 'instance_tags'];
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },
    componentDidMount: function() {
        console.log("component did mount");
        var callSource = function () {
            $.get({
                url:this.props.source})
                .done(function (data) {
                    if (data) {
                        console.log(data);
                        datamanager.setDataSource(
                            this.props.dataKey,
                            {
                                dataKey: this.props.dataKey,
                                source: this.props.source,
                                data:data
                            });
                    }
                }.bind(this))
                .fail(function (err) {
                    datamanager.setDataSource(this.props.dataKey,{
                        dataKey: this.props.dataKey,
                        source: this.props.source,
                        data: []
                    });
                }.bind(this));
        }.bind(this);
        callSource();

        window.setInterval(function () {
            callSource();
        }.bind(this),3000);
    },

    render: function() {
        console.log("instancesHost rendered");
        var columns = [];
        if (this.props.data.length > 0) {
        columns = Object.keys(this.props.data[0]).map(function(text){
            return text.replace('_', ' ');
        });
        }
        console.log(columns);
        if (this.props.data)

        return (
            <CustomeCatalogue
                data={this.props.data}
                columns={columns}
                actions={this.getActions()}
                dropDownActions={this.getDropdownActions()}
                searchFields={this.getSearchfields()}
                ref="catalogue"
            />);
        else
            return (<div/>);
    }
});

module.exports = instancesHost;
