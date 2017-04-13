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

var React = require('react');
var ReactDOM = require('react-dom/server');


var overview = React.createClass({

    componentDidMount: function() {
    },
    componentDidUpdate: function(prevProps, prevState, rootNode) {
    },
    render: function() {

        var len = this.props.tags.length - 1;
        var tags = this.props.tags.map(function(tag, i){
            tag = (i < len)?tag + ' ,':tag;
            return <span key={i}> {tag}
                   </span>;
        });
        return (
            <div className="row add-margin-bottom">
              <div className="col-xs-2">
                <div className="state-ready frm-bold-text">
                    {this.props.state}
                </div>
                <div className="frm-secondary-text frm-bold-text">
                  CPU
                </div>
                <div className="frm-bold-text">
                  {this.props.cpu}
                </div>
              </div>
              <div className="col-xs-6">
                <div className="frm-secondary-text frm-bold-text">
                  Tags
                </div>
                <div className="frm-bold-text">
                  {tags}
                </div>
              </div>
              {(() => {if(this.props.geography)(
                  <div className="col-xs-2">
                      <div className="frm-secondary-text frm-bold-text">
                        Geography
                      </div>
                      <div className="frm-bold-text">
                        {this.props.geography}
                      </div>
                  </div>
              )})()}
              <div className="col-xs-2">
               <div className="frm-secondary-text frm-bold-text">
                  Node UUID
                </div>
                <div className="frm-bold-text">
                  {this.props.rack_identifier}
                </div>
              </div>
        </div>);
    }

});

module.exports = overview;
