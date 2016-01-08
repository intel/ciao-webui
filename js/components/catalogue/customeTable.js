// React js component
var React = require('react');
var reactBootstrap = require('react-bootstrap');
var Table = reactBootstrap.Table;
var CustomePagination = require('./customePagination.js');

var customeTable = React.createClass({

    getInitialState: function() {
        return {
            activePage: 1,
            actualItems: []
        };
    },
    select: function(row) {
        var selected = this.props.selectedRows;
        var newSelected = [];

        if(Object.keys(selected).length == 1){

            if(selected[0].instance_id == row.instance_id){
                newSelected = [];
            } else{
                newSelected.push(row);
            }
        } else{
            newSelected.push(row);
        }

        this.props.onSelectRow(newSelected);
    },
    isChecked: function(row){

        var entry = this.props.selectedRows.find(function(element){
            return element.instance_id == row.instance_id;
        });

        return entry;

    },
    changePage: function(page){
        this.setState({activePage: page});
    },
    getActualData: function(){

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
    },
    render: function() {

        var actualData = this.getActualData();
        var actualData = this.getActualData();

        var body = actualData.map( (row, i) => {
            var columns = [];

            columns.push(<td>
                    <input type="checkbox"
                        onClick={this.select.bind(null, row)}
                        checked={this.isChecked(row)} />
                </td>);

            //first element is a link
            if(this.props.link){

                columns.push(<td>
                    <a className="frm-link" href={this.props.link.url + row[this.props.link.field]}> 
                        {row[this.props.link.field]} 
                    </a>
                </td>);

                delete row[this.props.link.field];
            }
            

            for(var key in row) {

                columns.push(
                    <td key={key} className={key+'-'+row[key]}>
                        {row[key]}
                    </td>);
            }

            return <tr className={
                        this.isChecked(row)? 'active ' : '' }
                        key={i} >
                    {columns}
                   </tr>;
        });

        var header = this.props.columns.map( (column, i) => {
                return (<th key={i+1} >{column}</th>);
            });
        header.unshift(<td key={0}></td>);

        return (<div className="table-responsive">
                <Table className="table-hover">
                    <thead>
                        <tr>
                            {header}
                        </tr>
                    </thead>
                    <tbody>
                        {body}
                    </tbody>
                </Table>
                <div className="frm-pagination">
                    <CustomePagination className="pagination"
                        items={this.props.data}
                        {...this.props.pagination}
                        onSelect={this.changePage} />
                </div>
            </div>);
    },
    componentWillUnmount: function() {
    },
    componentDidMount: function() {
        // $.get(this.props.source,
        //       (result) => {
        //           this.props.data = (result.length == 0)?
        //               result:this.props.fake_data;
        //           // TODO: render
        //       });
    },
    componentDidUpdate: function(prevProps, prevState) {
    }
});

module.exports = customeTable;
