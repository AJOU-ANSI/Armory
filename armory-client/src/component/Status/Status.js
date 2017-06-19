import React, {Component} from 'react';
import moment from 'moment';
import 'moment-duration-format';
import classnames from 'classnames';

import './Status.css';

export class Status extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submissionList: null
    };
  }

  componentWillMount() {
    const {contest} = this.props;

    fetch(`/api/${contest.name}/submissions`, {
      credentials: 'include'
    })
      .then(resp => {
        if (!resp.ok) {
          throw new Error('Problem occurred!!');
        }
        return resp.json();
      })
      .then(body => {
        const {result: {submission_list}} = body;

        this.setState({
          submissionList: submission_list
        });
      })
      .catch(e => {
        console.error(e);
      });
  }

  render() {
    const {submissionList} = this.state;

    const now = (new Date()).getTime();

    const languageList = ['C', 'C++', 'JAVA'];

    const checkResult = (result) => {
      if (result < 4) {
        return '채점중';
      }
      else if (result === 4) {
        return '맞았습니다!'
      }
      else if (result === 11) {
        return '컴파일 에러'
      }
      else {
        return '틀렸습니다.'
      }
    };

    return (
      <div className="page Status">
        <div className="page-title">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h1> Status </h1>
                <p> 문제 제출 현황을 보여주는 페이지입니다. </p>
              </div>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="container">
            <div className="row">
              <table className="table table-custom paper">
                <thead>
                  <tr>
                    <th> 채점번호 </th>
                    <th> 문제 </th>
                    <th> 결과 </th>
                    <th> 메모리 </th>
                    <th> 소요시간 </th>
                    <th> 언어 </th>
                    <th> 제출시간 </th>
                  </tr>
                </thead>

                <tbody>
                {
                  submissionList && (
                    submissionList
                      .sort((a, b) => {
                        if (a.createdAt > b.createdAt) return -1;
                        else if (a.createdAt === b.createdAt) return 0;
                        return 1;
                      })
                      .map(submission => {
                        const submissionDuration = now - (new Date(submission.createdAt)).getTime();
                        let timeFormat = 'HH시간 mm분 전';

                        if (submissionDuration < 60000) { // 제출 후 1분이 안되었을때
                          timeFormat = 's초 전'
                        }

                        const isAccepted = (submission.result === 4);
                        const isWrong = (submission.result > 5);

                        return (
                          <tr key={submission.id}>
                            <td> {submission.id} </td>
                            <td> {submission.problem_code} </td>
                            <td>
                              <span className={classnames(isAccepted && 'text-success', isWrong && 'text-danger')}>
                                {checkResult(submission.result)}
                              </span>
                              </td>
                            <td> {submission.result !== 0 && `${submission.memory_usage}KB`} </td>
                            <td> {submission.result !== 0 && `${submission.time_usage}ms`} </td>
                            <td> {languageList[submission.language]} </td>
                            <td> {moment.duration(submissionDuration).format(timeFormat)} </td>
                          </tr>
                        );
                      })
                  )
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

export default Status;
