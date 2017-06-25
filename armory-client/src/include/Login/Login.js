import React, {Component} from 'react';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import classnames from 'classnames';

export class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault();

    const userId = this.refs.userId.value;
    const userPwd = this.refs.userPwd.value;

    this.props.onLogin(userId, userPwd);
  }

  toggle = () => {
    this.props.onToggle();
  }

  render () {
    const {className, modalOpen} = this.props;

    return (
      <Modal isOpen={modalOpen} toggle={this.toggle} className={classnames(className)}>
        <ModalHeader toggle={this.toggle} className="text-logo">
          계정 인증
        </ModalHeader>

        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="userId">ID</label>
              <input ref="userId" type="text" className="form-control" id="userId" placeholder="ID 입력" />
            </div>
            <div className="form-group">
              <label htmlFor="userPwd">비밀번호</label>
              <input ref="userPwd" type="password" className="form-control" id="userPwd" placeholder="비밀번호 입력" />
            </div>
          </ModalBody>

          <ModalFooter>
            <button type="submit" className="btn btn-custom bg-logo text-white">로그인</button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default Login;
