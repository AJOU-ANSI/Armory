import React, {Component} from 'react';
import moment from 'moment';
import 'moment-duration-format';
import classnames from 'classnames';

import './Status.css';
import {Link} from 'react-router-dom';

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
    const {contest} = this.props;
    //
    // const createDate = function(offset) { // second
    //   const now = (new Date()).getTime();
    //
    //   const date = new Date(now - offset*1000);
    //
    //   return date;
    // }
    //
    //
    // const submissionList = [
    //   {
    //     language: 0,
    //     code: '//This is compile error',
    //     result: 11,
    //     result_message: 'You have compile error in line 0',
    //     problem_code: 'A',
    //     memory_usage: 0,
    //     time_usage: 0,
    //     createdAt: createDate(10),
    //     id: 1
    //   },
    //   {
    //     language: 0,
    //     code: '//This is wrong',
    //     result: 6,
    //     memory_usage: 10000,
    //     time_usage: 100,
    //     problem_code: 'A',
    //     createdAt: createDate(8),
    //     id: 2
    //   },
    //   {
    //     language: 0,
    //     code: '//This is right',
    //     result: 4,
    //     memory_usage: 10000,
    //     time_usage: 100,
    //     problem_code: 'A',
    //     createdAt: createDate(6),
    //     id: 3
    //   },
    //   {
    //     language: 0,
    //     code: '//This is pending',
    //     result: 0,
    //     problem_code: 'B',
    //     createdAt: createDate(4),
    //     id: 4
    //   }
    // ];

    const now = (new Date()).getTime();

    const languageList = ['C', 'C++', 'JAVA'];

    const checkResult = (result) => {
      if (result < 4) {
        return '채점중';
      }
      else {
        switch (result) {
          case 4:
            return '맞았습니다!';
          case 5:
            return 'Presentation Error';
          case 6:
            return '틀렸습니다.';
          case 7:
            return '시간 제한 초과';
          case 8:
            return '메모리 제한 초과';
          case 10:
            return '런타임 에러';
          case 11:
            return '컴파일 에러';

        }
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
                            <td>
                              <Link to={`/${contest.name}/problems/${submission.problem_code}`}>
                                {submission.problem_code}
                              </Link>
                            </td>
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
