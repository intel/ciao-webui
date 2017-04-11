/* Copyright (c) 2017 Intel Corporation

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

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
