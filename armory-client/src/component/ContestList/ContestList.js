import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';

import './ContestList.css';

import {fetchGetContestList} from '../../actions/contest';
import ContestItem from './ContestItem';

export class ContestList extends Component {
  componentWillMount() {
    const {contestList, fetchGetContestList} = this.props;

    if (contestList === null) {
      fetchGetContestList();
    }
  }

  renderContestList = (contestList) => {
    if (contestList === null) {
      return <div> 로딩 중... </div>
    }

    return contestList.map(contest => (
      <ContestItem contest={contest} key={contest.id} />
    ));
  }

  render () {
    const {contestList} = this.props;

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
                {this.renderContestList(contestList)}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const stateToProps = ({contestList}) => ({contestList});
const actionToProps = {
  fetchGetContestList
};

export default connect(stateToProps, actionToProps)(ContestList);
