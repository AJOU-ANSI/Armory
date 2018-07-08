import React, {Component} from 'react';
import moment from 'moment';
import {Modal, ModalBody, ModalHeader} from 'reactstrap';
import {toastr} from 'react-redux-toastr';

import './QnA.css';

export class QnA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      problemCodeList: null,
      formOpen: false,
      defaultProblemCode: null,
      qnaList: null
    };
  }

  componentWillMount() {
    const {match: {params: {contestName}}, location, history} = this.props;

    if (location.state) {
      this.setState({
        defaultProblemCode: location.state.problemCode,
        formOpen: true,
      });
      history.replace(location.pathname, null);
    }

    fetch(`/api/${contestName}/problems?code=true`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) {
          throw new Error();
        }

        return res.json();
      })
      .then(({result: {problem_list}}) => {
        this.setState({
          problemCodeList: problem_list
        });
      })
      .catch(err => {
        console.error(err);
      })

    this.updateQnAs();
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const {match: {params: {contestName}}} = this.props;

    const {
      problemCode: {value: problemCodeValue},
      question: {value: questionValue}
    } = this.refs;

    fetch(`/api/${contestName}/qnas`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({problemCode: problemCodeValue, question: questionValue}),
      credentials: 'include'
    })
      .then(resp => {
        if (!resp.ok) {
          throw new Error();
        }

        return resp.json();
      })
      .then(() => {
        this.updateQnAs();
        this.setState({
          defaultProblemCode: null,
          formOpen: false
        });
        toastr.success('시스템 메세지', '질문이 추가되었습니다.');
      })
      .catch(err => {
        console.error(err);
      });
  }

  toggle = () => {
    this.setState({
      formOpen: !this.state.formOpen
    });
  }

  updateQnAs = () => {
    const {match: {params: {contestName}}} = this.props;

    fetch(`/api/${contestName}/qnas`, {credentials: 'include'})
      .then(resp => {
        if (!resp.ok) {
          throw new Error();
        }

        return resp.json();
      })
      .then(({result: {qna_list: qnaList}}) => {
        this.setState({
          qnaList
        });
      })
      .catch(err => {
        console.error(err);
      })
  }

  render () {
    const {problemCodeList, formOpen, defaultProblemCode, qnaList} = this.state;

    // console.log(qnaList);

    return (
      <div className="QnA page">
        <Modal isOpen={formOpen} toggle={this.toggle}>
          <ModalHeader>
            질문하기
          </ModalHeader>

          <ModalBody>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label> 문제 번호 </label>
                {
                  problemCodeList && (
                    <select className="form-control" ref="problemCode" defaultValue={defaultProblemCode}>
                      {
                         problemCodeList.map(problem => (
                          <option value={problem.code} key={problem.code}> {problem.code.toUpperCase()} </option>
                        ))
                      }
                      <option value={'others'}> 그 외 질문 </option>
                    </select>
                  )
                }

              </div>

              <div className="form-group">
                <label> 질문 내용 </label>
                <textarea rows="5" className="form-control" ref="question" />
              </div>

              <div>
                <button className="btn bg-logo text-white" type="submit">
                  제출
                </button>
              </div>
            </form>
          </ModalBody>
        </Modal>

        <div className="container">
          <div className="page-title">
            <h1> QnA </h1>
            <p> 질문과 답변</p>
          </div>

          <div>
            <button className="btn text-white bg-logo" onClick={this.toggle}> 질문하기 </button>
          </div>
          <h5 className="mt-3"> 질문과 답변 목록 </h5>

          <div className="card paper">
            <div className="card-block">
              <table className="table-custom table-qna">
                <thead>
                <tr>
                  <th>번호</th>
                  <th>문제</th>
                  <th>답변시간</th>
                  <th>질문내용</th>
                  <th>답변내용</th>
                </tr>
                </thead>

                <tbody>
                {
                  qnaList && qnaList.map((qna, index) => (
                    <tr key={qna.id}>
                      <td className="index"> {index+1} </td>
                      <td className="code"> {qna.problemCode} </td>
                      <td> {moment(qna.createdAt).format('HH:mm:ss')} </td>
                      <td className="question"> <pre className={'bg-light p-1 mb-0'}>{qna.question}</pre> </td>
                      <td className="answer"> <pre className={'bg-light p-1 mb-0'}>{qna.answer}</pre> </td>
                    </tr>
                  ))
                }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default QnA;
