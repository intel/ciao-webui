var React = require('react');
var ReactDOM = require('react-dom/server');


var overview = React.createClass({

    componentDidMount: function() {
    },
    componentDidUpdate: function(prevProps, prevState, rootNode) {
    },
    render: function() {

        var len = this.props.tags.length - 1;
        var tags = this.props.tags.map(function(tag, i){
            tag = (i < len)?tag + ' ,':tag;
            return <span key={i}> {tag}
                   </span>;
        });
        return (
            <div className="row add-margin-bottom">
              <div className="col-xs-2">
                <div className="state-ready frm-bold-text">
                    {this.props.state}
                </div>
                <div className="frm-secondary-text frm-bold-text">
                  CPU
                </div>
                <div className="frm-bold-text">
                  {this.props.cpu}
                </div>
              </div>
              <div className="col-xs-6">
                <div className="frm-secondary-text frm-bold-text">
                  Tags
                </div>
                <div className="frm-bold-text">
                  {tags}
                </div>
              </div>
              {(() => {if(this.props.geography)(
                  <div className="col-xs-2">
                      <div className="frm-secondary-text frm-bold-text">
                        Geography
                      </div>
                      <div className="frm-bold-text">
                        {this.props.geography}
                      </div>
                  </div>
              )})()}
              <div className="col-xs-2">
               <div className="frm-secondary-text frm-bold-text">
                  Node UUID
                </div>
                <div className="frm-bold-text">
                  {this.props.rack_identifier}
                </div>
              </div>
        </div>);
    }

});

module.exports = overview;
