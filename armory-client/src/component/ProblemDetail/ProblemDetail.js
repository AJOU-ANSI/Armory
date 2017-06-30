import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import {Link} from 'react-router-dom';

import './ProblemDetail.css';

import {fetchGetProblemByCode} from '../../actions/problem';
import ProblemView from './ProblemView';
import ProblemInfoView from './ProblemInfoView';
import {ProblemSubmitModal} from './ProblemSubmitModal';

export class ProblemDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitOpen: false
    };
  }

  componentWillMount() {
    const {match: {params: {contestName, problemCode}}, fetchGetProblemByCode} = this.props;

    fetchGetProblemByCode(contestName, problemCode);
  }

  handleClickSubmit = () => {
    this.setState({
      submitOpen: true
    });
  }

  handleSave = (code, language) => {
    const {match: {params: {problemCode, contestName}}} = this.props;

    fetch(`/api/${contestName}/submissions/${problemCode}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({language, code}),
      credentials: 'include'
    })
      .then(resp => {
        if (!resp.ok) {
          throw new Error('Not ok.');
        }

        return resp.json();
      })
      .then(() => {
        toastr.success('시스템 메세지', '제출이 완료되었습니다.');
        this.toggleSubmit();
      });
  }

  toggleSubmit = () => {
    this.setState({
      submitOpen: !this.state.submitOpen
    });
  }

  render() {
    const {match: {params: {problemCode, contestName}}, problemMap} = this.props;

    const problem = problemMap[problemCode];

    if (!problem) return null;

    const problemInfo = {
      memoryLimit: problem.ProblemInfo.memory_limit,
      timeLimit: problem.ProblemInfo.time_limit
    };

    return (
      <div className="ProblemDetail page page-grey">
        <ProblemSubmitModal
          toggle={this.toggleSubmit}
          isOpen={this.state.submitOpen}
          onSave={this.handleSave}
        />

        <div className="page-title">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h1> Problem <strong>{problemCode}</strong> </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-md-9 flex-last flex-md-start">
                <ProblemView problem={problem} className="paper" />
              </div>

              <div className="col-md-3 mt-3 mt-md-0 flex-first flex-md-last">
                <div className="mb-3">
                  <h5 className="font-weight-light mb-3"> 문제 정보 </h5>

                  <ProblemInfoView problem={problemInfo} className="paper"/>
                </div>

                { /*
                <div className="mb-3">
                  <h5 className="font-weight-light mb-3"> 다른 문제 </h5>

                  <div className="card problem-info-card paper">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-block">
                        문제 A
                      </li>

                      <li className="list-group-item d-block">
                        문제 B
                      </li>

                      <li className="list-group-item d-block">
                        문제 C
                      </li>
                    </ul>
                  </div>
                </div>
                */ }

                <div className="mb-3">
                  <button className="btn btn-custom btn-success w-100 py-3" onClick={this.handleClickSubmit}>
                    제출하기
                  </button>

                  <Link
                    className="btn btn-custom btn-info w-100 mt-2 py-3"
                    to={{pathname: `/${contestName}/qna`, state: {problemCode}}}
                  >
                    질문하기
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const stateToProps = ({problemMap}) => ({problemMap});
const actionToProps = {
  fetchGetProblemByCode,
};

export default connect(stateToProps, actionToProps)(ProblemDetail);
