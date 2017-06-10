import React, {Component} from 'react';
import classnames from 'classnames';

import './ProblemList.css';
import {Link} from 'react-router-dom';

export class ProblemList extends Component {
  render() {

    const ProblemItem = ({problem, className}) => {
      const {result} = problem;

      let btnClass, btnLabel;

      switch(result) {
        case 'none':
          btnClass = 'btn-black'; btnLabel = '문제 풀기'; break;
        case 'success':
          btnClass = 'btn-info'; btnLabel = '정답'; break;
        case 'fail':
          btnClass = 'btn-danger'; btnLabel = '재시도'; break;
        default:
      }

      return (
        <div className={classnames(className)}>
          <div className="card problem-card">
            <div className="card-block">
              <h5 className="d-flex mb-0">
                <strong>문제 {problem.code}</strong>
                <span className="ml-2 font-weight-light">{problem.title}</span>
              </h5>

              <span className="d-flex">
                <Link to={`/problems/${problem.code}`} className={classnames('btn btn-custom', btnClass)}>
                  {btnLabel}
                </Link>
              </span>
            </div>
          </div>
        </div>
      );
    };

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
    return (
      <div className="my-5">
        <div className="problems-header mb-5">
          <div className="container">
            <div className="row">
              <div className="col-md-10 offset-md-1">
                <h1 className="problems-header-title">Problems</h1>
                <p className="problems-header-desc">문제 목록입니다.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="problem-list">
          <div className="container">
            <div className="row">
              <ProblemItem problem={{code: 'A', title: 'How to drink coffee', result: 'none'}} className="col-10 offset-1 mb-2" />
              <ProblemItem problem={{code: 'B', title: 'How to drink tea', result: 'success'}} className="col-10 offset-1 mb-2" />
              <ProblemItem problem={{code: 'C', title: 'How to drink drink', result: 'fail'}} className="col-10 offset-1 mb-2" />

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProblemList;
