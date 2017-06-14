import React, {Component} from 'react';
import classnames from 'classnames';

export class ProblemInfoView extends Component {
  render () {
    const {problem, className} = this.props;

    return (
      <div className={classnames('card b-0', className)}>
        <ul className="list-group">
          <li className="list-group-item d-block">
            시간 제한 <strong className="float-right"> {problem.timeLimit}초 </strong>
          </li>
          <li className="list-group-item d-block">
            메모리 제한 <strong className="float-right"> {problem.memoryLimit}MB </strong>
          </li>
        </ul>
      </div>
    )
  }
}

export default ProblemInfoView;
