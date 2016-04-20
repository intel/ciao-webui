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

    componentDidUpdate: function(prevProps, prevState) {
        var pagButtons = document.querySelectorAll("ul.pagination li a");
        // pagButtons is of type NodeList, iterate using for.
        for (var i = 0; i < pagButtons.length; ++i) {
            pagButtons[i].removeAttribute('href');
        }

    },

    render: function() {
        var items = Math.ceil(this.props.items/this.props.itemsPerPage);
        //var items = Math.ceil(this.props.items);

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
