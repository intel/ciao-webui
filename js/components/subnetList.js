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
var List = require('./list.js');

var $ =require('jquery')

var subnetList = React.createClass({

    componentDidMount: function() {

        var update = function () {
            $.get({url: this.props.source})
                .done(function (data) {

                    if (data) {
                        var fmtData = {
                            source: this.props.source,
                            data: data.subnets
                        };

                        datamanager.setDataSource('subnet-list',fmtData);
                    }
                }.bind(this));
        }.bind(this);

        update();
        window.setInterval(update,2000);
    },
    getData: function(data){
        var count = 0,
            result = [];

        if(data){
            count = Math.ceil(data.length / 10)
            var rest = data.length % count,
                restUsed = rest,
                partLength = Math.floor(data.length / count);


            for(var i = 0; i < data.length; i += partLength) {
                var end = partLength + i,
                    add = false;

                if(rest !== 0 && restUsed) {
                    end++;
                    restUsed--;
                    add = true;
                }

                result.push(data.slice(i, end));

                if(add) {
                    i++;
                }
            }
        }

        return result;
    },
    render: function() {

        var dataList = this.getData(this.props.data);
         var sourceData = {
            body:[],
            header:'Subnet ID',
            /*link:{
                url:'/admin/network/'+datamanager.data.idNetwork+'/subnet/',
                field:'subnet_cidr'
            },*/
            label:{
                field:'subnet_cidr'
            }
        };

        var lists = []

        for(var key in dataList) {
            sourceData.body = dataList[key];
            lists.push(
                <div key={key} className="col-xs-2">
                    <List {...sourceData}/>
                </div>);
        }

        return (<div className="row">
                    {lists}
                </div>);
    }
});

module.exports = subnetList;
