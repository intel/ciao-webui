/* Copyright (c) 2017 Intel Corporation

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

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
    getDropdownActions: function(){
        return [
            {
                label:'All',
                name:'all',
                query: {'status':'all'}
            },
            {
                label:'None',
                name:'none',
                query: {'status':'none'}
            }
        ];
    },
    render: function() {
        var columns = [];
        if (this.props.data) {
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
            id='cnci_uuid'
            actions={this.getActions()}
            dropDownActions= {this.getDropdownActions()}
            searchFields={this.getSearchfields()}
            searchTitle= 'Search Network'
            />
        );
    }
});

module.exports = networkCnci;
