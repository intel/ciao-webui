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
