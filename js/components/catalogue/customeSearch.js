// React js component
var React = require('react');

var customeSearch = React.createClass({

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

module.exports = customeSearch;
