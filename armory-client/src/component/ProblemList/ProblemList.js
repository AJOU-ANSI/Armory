import React, {Component} from 'react';

import './ProblemList.css';

import ProblemItem from './ProblemItem';
// import problems from '../../data/problems.json';
import {connect} from 'react-redux';
import {fetchGetProblemList, fetchGetProblemStatuses} from '../../actions/problem';

export class ProblemList extends Component {
  componentWillMount() {
    const {
      match: {params: {contestName}},
      fetchGetProblemList,
      fetchGetProblemStatuses,
    } = this.props;

    fetchGetProblemList(contestName);
    fetchGetProblemStatuses(contestName);
  }

  render() {
    const {match, problemList, problemStatuses} = this.props;

    const problemStatusMap = !problemStatuses ? {} : problemStatuses.reduce((ret, cur) => {
      ret[cur.problemId] = cur;

      return ret;
    }, {});

    return (
      <div className="page">
        <div className="page-title">
          <div className="container">
            <div className="row">
              <div className="col-md-10 offset-md-1">
                <h1>문제</h1>
                <p>문제 목록입니다.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="content problem-list">
          <div className="container">
            <div className="row">
              {
                problemList && problemList.map((problem, index) => (
                  <ProblemItem
                    match={match}
                    problem={problem}
                    status={problemStatusMap[problem.id]}
                    key={index}
                    className="col-10 offset-1 mb-2"
                  />
                ))
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const stateToProps = ({problemList, problemStatuses}) => ({problemList, problemStatuses});
const actionToProps = {
  fetchGetProblemList,
  fetchGetProblemStatuses,
};

export default connect(stateToProps, actionToProps)(ProblemList);
