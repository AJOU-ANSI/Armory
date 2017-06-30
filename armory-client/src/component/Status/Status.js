import React, {Component} from 'react';
import moment from 'moment';
import 'moment-duration-format';
import classnames from 'classnames';
import {Link} from 'react-router-dom';

import './Status.css';
import CodeModal from './CodeModal';
import CompileErrorModal from './CompileErrorModal';

export class Status extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submissionList: null,
      compileModalOpen: false,
      codeModalOpen: false,
      target: null,
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

  handleClickCompileErrorMessage = (e, submission) => {
    e.preventDefault();

    this.setState({
      target: submission,
    });
    this.toggleCompileErrorModal();
  }

  handleClickLanguageMessage = (e, submission) => {
    e.preventDefault();

    this.setState({
      target: submission,
    });
    this.toggleCodeModal();
  }

  toggleCompileErrorModal = () => {
    const {compileModalOpen} = this.state;

    this.setState({
      compileModalOpen: !compileModalOpen,
    });
  };

  toggleCodeModal = () => {
    const {codeModalOpen} = this.state;

    this.setState({
      codeModalOpen: !codeModalOpen,
    });
  };

  render() {
    const {submissionList} = this.state;
    const {codeModalOpen, compileModalOpen, target} = this.state;
    const {contest} = this.props;

    // const createDate = function(offset) { // second
    //   const now = (new Date()).getTime();
    //
    //   const date = new Date(now - offset*1000);
    //
    //   return date;
    // }
    //
    //
    // const submissionList = require('./data.json');
    // submissionList.forEach((submission, index) => {
    //   submission.createdAt = createDate(20 - index*2);
    // });

    const now = (new Date()).getTime();

    const languageList = ['C', 'C++', 'JAVA'];

    const checkResult = (submission) => {
      const {result} = submission;

      if (result === 11) {
        return (
          <a href="" onClick={(e) => this.handleClickCompileErrorMessage(e, submission)}>
            컴파일 에러
          </a>
        );
      }

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
          case 10:
            return '런타임 에러';
        }
      }
    };

    return (
      <div className="page Status">
        <CodeModal
          isOpen={codeModalOpen}
          target={target}
          toggle={this.toggleCodeModal}
        />

        <CompileErrorModal
          isOpen={compileModalOpen}
          target={target}
          toggle={this.toggleCompileErrorModal}
        />

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

                        let resultColor, rowColor;

                        switch (submission.result) {
                          case 0:
                            resultColor = ''; break;
                          case 4:
                            resultColor = 'text-success'; rowColor = 'table-success'; break;
                          case 11:
                            resultColor = ''; break;
                          default:
                            resultColor = 'text-danger'; rowColor = 'table-danger';
                        }

                        return (
                          <tr key={submission.id} className={classnames(rowColor)}>
                            <td> {submission.id} </td>
                            <td>
                              <Link to={`/${contest.name}/problems/${submission.problem_code}`}>
                                {submission.problem_code}
                              </Link>
                            </td>
                            <td>
                              <span className={classnames(resultColor)}>
                                {checkResult(submission)}
                              </span>
                            </td>
                            <td> {submission.result !== 0 && `${submission.memory_usage}KB`} </td>
                            <td> {submission.result !== 0 && `${submission.time_usage}ms`} </td>
                            <td>
                              <a href="" onClick={(e) => this.handleClickLanguageMessage(e, submission)}>
                                {languageList[submission.language]}
                              </a>
                            </td>
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
