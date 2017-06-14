import React, {Component} from 'react';

import './ProblemList.css';

import ProblemItem from './ProblemItem';
// import problems from '../../data/problems.json';
import {connect} from 'react-redux';
import {fetchGetProblemList} from '../../actions/problem';

export class ProblemList extends Component {
  componentWillMount() {
    const {match: {params: {contestName}}} = this.props;

    this.props.fetchGetProblemList(contestName);
  }

  render() {
    /*
    <% for(var i = 0 ; i < problems.length; i++ ) {  %>
      <%var problem = problems[i]; var code = String.fromCharCode(problem.num+'A'.charCodeAt(0)); %>
      <div className="panel scalable panel-default paper shadow-1">
          <div className="panel-heading" role="tab" id="headingB">
          <div className="pull-right">
          <% if(problem.result == 'none' ) {  %>
        <a href="/problem/<%=code%>" title="" className="btn btn-punch btn-xs btn-black btn-darker pull-right">문제 풀기</a>
          <% } else if(problem.result == 'success' ) {  %>
        <a href="/problem/<%=code%>" title="" className="btn btn-punch btn-xs btn-success btn-darker pull-right">맞았습니다</a>
            <% } else if(problem.result == 'fail') {  %>
        <a href="/problem/<%=code%>" title="" className="btn btn-punch btn-xs btn-primary btn-darker pull-right">재시도</a>
            <% } else if(problem.result == 'admin' ) { %>
        <a href="/problem/update/<%=problem.problem_id%>" title="" className="btn btn-punch btn-xs btn-black btn-darker pull-right">문제 수정</a>
          <% } %>
      </div>
        <h4 className="panel-title">
          <% if(problem.result == 'admin' ) { %>
        <strong><%=problem.problem_id%></strong> <%=problem.title%>
            <% } else { %>
        <strong>문제 <%=code%></strong> <%=problem.title%>
            <% } %>
      </h4>
        </div>
        </div>
        <% } %>
     */
    const {match, problemList} = this.props;

    return (
      <div className="page">
        <div className="page-title">
          <div className="container">
            <div className="row">
              <div className="col-md-10 offset-md-1">
                <h1>Problems</h1>
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
                  <ProblemItem match={match} problem={problem} key={index} className="col-10 offset-1 mb-2" />
                ))
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const stateToProps = ({problemList}) => ({problemList});
const actionToProps = {
  fetchGetProblemList
};

export default connect(stateToProps, actionToProps)(ProblemList);
