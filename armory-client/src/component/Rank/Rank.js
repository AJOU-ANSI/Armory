import React, {Component} from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';

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

    fetch(`/api/${contestName}/ranking`)
      .then(resp => {
        if (!resp) {
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
  }

  render () {
    const {user} = this.props;
    let {rankData} = this.state;

    rankData = rankData.sort((a, b) => {
      return a.rank - b.rank;
    });

    return (
      <div className="page Rank">
        <div className="container">
          <div className="page-title">
            <h1> 순위 </h1>
            <p> 현재 진행중인 대회의 순위입니다. </p>
          </div>

          <div className="card paper">
            <div className="card-block">
              <table className="table-custom">
                <thead>
                  <tr>
                    <th> 순위 </th>
                    <th> 아이디 </th>
                    <th> 개수 </th>
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
                        <td />
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
