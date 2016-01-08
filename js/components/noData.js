// React js component
var React = require('react');
var reactBootstrap = require('react-bootstrap');


var noData = React.createClass({

    render: function() {
        return (
                <div className="alert frm-alert-information-icon" role="alert">
                    <i className="glyphicon glyphicon-info-sign frm-icon">
                    </i>
                    There is currently no relevant information
                 </div>
            )
    }
});

module.exports = noData;
