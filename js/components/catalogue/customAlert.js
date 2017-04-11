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

var customAlert = React.createClass({

    getInitialState: function() {
        return {};
    },
    render: function() {

        if(this.props.selectedPage){
            var selectedPage = this.props.selectedPage;
            var selectInPage = selectedPage.selectInPage == "0"
                            ? "No" : "All " + selectedPage.selectInPage;
            return  <div className={this.props.alertType}>
                        <span>
                            {selectInPage} {selectedPage.action} instances
                            on this page were selected.&nbsp;
                        </span>
                        <span className="frm-link"
                        onClick={selectedPage.onClick}>
                            Select all undisplayed&nbsp;
                            {selectedPage.action} instances.
                        </span>
                    </div>;
        }else{
            if(this.props.selectedAll){
                var selectedAll = this.props.selectedAll;
                var action = selectedAll.action == undefined ? " "
                            : " " + selectedAll.action + " ";
                return  <div className={this.props.alertType}>
                            <span>
                                All{action}instances were selected.&nbsp;
                            </span>
                            <span className="frm-link"
                                onClick={selectedAll.onClick}>
                                Clear selection
                            </span>
                          </div>;
            }else{
                return  <div className={this.props.alertType}>
                            {this.props.message}
                        </div>;
            }
        }
   }
});

module.exports = customAlert;
