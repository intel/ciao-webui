var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * React Component - Catalogue
 * This component was created to be used specifically in the catalogs of CIAO
 *
 * the following fields must be sent in the props
 *
 *  + data Array of json with the information to show in the table
 *  + columns Array with the columns to show in the table
 *  + actions Array of json with the buttons to add to the toolbar
 *      the json has to have this fields:
 *      -label: string name displayed on the button
 *      -name: string identifier of the button (remove?)
 *      -onClick function to execute when the user clicked the button
 *      -onDisabled function that is the button should be disabled (true/false)
 *  + dropDownAction Array of json with the buttons to add to the dropdown
 *      the json has to have this fields:
 *      -
 *      -
 *      -
 *  + searchFields [] fields to search
 *
 */

var React = require('react');
var CustomTable = require('./customTable.js');
var TableActionToolbar = require('./tableActionToolbar.js');
var CustomAlert = require('./customAlert.js');
var CustomModal = require('./customModal.js');

var AlertMixin = {

    getInitialState: function () {
        return { _alert: false, allItems:false, status:null };
    },

    renderAlert: function () {
        if (this.state._alert) {
            return React.createElement(CustomAlert, this.state._alert);
        } else {
            return null;
        }
    },

    hideAlert: function () {
        this.setState({ _alert: false });
    },

    showAlert: function (options) {
        this.setState({ _alert: options });
    }
};

var ModalMixin = {
    getInitialState: function () {
        return { _modal: false };
    },

    renderModal: function () {
        if (this.state._modal) {
            return React.createElement(CustomModal, this.state._modal);
        } else {
            return null;
        }
    },

    onClose: function () {
        this.setState({ _modal: false });
    },

    onAccept: function (callback) {
        this.setState({ _modal: false });
        this.setState({ selectedInstance: [] });
        callback(this.state.selectedInstance);
    },

    showModal: function (options) {
        options.onClose = this.onClose;
        options.onAccept = this.onAccept.bind(null, options.onAccept);
        this.setState({ _modal: options });
    }
};

var catalogue = React.createClass({
    displayName: 'catalogue',
    mixins: [AlertMixin, ModalMixin],

    getInitialState: function () {
        return {
            selectedInstance: [],
            disabledButtons: []
        };
    },
    actualData: [],

    getDefaultProps: function () {
        return {
            paginationDefault: {
                itemsPerPage: 10
            }
        };
    },
    //select a row
    onSelectRow: function (selected) {
        this.hideAlert();
        this.setState({
            selectedInstance: selected,
            allItems:false,
            status:null,
        });
    },
    selectAllRecords: function(key){
        this.showAlert({
            selectedAll: {
                onClick: this.selectInstances.bind(null, {key:'none'})
            },
            alertType: "alert frm-alert-information"
        });

        this.setState({
            allItems:true,
            status:'all',
            selectedInstance: this.props.data
        });
    },
    selectNoneRecord: function(){
        this.setState({
            allItems:true,
            status:'none',
            selectedInstance: []
        });
    },
    //select from dropbox
    selectInstances: function (query, inAllPages) {
        this.hideAlert();
        var key = Object.keys(query);

        if(query[key] == 'all'){
           this.selectAllRecords(key);
        }else{
            if(query[key] == 'none'){
                this.selectNoneRecord();
            }else{

                var selectedInstance = this.props.data.filter(function (instance) {
                    return instance[key] == query[key];
                });

                if(inAllPages == true){
                    this.showAlert({
                        selectedAll: {
                            onClick: this.selectInstances.bind(null, {key:'none'}),
                            action:query[key],

                        },
                        alertType: "alert frm-alert-information"
                    });
                }else{
                    this.showAlert({
                        selectedPage: {
                            selectInPage: selectedInstance.length,
                            selectInAllPages: '',
                            action: query[key],
                            onClick: this.selectInstances.bind(null, query, true)
                        },
                        alertType: "alert frm-alert-information"
                    });
                }

                this.setState({
                    allItems:inAllPages == true,
                    status:(inAllPages == true)?query[key]:null,
                    selectedInstance: selectedInstance
                });
            }
        }
    },
    isChecked: function  (row, selectedRows) {
        var entry = selectedRows.find(function (element) {
            return element[this.props.id] == row[this.props.id];
        });
        return entry;
    },

    getToolbarConfiguration: function () {

        var dropDownActions = [];

        if (this.props.dropDownActions) {
            dropDownActions = this.props.dropDownActions;

            for (var i = 0; i < dropDownActions.length; i++) {
            var query = dropDownActions[i]['query'];
                dropDownActions[i]['onClick'] = this.selectInstances
                    .bind(null, query);
            }
        }

        return {
            buttonItems: this.props.actions ? this.props.actions : [],
            searchFields: this.props.searchFields ? this.props.searchFields : [],
            dropDownActions: dropDownActions,
            searchTitle : this.props.searchTitle
        };
    },

    getTableConfiguration: function () {

        var config = this.props;
        var pagination = {
            items: this.props.count,
            itemsPerPage: this.props.limit
        };

        var condition = -1;
        var state = this.state.status;

        if (this.state.allItems == false) {
            condition = 0;
            if (state == "none")
                condition = 3;
        } else {
            condition = 2;
            if (state == "all")
                condition = 1;
        }

        var isChecked = (function (condition) {
            var f = null;
            switch (condition){
                case 1:
                    // All elements are checked
                    f = function () {
                        return true;
                    };
                    break;
                case 2:
                    // Use this function when selecting all instances by state
                    f = function (row) {
                        return (row.status ==  state);
                    };
                    break;
                case 3:
                    // Use this case when option "None" has been selected.
                    f = function (row) {
                        return false;
                    };
                    break;
                case 0:
                default:
                    f = function (row, selectedRows) {
                        var entry = selectedRows.find(function (element) {
                            return element[config.id] == row[config.id];
                        });
                        return entry;
                    };
            }
            return f;
        }.bind(this))(condition);

        return {
            columns: config.columns ? config.columns : [],
            data: config.data ? config.data : [],
            pagination: pagination,
            onSelectRow: this.onSelectRow,
            selectedRows: this.state.selectedInstance,
            isChecked: isChecked,
            id:config.id,
            onChangePage: this.setActualItems,
            link: config.link ? config.link : false
        };
    },

    setActualItems: function (lastItem) {
        this.props.onChangePage(lastItem);
    },

    render: function () {

        var toolbarconfiguration = this.getToolbarConfiguration();
        var tableconfiguration = this.getTableConfiguration();

        return React.createElement(
            'div',
            null,
            React.createElement(TableActionToolbar, _extends({
                selectedInstance: this.state.selectedInstance
            }, toolbarconfiguration)),
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-xs-12' },
                    this.renderAlert()
                )
            ),
            React.createElement(CustomTable, tableconfiguration),
            this.renderModal()
        );
    }
});

module.exports = catalogue;
