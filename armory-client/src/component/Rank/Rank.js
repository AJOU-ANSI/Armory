import React, {Component} from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';
import Balloon from './Balloon';

import finalRank from './2017final.json';

export class Rank extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rankData: []
    }
  }

  componentWillMount() {

    this.updateRank();

    this.timer = setInterval(() => {
      this.updateRank();
    }, 5000);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);

      delete this.timer;
    }
  }

  updateRank = () => {
    const {match: {params: {contestName}}} = this.props;

    if (contestName === '2017final') {
      this.setState({
        rankData: finalRank
      });

      return;
    }

    fetch(`/api/${contestName}/ranking`)
    .then(resp => {
      if (!resp.ok) {
        throw new Error();
      }
      return resp.json();
    })
    .then(({result: {rankData}}) => {
      this.setState({rankData});
    })
    .catch((err) => {
      console.error(err);
      this.setState({rankData: []});
    });
  };

  render() {
    const {match: {params: {contestName}}} = this.props;
    const {user, contestMap: {[contestName]: contest}} = this.props;
    let {rankData} = this.state;
    if (rankData === null || rankData === undefined) {
      return (
        <div> 랭크 정보가 없습니다... </div>
      );
    }

    let isFreezing = false;

    if (contest && contest.freezeAt !== 0 && contest.freezeAt < (new Date()).getTime()) {
      isFreezing = true;
    }

    rankData = rankData.sort((a, b) => {
      if (a.rank === b.rank) {
        if (a.strId < b.strId) return -1;
        else if (a.strId > b.strId) return 1;
        return 0;
      }

      return a.rank - b.rank;
    });

    return (
    <div className="page Rank">
      <div className="container">
        <div className="page-title">
          <h1> 순위 {isFreezing && (<small className="text-info">프리징</small>)}</h1>
          <p> 현재 진행중인 대회의 순위입니다.
            {isFreezing && (<span className={'text-info'}> 프리징되어 순위가 변경되지 않습니다.</span>)}
          </p>
        </div>

        <div className={classnames('card paper', isFreezing && 'bg-freeze')}>
          <table className="table-custom" style={{width: '100%'}}>
            <thead>
            <tr>
              <th style={{width: 80}}> 순위</th>
              <th style={{width: 100}}> 아이디</th>
              <th style={{width: 120}}> 점수</th>
              <th> 맞은 문제들</th>
              <th> 패널티</th>
            </tr>
            </thead>

            <tbody>
            {
              rankData && rankData.map(rankDetail => {
                const isUser = user && rankDetail.strId === user.strId;

                const strList = rankDetail.strId.split(' ');

                const group = strList.slice(0, strList.length - 1).join(' ');
                const name = strList[strList.length - 1];

                return (
                <tr key={rankDetail.strId} className={classnames(isUser && 'table-success')}>
                  <td style={{borderBottom: '1px solid #eee'}}> {rankDetail.rank} </td>
                  <td style={{borderBottom: '1px solid #eee'}}> {group} <strong>{name}</strong></td>
                  <td style={{borderBottom: '1px solid #eee'}}> {rankDetail.totalScore}점 </td>
                  <td style={{borderBottom: '1px solid #eee'}} className="py-3">
                    {
                      rankDetail.problemStatus
                        .sort((a, b) => a.problemCode.charCodeAt(0) - b.problemCode.charCodeAt(0))
                        .reduce((prevStatuses, cur) => {
                          if (!cur.accepted) {
                            return prevStatuses;
                          }

                          const targetIdx = prevStatuses.findIndex(
                            status => status.problemCode[0] === cur.problemCode[0]
                          );

                          if (targetIdx === -1) {
                            return prevStatuses.concat({...cur});
                          }

                          if (prevStatuses[targetIdx].problemCode !== cur.problemCode) {
                            prevStatuses[targetIdx].problemCode = cur.problemCode[0];
                            prevStatuses[targetIdx].score += cur.score;

                            return prevStatuses;
                          }
                        }, [])
                        .map(p => (
                          p.accepted && (
                            <Balloon className="ml-3" key={p.problemId}
                                     code={p.problemCode}
                                     score={p.score}
                                     strId={rankDetail.strId} />
                          )
                        ))
                    }
                  </td>
                  <td
                  style={{borderBottom: '1px solid #eee'}}> {Math.floor(rankDetail.penalty / 1000 / 1000 / 1000 / 60)} </td>
                </tr>
                );
              })
            }
            </tbody>
          </table>
        </div>
      </div>
    </div>
    )
  }
}

export default connect(({user, contestMap}) => ({user, contestMap}))(Rank);
