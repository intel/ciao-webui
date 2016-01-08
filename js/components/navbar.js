var React = require('react');

var reactBootstrap = require('react-bootstrap');
var Navbar      = reactBootstrap.Navbar;
var Nav         = reactBootstrap.Nav;
var NavDropdown = reactBootstrap.NavDropdown;
var MenuItem    = reactBootstrap.MenuItem;

var navbar = React.createClass({

    getInitialState: function() {
        //state for this component will be the current project/tenant
        // default project is the first on the props.tenants array
        return {
            tenant: this.props.activeTenant
        };
    },
    chooseTenant: function(event, tenant) {
        this.setState({tenant: tenant });
        datamanager.data.activeTenant = tenant;
        datamanager.trigger('update-active-tenant')
    },
    logout: function (event) {
        $.post(this.props.logoutUrl,
              function (response) {
                  if(response) {
                      window.location.replace(response.next);
                  }
              });
    },
    getUserMenu: function () {
        return (
            <NavDropdown title={"Logged in as "+this.props.username}
                id="basic-nav-dropdown">
                <MenuItem  onClick={this.logout}>
                    Log out
                </MenuItem>
            </NavDropdown>);
    },
    getTenantMenu: function () {

        var title = (this.state.tenant)?this.state.tenant.name:'';

        if(this.props.tenants && this.props.tenants.length > 0){

            var tenants =  this.props.tenants
                    .map((tenant, i) => (
                        <MenuItem onSelect={this.chooseTenant}
                    eventKey={tenant} key={i}>
                        {tenant.name}
                </MenuItem>));

            return (
                <NavDropdown   title={title}
            id="basic-nav-dropdown" >
                {tenants}
                </NavDropdown>);
        }else{
            <div></div>
        }

    },

    render: function() {
        var titleNavBar   = "";
        var titleNavBrand = "";
        var tenantsMenu   = "";
        var userMenu      = "";
        var route         = ""

        if(this.props.username){
            titleNavBar = "Logged in as "+this.props.username;
            tenantsMenu = this.getTenantMenu();
            userMenu = this.getUserMenu();
        }

        if(this.props.back){
                titleNavBrand = this.props.back.label;
                route = this.props.back.url;
            }else {
                titleNavBrand = "CIAO";
                route = "#";
            }

        return (
            <Navbar className="frm-navbar navbar-fixed-top" inverse>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href={route}>{titleNavBrand}</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>
                        {userMenu}
                        {tenantsMenu}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );

    }
});

module.exports = navbar;
