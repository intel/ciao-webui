// React js login compoment
var React = require('react');
var reactBootstrap = require('react-bootstrap');
var Input = reactBootstrap.Input;
var ButtonInput = reactBootstrap.ButtonInput;

var loginForm = React.createClass({

    getInitialState: function() {
        return {
            showMsgWarning: false
        };
    },

    renderMessage: function() {
        if (this.state.showMsgWarning) {
            return (<div className="alert frm-alert-warning-icon" role="alert">
                The username or password you entered is not correct. Please, verify and try again
            </div>);
        } else {
            return null;
        }
    },

    // This functions executes when the user attempts to log in
    loginClick: function () {
        var credentials = {};
        credentials.username = document.getElementById("input-username").value;
        credentials.password = document.getElementById("input-password").value;

        // TODO: validate inputs (credentials)
        // ... validate parameters
        var url = "/authenticate/login";
        $.post({
                url:"/authenticate/login",
                data:credentials
            })
            .done(function (response) {
                this.setState({'showMsgWarning': false});
                if(response.next) {
                    console.log(response);
                    window.location.replace(response.next);
                }
            }.bind(this))
            .fail(function (err) {
                this.setState({'showMsgWarning': true});
                console.log('err', err);
            }.bind(this));
    },

    inputPressEnter: function (event) {
        if (event.keyCode == 13 || event.which == 13) {
            this.loginClick();
        }
    },

    render: function() {
        return (<div className="col-xs-6 col-md-4">
                <h6 className="frm-bold-text">Log In</h6>

                {this.renderMessage()}
                <form className="frm-login-container">
                    <Input type="text" label="Username"
                        onKeyPress={this.inputPressEnter}
                        id="input-username"
                        name="username"/>

                    <Input type="password" label="Password"
                        onKeyPress={this.inputPressEnter}
                        id="input-password" name="password"/>

                    <ButtonInput onClick={this.loginClick}
                        bsStyle={null}
                        className="btn frm-btn-primary pull-right"
                        type="button" value="Log In" />
                </form>
            </div>);
    }

});


module.exports = loginForm;
