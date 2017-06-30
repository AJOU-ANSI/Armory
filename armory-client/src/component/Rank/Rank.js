import React, {Component} from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';
import Balloon from './Balloon';

export class Rank extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rankData: [],
      isFreezing: false,
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
      .catch(() => {
        this.setState({rankData: []});
      });

    fetch(`/api/contests/byName/${contestName}`)
      .then(resp => {
        if (!resp.ok) {
          throw new Error();
        }
        return resp.json();
      })
      .then(({result: {contest}}) => {
        if (contest.freezeAt !== 0 && contest.freezeAt < (new Date()).getTime()) {
          this.setState({isFreezing:true});
        }

      })
      .catch(err => {
        console.error(err);
      })
  }

  render () {
    const {user} = this.props;
    let {rankData, isFreezing} = this.state;

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
            <p> 현재 진행중인 대회의 순위입니다. </p>
          </div>

          <div className={classnames('card paper', isFreezing && 'bg-info')}>
            <div className="card-block">
              <table className="table-custom" style={{width: '100%'}}>
                <thead>
                  <tr>
                    <th style={{width: 80}}> 순위 </th>
                    <th style={{width: 80}}> 아이디 </th>
                    <th style={{width: 80}}> 개수 </th>
                    <th> 맞은 문제들 </th>
                    <th> 패널티 </th>
                  </tr>
                </thead>

                <tbody>
                {
                  rankData && rankData.map(rankDetail => {
                    const isUser = rankDetail.strId === user.strId;

                    return (
                      <tr key={rankDetail.strId} className={classnames(isUser && 'table-success')}>
                        <td> {rankDetail.rank} </td>
                        <td> {rankDetail.strId} </td>
                        <td> {rankDetail.acceptedCnt} </td>
                        <td className="p-0 py-2">
                          {rankDetail.problemStatus
                            .sort((a, b) => a.problemCode.charCodeAt(0) - b.problemCode.charCodeAt(0))
                            .map(p => (
                              p.accepted && <Balloon key={p.problemId} code={p.problemCode} strId={rankDetail.strId} />
                            ))}
                        </td>
                        <td> {Math.floor(rankDetail.penalty/1000/1000/1000/60)} </td>
                      </tr>
                    );
                  })
                }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(({user}) => ({user}))(Rank);
