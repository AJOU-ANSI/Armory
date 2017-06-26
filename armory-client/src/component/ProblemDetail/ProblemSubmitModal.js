import React, {Component} from 'react';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import CodeMirror from 'react-codemirror';

export class ProblemSubmitModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      language: 'text/x-csrc',
      code: '// Code'
    };
  }

  handleChangeCode = (newCode) => {
    this.setState({
      code: newCode
    });
  }

  handleChangeLanguage = (event) => {
    const newLanguage = event.target.value;

    this.setState({
      language: newLanguage
    });
  }

  handleSave = () => {
    const {code, language} = this.state;

    this.props.onSave(code, language);
  }

  render () {
    const {toggle, isOpen} = this.props;
    const {language, code} = this.state;

    return (
      <Modal isOpen={isOpen} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}> 문제 제출 </ModalHeader>

        <ModalBody>
          <form>
            <div className="form-group">
              <label> 언어 </label>
              <select className="form-control" onChange={this.handleChangeLanguage} value={language}>
                <option value={'text/x-csrc'}> C </option>
                <option value={'text/x-c++src'}> C++ </option>
                <option value={'text/x-java'}> Java </option>
              </select>
            </div>

            <div className="form-group">
              <label> 코드 </label>

              <CodeMirror
                value={code}
                onChange={this.handleChangeCode}
                options={{lineNumbers: true, mode: language, theme: 'monokai'}}
              />
            </div>
          </form>
        </ModalBody>

        <ModalFooter>
          <button className="btn bg-logo text-white paper cursor-pointer" type="button" onClick={this.handleSave}>
            제출
          </button>
        </ModalFooter>
      </Modal>
    )
  }
}
