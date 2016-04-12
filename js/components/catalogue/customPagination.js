// React js component
var React = require('react');
var reactBootstrap = require('react-bootstrap');
var Pagination = reactBootstrap.Pagination;

var customPagination = React.createClass({

    getInitialState: function() {
        return {
            activePage: 1
        };
    },
    getDefaultProps: function() {
        return {
            itemsPerPage:10
        };
    },
    handleSelect: function(event, selectedEvent) {
        this.setState({
            activePage: selectedEvent.eventKey
        });

        this.props.onSelect(selectedEvent.eventKey);
    },
    render: function() {
        var items = Math.ceil(this.props.items.length/this.props.itemsPerPage);

        return (<Pagination
                    prev
                    next
                    first
                    last
                    ellipsis
                    boundaryLinks
                    items={items}
                    maxButtons={5}
                    activePage={this.state.activePage}
                    onSelect={this.handleSelect} />);
    }

});

module.exports = customPagination;
