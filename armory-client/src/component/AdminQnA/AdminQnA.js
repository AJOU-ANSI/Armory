import React, {Component} from 'react';
import moment from 'moment';

import AdminQnAForm from './AdminQnAForm';

export class AdminQnA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qnaList: null,
      formOpen: false,
      target: null
    };
  }

  componentWillMount() {
    this.updateQnaList();
  }

  handleClick = (qna) => {
    this.setState({
      target: qna,
      formOpen: true
    });
  }

  handleSubmitForm = (target, answer) => {
    const {match: {params: {contestName}}} = this.props;

    fetch(`/api/${contestName}/qnas/${target.id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({answer}),
      credentials: 'include'
    })
      .then(resp => {
        if (!resp.ok) {
          throw new Error();
        }
        return resp.json();
      })
      .then(() => {
        this.updateQnaList();
        this.setState({
          formOpen: false,
          target: null
        });
      })
      .catch(err => {
        console.error(err);
      })
  }

  toggleForm = () => {
    this.setState({
      formOpen: !this.state.formOpen
    });
  }

  updateQnaList = () => {
    const {match: {params: {contestName}}} = this.props;

    fetch(`/api/${contestName}/qnas/admin`, {credentials: 'include'})
      .then(resp => {
        if (!resp.ok) {
          throw new Error();
        }

        return resp.json();
      })
      .then(({result: {qna_list: qnaList}}) => {
        this.setState({
          qnaList
        })
      });
  }

  render () {
    const {qnaList, formOpen, target} = this.state;

    return (
      <div className="page">
        {
          target && (
            <AdminQnAForm
              onSubmit={this.handleSubmitForm}
              isOpen={formOpen}
              toggle={this.toggleForm}
              target={target} />
          )
        }

        <h5> QnA 목록 </h5>

        <div className="card paper">
          <div className="card-block">
            <table className="table-custom">
              <thead>
                <tr>
                  <th> 아이디 </th>
                  <th> 번호 </th>
                  <th> 질문 시간 </th>
                  <th> 질문 내용 </th>
                  <th> 대답 여부 </th>
                  <th> 대답하기 </th>
                </tr>
              </thead>
              <tbody>
              {
                qnaList && (
                  qnaList.map(qna => (
                    <tr key={qna.id}>
                      <td> {qna.User.strId} </td>
                      <td> {qna.problemCode} </td>
                      <td> {moment(qna.createdAt).format('MM-DD HH:mm:ss')} </td>
                      <td style={{maxWidth: 350}}>
                        <pre className={'bg-light p-1 mb-0'} style={{whiteSpace: 'pre-line'}}>{qna.question}</pre>
                      </td>
                      <td> {!!qna.answer && <span className="text-success">&#10004;</span>} </td>
                      <td>
                        <button className="btn btn-sm bg-logo text-white" onClick={() => this.handleClick(qna)}>
                          대답
                        </button>
                      </td>
                    </tr>
                  ))
                )
              }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminQnA;
