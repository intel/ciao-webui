// React js component
var React = require('react');
var reactBootstrap = require('react-bootstrap');
var Table = reactBootstrap.Table;

var list = React.createClass({

    render: function() {
        var rows = [];
        if(this.props.body){
            var rows = this.props.body.map( (row, i) => {

                    var label = row[this.props.label.field];

                    if(this.props.link){
                        var link = this.props.link.url +
                            row[this.props.link.field];

                        return <tr  key={i} >
                                <td  key={i} >
                                    <a className={linkClass} href={link}>
                                        {label}
                                    </a>
                                </td>
                            </tr>;
                    }else{
                        return <tr  key={i} >
                                <td  key={i} >
                                    <span>
                                        {label}
                                    </span>
                                </td>
                            </tr>;
                    }

                });
        }

        return (<div>
                <Table bordered condensed hover>
                    <tbody>
                        <tr>
                            <td> 
                                <div className="frm-bold-text">
                                    {this.props.header}
                                </div>
                            </td>
                        </tr>
                        {rows}
                    </tbody>
                </Table>
            </div>);
    }
});

module.exports = list;
