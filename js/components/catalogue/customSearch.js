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

var customSearch = React.createClass({

    getInitialState: function() {
        return {};
    },
    render: function() {

        return (
            <div className="form-horizontal">
                <div className="input-group add-padding-left">
                    <input type="text" className="form-control"
                        placeholder={this.props.title} />
                    <div className="input-group-addon frm-btn-primary">
                        <span className="glyphicon glyphicon-search ">
                        </span>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = customSearch;
