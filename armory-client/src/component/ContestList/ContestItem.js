import React from 'react';

import {Link} from 'react-router-dom';

export const ContestItem = ({contest}) => (
  <div className="card paper mb-2">
    <div className="card-block d-flex justify-content-between align-items-center">
      <strong> {contest.name} </strong>

      <Link className="btn btn-custom btn-success" to={`/${contest.name}`}>
        입장하기
      </Link>
    </div>
  </div>
);

export default ContestItem;
