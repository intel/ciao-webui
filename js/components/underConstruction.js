// React js component
var React = require('react');
var $ =require('jquery')

var constructionNotice = React.createClass({

    render: function() {

        return (<div className="row frm-notice-image">
            <span className="glyphicon glyphicon-time"
            aria-hidden="true">
            </span>
        </div>);
    }
});

module.exports = constructionNotice;
