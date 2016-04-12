var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// React js component
var React = require('react');
var reactBootstrap = require('react-bootstrap');
var Table = reactBootstrap.Table;
var CustomPagination = require('./customPagination.js');

var customTable = React.createClass({
    displayName: 'customTable',


    getInitialState: function () {
        return {
            activePage: 1,
            actualItems: []
        };
    },
    select: function (row) {
        var selected = this.props.selectedRows;
        var newSelected = [];

        if (Object.keys(selected).length == 1) {

            if (selected[0].instance_id == row.instance_id) {
                newSelected = [];
            } else {
                newSelected.push(row);
            }
        } else {
            newSelected.push(row);
        }

        this.props.onSelectRow(newSelected);
    },
    isChecked: function (row) {

        var entry = this.props.selectedRows.find(function (element) {
            return element.instance_id == row.instance_id;
        });

        return entry;
    },
    changePage: function (page) {
        this.setState({ activePage: page });
        var lasItem = this.props.data[this.props.data.length - 1];
        this.props.onChangePage(lasItem);
    },
    /*getActualData: function(){
     var itemsPerPage = this.props.pagination.itemsPerPage;
     var page = this.state.activePage;
     var actualItems = []
     for (var i = (page-1) * itemsPerPage; i < (page * itemsPerPage); i++) {
     if(this.props.data[i]){
     actualItems.push(this.props.data[i]);
     }
     }
     this.props.onChangePage(actualItems);
     return actualItems;
     },*/
    render: function () {

        var actualData = this.props.data;

        var body = actualData.map((row, i) => {
                var columns = [];

        columns.push(React.createElement(
            'td',
            null,
            React.createElement('input', { type: 'checkbox',
                onClick: this.select.bind(null, row),
                checked: this.isChecked(row) })
        ));

        //first element is a link
        if (this.props.link) {

            columns.push(React.createElement(
                'td',
                null,
                React.createElement(
                    'a',
                    { className: 'frm-link', href: this.props.link.url + row[this.props.link.field] },
                    row[this.props.link.field]
                )
            ));

            delete row[this.props.link.field];
        }

        for (var key in row) {

            columns.push(React.createElement(
                'td',
                { key: key, className: key + '-' + row[key] },
                row[key]
            ));
        }

        return React.createElement(
            'tr',
            { className: this.isChecked(row) ? 'active ' : '',
                key: i },
            columns
        );
    });

        var header = this.props.columns.map((column, i) => {
                return React.createElement(
                    'th',
                    { key: i + 1 },
                    column
                );
    });
        header.unshift(React.createElement('td', { key: 0 }));

        return React.createElement(
            'div',
            { className: 'table-responsive' },
            React.createElement(
                Table,
                { className: 'table-hover' },
                React.createElement(
                    'thead',
                    null,
                    React.createElement(
                        'tr',
                        null,
                        header
                    )
                ),
                React.createElement(
                    'tbody',
                    null,
                    body
                )
            ),
            React.createElement(
                'div',
                { className: 'frm-pagination' },
                React.createElement(CustomPagination, _extends({ className: 'pagination',
                    items: this.props.data
                }, this.props.pagination, {
                    onSelect: this.changePage }))
            )
        );
    },
    componentWillUnmount: function () {},
    componentDidMount: function () {
        // $.get(this.props.source,
        //       (result) => {
        //           this.props.data = (result.length == 0)?
        //               result:this.props.fake_data;
        //           // TODO: render
        //       });
    },
    componentDidUpdate: function (prevProps, prevState) {}
});

module.exports = customTable;