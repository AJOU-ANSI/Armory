import React, {Component} from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';

export class Rank extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rankData: [
        {
          strId: 'test01',
          rank: 2,
          acceptedCnt: 2,
          penalty: 10000000,
          problemStatuses: [
            {wrongCount: 0, accepted: true},
            {wrongCount: 1, accepted: true},
            {wrongCount: 4, accepted: false}
          ]
        },
        {
          strId: 'test02',
          rank: 3,
          acceptedCnt: 2,
          penalty: 10010001,
          problemStatuses: [
            {wrongCount: 0, accepted: false},
            {wrongCount: 1, accepted: true},
            {wrongCount: 3, accepted: true}
          ]
        },
        {
          strId: 'test30',
          rank: 1,
          acceptedCnt: 3,
          penalty: 10010101,
          problemStatuses: [
            {wrongCount: 0, accepted: true},
            {wrongCount: 1, accepted: true},
            {wrongCount: 3, accepted: true}
          ]
        },
      ]
    }
  }

  componentWillMount() {
    setInterval(() => {
      const rankData = this.state.rankData.slice();

      const checked = [];

      for (let i = 0 ; i < rankData.length ;i++) {
        const rank = Math.floor(Math.random()*rankData.length);

        if (checked[rank]) { i--; continue; }

        checked[rank] = true;

        rankData[i].rank = (rank+1);
      }
      console.log(rankData);

      this.setState({rankData});
    }, 5000);
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
                        <td> {rankDetail.penalty} </td>
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
