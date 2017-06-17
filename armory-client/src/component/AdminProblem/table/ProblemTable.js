import React, {Component} from 'react';

import './ProblemTable.css';
import {ProblemTableRow} from './ProblemTableRow';

export class ProblemTable extends Component {
  handleSelectTarget = (problem) => {
    this.props.onSelectTarget(problem);
  }

  render () {
    const {problemList, target, contestName} = this.props;

    return (
      <div>
        <h3> 문제 목록 </h3>

        <table className="table">
          <thead>
            <tr>
              <th> 선택 </th>
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
              <ProblemTableRow
                dataFormVersion={this.props.dataFormVersion}
                onSelectTarget={this.handleSelectTarget}
                key={problem.id}
                problem={problem}
                target={target}
                contestName={contestName} />
            ))
          }

          </tbody>
        </table>
      </div>
    )
  }
}

export default ProblemTable;
