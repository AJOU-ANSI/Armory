import React from 'react';
import classnames from 'classnames';
import {Link} from 'react-router-dom';

import './ProblemItem.css';

export const ProblemItem = ({problem, className}) => {
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
    <div className={classnames('ProblemItem', className)}>
      <div className="card problem-card paper">
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

export default ProblemItem;
