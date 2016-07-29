// Messages/Logger React component

var React = require('react');

// utility function to renew token
var renew = {
    msg: "Renew token",
    fn: function () {
        $.post('../authenticate/renew')
            .done(function (resp) {
                logger.push("Token renewed!", "");
            })
            .fail(function (err) {
                console.log(err);
                logger.error("An error occurred", err.error.message);
            });
    }
};

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

    componentDidMount: function() {
        // Alert for token expiration time
        var update = function () {
            $.get('/authenticate/expires')
                .done(function (resp){
                    console.log("Asking for token expiration date", resp);
                    var current_time = new Date();
                    var expiration_time = new Date(resp.expires);
                    if (current_time.getTime() < expiration_time.getTime()) {
                        var remaining = Math.floor(
                            (expiration_time.getTime() -
                             current_time.getTime())/(1000 * 60));
                        if (remaining == 10)
                            logger.warning("Token about to expire",
                                           "Token will expire in less than "+
                                           remaining +" minutes",
                                          renew);
                        if (remaining == 5)
                            logger.error("Token about to expire",
                                           "Token will expire in less than "+
                                           remaining +" minutes",
                                          renew);
                    }
                })
                .fail(function (err){});
        };
        update();
        setInterval(update, 15000);
    },

    render: function() {

        var count = 0; // holds the number of messages
        var type;

        var rows = this.props.data.map((row) => {
            switch (row.type) {
            case "error":
                type = "alert-danger";
                break;
            case "warning":
                type = "alert-warning";
                break;
            default:
                type = "alert-success";
            }
            console.log("Action:", row.action);
            return (<div className={type}>
                    {row.title ? row.title: "Unknown error"}
                    <button
                        className="alert-btn-close"
                        onClick={this.removeRow(row.id)}>x
                    </button>
                    {(() => {
                        if (row.action) {
                            return (<button onClick={row.action.fn}>
                                    {row.action.msg}
                                    </button>);
                        }
                    })()}
                    </div>);
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
                {(() => count > 1?rows:null)()}
            </div>
            </div>
        );
    }
});

module.exports = messages;
