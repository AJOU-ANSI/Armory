import React, {Component} from 'react';

import './ProblemTable.css';

export class ProblemTable extends Component {
  render () {
    const {problemList} = this.props;

    return (
      <div>
        <table className="table">
          <thead>
            <tr>
              <th> 번호 </th>
              <th> 제목 </th>
              <th> 메모리 제한 </th>
              <th> 시간 제한 </th>
              <th> 데이터 등록 </th>
              <th> 검증 </th>
            </tr>
          </thead>

          <tbody>
          {
            problemList && problemList.map(problem => (
              <tr key={problem.id}>
                <th> {problem.code} </th>
                <th> {problem.title} </th>
                <th> {problem.ProblemInfo.memory_limit}MB </th>
                <th> {problem.ProblemInfo.time_limit}초 </th>
              </tr>
            ))
          }

          </tbody>
        </table>
      </div>
    )
  }
}

export default ProblemTable;
