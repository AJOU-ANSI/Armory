import React, {Component} from 'react';
import {Modal, ModalBody, ModalHeader} from 'reactstrap';
import CodeMirror from 'react-codemirror';

export class CodeModal extends Component {
  render() {
    const {target, isOpen, toggle} = this.props;

    if (!target) return null;
    
    const mode = [
      'text/x-csrc',
      'text/x-c++src',
      'text/x-java',
      {name: 'text/x-python', version: 2},
      {name: 'text/x-python', version: 3},
    ][target.language];
    
    return (
      <Modal isOpen={isOpen} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>
          제출 코드
        </ModalHeader>

        <ModalBody>
          <CodeMirror
            defaultValue={target.code}
            options={{lineNumbers: true, mode, theme: 'monokai'}}
          />
        </ModalBody>
      </Modal>
    )
  }
}

export default CodeModal;
