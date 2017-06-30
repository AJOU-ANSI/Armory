import React, {Component} from 'react';
import classnames from 'classnames';
import moment from 'moment';
import 'moment-duration-format';
import {Link} from 'react-router-dom';

import './StatusTable.css';
import CodeModal from './CodeModal';
import CompileErrorModal from './CompileErrorModal';

const resultMessageMap = {
  4: '맞았습니다!',
  5: 'Presentation Error',
  6: '틀렸습니다.',
  7: '시간 제한 초과',
  8: '런타임 에러',
  10: '런타임 에러',
  11: '컴파일 에러'
};

export class StatusTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      codeModalOpen: false,
      compileModalOpen: false,
      target: null,
    };
  }

  checkResult = (submission) => {
    const {result} = submission;

    let str = '채점중';

    if (result >= 4) {
      str = resultMessageMap[result];
    }

    if (submission.result_message) {
      return (
        <a href="" onClick={(e) => this.handleClickCompileError(e, submission)}>
          {str}
        </a>
      );
    }
    else {
      return str;
    }
  };

  handleClickCompileError = (e, submission) => {
    e.preventDefault();

    this.setState({
      target: submission,
    });

    this.toggleCompileErrorModal();
  }

  handleClickLanguage = (e, submission) => {
    e.preventDefault();

    this.setState({
      target: submission,
    });

    this.toggleCodeModal();
  }

  toggleCompileErrorModal = () => {
    this.setState({
      compileModalOpen: !this.state.compileModalOpen,
    });
  };

  toggleCodeModal = () => {
    this.setState({
      codeModalOpen: !this.state.codeModalOpen,
    });
  };

  render() {
    const {submissionList, userMap, contest, admin, className} = this.props;
    const {compileModalOpen, codeModalOpen, target} = this.state;

    if (submissionList === null) return null;

    const now = (new Date()).getTime();

    const languageList = ['C', 'C++', 'JAVA'];

    return (
      <div className={classnames('StatusTable', className)}>
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

        <table className="table table-custom">
          <thead>
          <tr>
            <th> 채점번호 </th>
            {admin && <th> 제출자 </th>}
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
                  case 1:
                  case 2:
                  case 3:
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
                    {admin && (
                      <td> {(userMap[submission.UserId] || {}).strId || submission.UserId} </td>
                    )}
                    <td>
                      <Link to={`/${contest.name}/problems/${submission.problem_code}`}>
                        {submission.problem_code}
                      </Link>
                    </td>
                    <td>
                      <span className={classnames(resultColor)}>
                        {this.checkResult(submission)}
                      </span>
                    </td>
                    <td> {submission.result !== 0 && `${submission.memory_usage}KB`} </td>
                    <td> {submission.result !== 0 && `${submission.time_usage}ms`} </td>
                    <td>
                      <a href="" onClick={(e) => this.handleClickLanguage(e, submission)}>
                        {languageList[submission.language]}
                      </a>
                    </td>
                    <td> {moment.duration(submissionDuration).format(timeFormat)} </td>
                  </tr>
                );
              }
            )
          }
          </tbody>
        </table>
      </div>
    );
  }
}

export default StatusTable;
