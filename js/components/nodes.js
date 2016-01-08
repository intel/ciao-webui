// React js component
var React = require('react');
var CustomeCatalogue = require('./catalogue/customeCatalogue.js');
var $ = require('jquery')
var nodes = React.createClass({
    evacuateNode: function() { //this one
        if(!this.state.startDisabled){

            console.log(this.state.selectedInstance);
            console.log('Evacuating node: '+ this.state.selectedInstance);
            //TODO: Change state in server. Changing locally just for testing

        }
    },
    disabledEvacuate: function(){
        return true;
    },
    getActions: function(){
        return [
            {
                label:'Evacuate',
                name:'evacuate',
                onClick:this.evacuateNode,
                onDisabled:this.disabledEvacuate
            }
        ];
    },
    getDropdownActions: function(){
        return [
            {
                label:'All Ready',
                name:'ready',
                query: {'state':'ready'}
            },
            {
                label:'All Maintenance',
                name:'maintenance',
                query:{'state':'maintenance'}
            },
            {
                label:'All Full',
                name:'full',
                query:{'state':'full'}
            },
            {
                label:'All Offline',
                name:'offline',
                query:{'state':'offline'}
            }
        ];
    },
    getSearchfields: function(){
        return  ['status', 'utilization', 'geography'];
    },

    componentDidMount: function() {
        var update = function () {
            $.get({
            url: this.props.source})
            .done(function (data) {
                if (data) {
                    console.log("nodes");
                    console.log(data);
                    var fmtData = data.nodes.map((node) => {
                        /* If JSON object for node needs to be altered
                           do it here */
                        delete node.updated;
                        return node;
                        });
                    datamanager.setDataSource('nodes', {
                        source: this.props.source,
                        data: fmtData});
                }
            }.bind(this));
        }.bind(this);

        update();
        window.setInterval(update, 2000);
    },

    render: function() {
        var columns = [];
        if (this.props.data.length > 0) {
            columns = Object.keys(this.props.data[0]).map(function(text){
                return text.replace(/_/g, " ");
            });
        }

        var link = {
            field:'id',
            url:'/admin/machine/'
        };

        return (
            <CustomeCatalogue
                data={this.props.data}
                link={link}
                columns={columns}
                actions={this.getActions()}
                dropDownActions={this.getDropdownActions()}
                searchFields={this.getSearchfields()}
            />);
    }
});

module.exports = nodes;
