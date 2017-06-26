import React, {Component} from 'react';
import {Modal, ModalBody, ModalHeader} from 'reactstrap';

export class AdminQnAForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultAnswer: null
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const {answer: {value: answerValue}} = this.refs;
    const {onSubmit, target} = this.props;

    onSubmit(target, answerValue);
  }

  render () {
    const {isOpen, toggle, target} = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}> 대답하기 </ModalHeader>
        <ModalBody>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label> 질문 </label>
              <pre style={{whiteSpace: 'pre-line', backgroundColor: '#ddd', padding: 4}}>{target.question}</pre>
            </div>

            <div className="form-group">
              <label> 대답 </label>
              <textarea rows="5" className="form-control" ref="answer" defaultValue={target.answer}/>
            </div>

            <div>
              <button className="btn bg-logo text-white" type="submit"> 제출 </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    );
  }
}

export default AdminQnAForm;
