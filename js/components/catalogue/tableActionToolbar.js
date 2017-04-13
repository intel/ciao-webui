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
var ButtonToolbar = reactBootstrap.ButtonToolbar;
var Dropdown = reactBootstrap.Dropdown;
var MenuItem = reactBootstrap.MenuItem;
var Button = reactBootstrap.Button;

var CustomSearch = require('./customSearch.js');

var tableActionToolbar = React.createClass({

    getInitialState: function() {
        return {};
    },
    render: function() {
        var buttons = this.props.buttonItems.map((item, i) => {

                var execute = item.onClick.bind(null, this.props.selectedInstance);

                return  <Button bsStyle={null}
                            className="btn frm-btn-primary"
                            key={i}
                            onClick={execute}
                            disabled={item.onDisabled(this.props.selectedInstance)}>
                            {item.name}
                        </Button>;
            });



        var dropDownActions = this.props.dropDownActions.map((item, i) => {

                return  <MenuItem bsStyle={null}  key={i}
                            onClick={item.onClick}>
                            {item.label}
                        </MenuItem>;
                });

        return (
            <div className="row add-margin-bottom">
                <div className="col-md-12">
                    <div className="pull-left">
                        <ButtonToolbar>
                            <Dropdown  id="dropdown-custom-1">
                                <Dropdown.Toggle bsStyle={null}
                                className="btn frm-btn-primary">
                                    <input type="checkbox" value="" />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {dropDownActions}
                                </Dropdown.Menu>
                            </Dropdown>
                            {buttons}
                        </ButtonToolbar>
                    </div>
                    <div className="pull-rigth">
                        <CustomSearch title={this.props.searchTitle} />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = tableActionToolbar;
