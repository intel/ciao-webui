// React js component
var React = require('react');
var reactBootstrap = require('react-bootstrap');
var ButtonToolbar = reactBootstrap.ButtonToolbar;
var Dropdown = reactBootstrap.Dropdown;
var MenuItem = reactBootstrap.MenuItem;
var Button = reactBootstrap.Button;

var CustomeSearch = require('./customeSearch.js');

var tableActionToolbar = React.createClass({

    getInitialState: function() {
        return {};
    },
    isButtonDisabled: function(buttonName){

        return this.props.disabledButtons.find(function(item){
            return item == buttonName;
        });
    },
    render: function() {

        var buttons = this.props.buttonItems.map((item, i) => {

                return  <Button bsStyle="primary" key={i}
                            disabled={item.onDisabled(this.props.selectedInstance)}
                            onClick={item.onClick.bind(null,
                                this.props.selectedInstance)}>
                            {item.name}
                        </Button>;
            });



        var dropDownActions = this.props.dropDownActions.map((item, i) => {

                return  <MenuItem bsStyle="primary" key={i}
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
                                <Dropdown.Toggle bsStyle="primary">
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
                        <CustomeSearch title="Search Instances" />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = tableActionToolbar;
