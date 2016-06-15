// React js component
var React = require('react');
var CustomCatalogue = require('./catalogue/customCatalogue.js');

var networkCnci = React.createClass({

    getInitialState: function() {
        return {
            updating: false,
            count: 0
        };
    },

    restart: function(item) {
        console.log('Restaring instance: ', item);
        //TODO: Change state in server. Changing locally just for testing
    },

    getDefaultProps: function () {
        // source defaults to server details url
        return {
            count : 0,
            limit : 10
        };
    },

    disabledRestartButton: function(item){

        var disabled = true;
        if(item.length > 0){
            disabled =  false;
        }
        return disabled;
    },

    getActions: function(){
        return [
                {
                    label:'Restart',
                    name:'restart',
                    onClick:this.restart,
                    onDisabled:this.disabledRestartButton
                }
            ];
    },

    getSearchfields: function(){
        return ['tenant', 'geography', 'rack_identifier'];
    },

    componentDidMount: function() {

        // function used on time interval to keep component updated
        var update = function () {
            if (this.state.updating == true)
                return;
            this.setState({updating: true});

            $.get({url: this.props.source})
                .done(function (data) {
                    if (data) {
                        var fmtData = {
                            source:this.props.source,
                            count: (data.cncis).length,
                            data:data.cncis.map((cnci) => {
                                var fmtCnci = {};
                                for(key in cnci) {
                                    switch (key) {

                                        case 'id':
                                        fmtCnci.cnci_uuid = cnci.id;
                                        break;

                                        case 'subnets':
                                        var subnetString = "";
                                        cnci.subnets.forEach((val) => {
                                            subnetString += val.subnet_cidr+" ";
                                        });
                                        fmtCnci.subnets = subnetString;
                                        break;

                                        default:
                                        fmtCnci[key] = cnci[key];
                                        break;
                                    }
                                }
                                return fmtCnci;
                            })};

                        this.setState({updating: false});
                        datamanager.setDataSource('network-cnci',fmtData);
                    }
                }.bind(this));;
        }.bind(this);

        update();
        window.setInterval(update,2000);
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        if (nextState.updating != this.state.updating)
            return false;
        return true;
    },

    render: function() {
        var columns = [];
        if (this.props.data) {
            //this.props.count = (this.props.data).length;
            //console.log("count2", this.props.count);
            columns= Object.keys(this.props.data[0]).map(function(text){
                return text.replace('_', ' ');
            });
        }

        var link = {
            field:'cnci_uuid',
            url:'/admin/network/'
        };

        return (
        <CustomCatalogue
            data={this.props.data}
            count = {this.props.count ? this.props.count:10}
            link={link}
            columns={columns}
            actions={this.getActions()}
            searchFields={this.getSearchfields()}
            />
        );
    }
});

module.exports = networkCnci;
