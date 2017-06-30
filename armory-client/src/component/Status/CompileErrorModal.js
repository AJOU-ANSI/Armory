import React, {Component} from 'react';
import {Modal, ModalBody, ModalHeader} from 'reactstrap';

export class CompileErrorModal extends Component {
  render () {
    const {isOpen, toggle, target} = this.props;

    if (!target) return null;

    return (
      <Modal isOpen={isOpen} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>
          컴파일 에러 메세지
        </ModalHeader>

        <ModalBody>
          <pre>{target.result_message}</pre>
        </ModalBody>
      </Modal>
    )
  }
}

export default CompileErrorModal;
