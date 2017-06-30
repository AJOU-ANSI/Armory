import React, {Component} from 'react';
import moment from 'moment';
import 'moment-duration-format';
import classnames from 'classnames';

import './Status.css';
import {Link} from 'react-router-dom';
import {Modal, ModalBody, ModalHeader} from 'reactstrap';
import CodeMirror from 'react-codemirror';

export class Status extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submissionList: null,
      compileModalOpen: false,
      compileModalValue: null,
      codeModalOpen: false,
      codeModalValue: null,
      codeModalLanguage: null,
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

  handleClickCompileErrorMessage = (e, value) => {
    e.preventDefault();

    this.setState({
      compileModalValue: value,
    });
    this.toggleCompileErrorModal();
  }

  handleClickLanguageMessage = (e, submission) => {
    e.preventDefault();

    this.setState({
      codeModalValue: submission.code,
      codeModalLanguage: ['text/x-csrc', 'text/x-c++src', 'text/x-java'][submission.language],
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
    const {submissionList, codeModalOpen, codeModalValue, codeModalLanguage} = this.state;
    const {compileModalOpen, compileModalValue} = this.state;
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
    // const submissionList = [
    //   {
    //     language: 0,
    //     code: '//This is compile error',
    //     result: 11,
    //     result_message: "Main.cc: In function ‘int main()’:\nMain.cc:3:17: error: ‘scanf’ was not declared in this scope\n   scanf(\"%d\", &n);\n                 ^\nMain.cc:5:19: error: ‘printf’ was not declared in this scope\n   printf(\"%d\\n\", n);\n                   ^\n",
    //     problem_code: 'A',
    //     memory_usage: 0,
    //     time_usage: 0,
    //     createdAt: createDate(10),
    //     id: 1
    //   },
    //   {
    //     language: 0,
    //     code: "#include<cstdio>\nint main(){\nprintf(\"Hello World\");\n}",
    //     result: 6,
    //     memory_usage: 10000,
    //     time_usage: 100,
    //     problem_code: 'A',
    //     createdAt: createDate(8),
    //     id: 2
    //   },
    //   {
    //     language: 1,
    //     code: '//This is right',
    //     result: 4,
    //     memory_usage: 10000,
    //     time_usage: 100,
    //     problem_code: 'A',
    //     createdAt: createDate(6),
    //     id: 3
    //   },
    //   {
    //     language: 2,
    //     code: '//This is pending',
    //     result: 0,
    //     problem_code: 'B',
    //     createdAt: createDate(4),
    //     id: 4
    //   },
    //   {
    //     language: 0,
    //     code: '//This is compile error',
    //     result: 11,
    //     result_message: "Another compile error message",
    //     problem_code: 'A',
    //     memory_usage: 0,
    //     time_usage: 0,
    //     createdAt: createDate(2),
    //     id: 5
    //   },
    // ];

    const now = (new Date()).getTime();

    const languageList = ['C', 'C++', 'JAVA'];

    const checkResult = (submission) => {
      const {result} = submission;

      if (result === 11) {
        return (
          <a href="" onClick={(e) => this.handleClickCompileErrorMessage(e, submission.result_message)}>
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
        <Modal isOpen={compileModalOpen} toggle={this.toggleCompileErrorModal} size="lg">
          <ModalHeader toggle={this.toggleCompileErrorModal}>
            컴파일 에러 메세지
          </ModalHeader>

          <ModalBody>
            <pre>{compileModalValue}</pre>
          </ModalBody>
        </Modal>

        <Modal isOpen={codeModalOpen} toggle={this.toggleCodeModal} size="lg">
          <ModalHeader toggle={this.toggleCodeModal}>
            제출 코드
          </ModalHeader>

          <ModalBody>
            <CodeMirror
              defaultValue={codeModalValue}
              options={{lineNumbers: true, mode: codeModalLanguage, theme: 'monokai'}}
            />
          </ModalBody>
        </Modal>

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

                        let resultColor;

                        switch (submission.result) {
                          case 0:
                            resultColor = ''; break;
                          case 4:
                            resultColor = 'text-success'; break;
                          case 11:
                            resultColor = ''; break;
                          default:
                            resultColor = 'text-danger';
                        }

                        return (
                          <tr key={submission.id}>
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
