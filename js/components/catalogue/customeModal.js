
// React js component
var React = require('react');
var reactBootstrap = require('react-bootstrap');
var Modal = reactBootstrap.Modal;
var Button = reactBootstrap.Button;

var customeModal = React.createClass({

    getDefaultProps: function() {
        return {
            acceptText:'Ok',
            cancelText:'Cancel',
            title:'Title of the modal',
            body:'Body of the modal'
        };
    },
    render: function() {
        return  (
            <Modal show="true" onHide={this.props.onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        {this.props.body}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onClose}>
                        {this.props.cancelText}
                    </Button>
                    <Button onClick={this.props.onAccept}>
                        {this.props.acceptText}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
});

module.exports = customeModal;
