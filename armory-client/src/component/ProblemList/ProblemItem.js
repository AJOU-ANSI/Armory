import React from 'react';
import classnames from 'classnames';
import {Link} from 'react-router-dom';

import './ProblemItem.css';

export const ProblemItem = ({problem, className, match, status}) => {
  let btnClass, btnLabel, btnBg;

  if (!status) {
    btnClass = 'btn-white text-logo'; btnLabel = '문제 풀기';
  }
  else {
    const {accepted, wrong} = status;

    if (accepted) {
      btnClass = 'btn-info'; btnLabel = '정답'; btnBg = '#E3F2FD';
    }
    else if (wrong) {
      btnClass = 'btn-danger'; btnLabel = '재시도'; btnBg = '#FFEBEE';
    }
    else {
      btnClass = 'btn-white text-logo'; btnLabel = '문제 풀기';
    }
  }

  return (
    <div className={classnames('ProblemItem', className)}>
      <div className="card problem-card paper">
        <div className="card-block" style={{backgroundColor: btnBg}}>
          <h5 className="d-flex mb-0">
            <strong>문제 {problem.code}</strong>
            <span className="ml-2 font-weight-light">{problem.title}</span>
            <span className="badge badge-pill badge-default badge-shake">{problem.score}점 </span>
          </h5>

          <span className="d-flex">
            {
              <Link to={`${match.url}/${problem.code}`} className={classnames('btn btn-custom', btnClass)}>
                {btnLabel}
              </Link>
            }

          </span>
        </div>
      </div>
    </div>
  );
};

export default ProblemItem;
