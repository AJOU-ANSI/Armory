import React, {Component} from 'react';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import classnames from 'classnames';

export class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault();

    console.log('hi');
  }

  toggle = () => {
    this.props.onToggle();
  }

  render () {
    const {className, modalOpen} = this.props;

    return (
      <Modal isOpen={modalOpen} toggle={this.toggle} className={classnames(className)}>
        <ModalHeader toggle={this.toggle}>
          계정 인증
        </ModalHeader>

        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="inputId">ID</label>
              <input type="text" className="form-control" name="user_id" id="user_id" placeholder="ID 입력" />
            </div>
            <div className="form-group">
              <label htmlFor="inputPassword">비밀번호</label>
              <input type="password" className="form-control" name="user_pw" id="user_pw" placeholder="비밀번호 입력" />
            </div>
          </ModalBody>

          <ModalFooter>
            <button type="submit" className="btn btn-custom btn-black">로그인</button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default Login;
