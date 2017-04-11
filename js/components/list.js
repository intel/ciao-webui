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
var reactBootstrap = require('react-bootstrap');
var Table = reactBootstrap.Table;

var list = React.createClass({

    render: function() {
        var rows = [];
        if(this.props.body){
            var rows = this.props.body.map( (row, i) => {

                    var label = row[this.props.label.field];

                    if(this.props.link){
                        var link = this.props.link.url +
                            row[this.props.link.field];

                        return <tr  key={i} >
                                <td  key={i} >
                                    <a className={linkClass} href={link}>
                                        {label}
                                    </a>
                                </td>
                            </tr>;
                    }else{
                        return <tr  key={i} >
                                <td  key={i} >
                                    <span>
                                        {label}
                                    </span>
                                </td>
                            </tr>;
                    }

                });
        }

        return (<div>
                <Table bordered condensed hover>
                    <tbody>
                        <tr>
                            <td> 
                                <div className="frm-bold-text">
                                    {this.props.header}
                                </div>
                            </td>
                        </tr>
                        {rows}
                    </tbody>
                </Table>
            </div>);
    }
});

module.exports = list;
