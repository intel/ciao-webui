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
