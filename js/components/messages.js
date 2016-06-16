// Messages/Logger React component

var React = require('react');

var messages = React.createClass({

    toggle: function () {
	$(".log-content").slideToggle(200);
    },
    
    render: function() {
	var count = ""; //String that holds the number of messages
	var rows = this.props.data.map((row) => {
	    var type;
	    switch (row.type) {
	    case "error":
		type = "alert-danger";
		break;
	    default:
		type = "alert-info";
	    }
	    return (<div className={type}> {row.title} : {row.message}</div>);
	});
	if (rows.length > 0)
	    count = "(" + rows.length + ")";

	return (
            <div>
                <div onClick={this.toggle} >Notifications {count}</div>	
		<div className="log-content">
		    {rows}
                </div>
	    </div>
	);
    }
});

module.exports = messages;
