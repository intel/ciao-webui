// Messages/Logger React component

var React = require('react');

var messages = React.createClass({

    refLogElement: null,

    toggle: function () {
        $(".log-content").slideToggle(200);
    },

    removeRow: function (id) {
        return function() {
            logger.remove(id);
        }.bind(this);
    },

    removeAll: function () {
        logger.removeAll();
    },

    render: function() {

        var count = 0; //String that holds the number of messages
        var rows = this.props.data.map((row) => {
            var type;
            switch (row.type) {
            case "error":
                type = "alert-danger";
                break;
            default:
                type = "alert-info";
            }
            return (<div className={type}>
                    {row.title ? row.title: "Unknown error"}
                    <button
                    onClick={this.removeRow(row.id)}>x
                    </button></div>);
        });
        count = rows.length;

        $("#logger").removeClass();
        $("#logger").addClass("alert");
        count = rows.length;
        if (count == 1) {
            $("#logger").addClass(type);
        } else if (count > 1) {
            $("#logger").addClass("alert-warning");
        }
        else {
            $("#logger").addClass("hidden");
        }
        var toggle = this.toggle;
        console.log("count and rows",count,"rows:",rows);
         var render;
        if (count > 1) {
            console.log("render shouyld get value");
            render = <div>There are {count} unsersolved errors
                <span onClick={this.toggle}> <u>show details</u></span></div>;
        } else if (count === 1) {
            render = <div>{rows[0]}</div>;
        }
        console.log("render",render);
        return (
            <div>
                {render}
            <div className="log-content">
                {rows}
            </div>
            </div>
        );
    }
});

module.exports = messages;
