import React, {Component} from 'react';
import classnames from 'classnames';

import './ProblemDetail.css';

import problemA from '../../data/problem_detail_a.json';
import problemB from '../../data/problem_detail_b.json';
import problemC from '../../data/problem_detail_c.json';
import {fetchGetProblemByCode} from '../../actions/problem';
import {connect} from 'react-redux';
import ProblemView from './ProblemView';
import ProblemInfoView from './ProblemInfoView';

export class ProblemDetail extends Component {
  componentWillMount() {
    const {match: {params: {contestName, problemCode}}, fetchGetProblemByCode} = this.props;

    fetchGetProblemByCode(contestName, problemCode);
  }

  render() {
    const {match: {params: {problemCode}}, problemMap} = this.props;

    const problem = problemMap[problemCode];

    if (!problem) return null;

    const problemInfo = {
      memoryLimit: problem.ProblemInfo.memory_limit,
      timeLimit: problem.ProblemInfo.time_limit
    };

    return (
      <div className="ProblemDetail page page-grey">
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
                  <button className="btn btn-custom btn-success w-100 py-3">
                    제출하기
                  </button>

                  <button className="btn btn-custom btn-info w-100 mt-2 py-3">
                    질문하기
                  </button>
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
  fetchGetProblemByCode
};

export default connect(stateToProps, actionToProps)(ProblemDetail);
