// Messages/Logger React component

var React = require('react');

var messages = React.createClass({

    render: function() {
	console.log("current data");
	console.log(this.props.data);
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

	return (
		<div className="col-xs-3">
		    {rows}
        	</div>
	);
    }
});

module.exports = messages;
