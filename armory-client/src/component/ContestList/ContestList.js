import React, {Component} from 'react';
import Helmet from 'react-helmet';

import './ContestList.css';
import {Link} from 'react-router-dom';

export class ContestList extends Component {
  render () {
    const contests = [
      {name: 'shake17', id: 1},
      {name: 'shake17test1', id: 2}
    ];

    const ContestItem = ({contest}) => (
      <div className="card paper mb-2">
        <div className="card-block d-flex justify-content-between align-items-center">
          <strong> {contest.name} </strong>

          <Link className="btn btn-custom btn-success" to={`/${contest.name}`}>
            입장하기
          </Link>
        </div>
      </div>
    );

    return (
      <div className="ContestList">
        <Helmet>
          <title> Shake! 콘테스트 목록 </title>
        </Helmet>

        <div className="page">
          <div className="container">
            <div className="col-lg-8 offset-lg-2">
              <div className="page-title">
                <h1> 콘테스트 목록 </h1>
              </div>

              <div className="mt-5">
                {
                  contests.map(contest => (
                    <ContestItem contest={contest} key={contest.id} />
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ContestList;
