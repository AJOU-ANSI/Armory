import React, {Component} from 'react';
import NotiTable from './NotiTable';

import './Noti.css';

export class Noti extends Component {
  constructor (props) {
    super(props);

    this.state = {
      notiList: null
    };

  }

  componentWillMount() {
    const {match: {params: {contestName}}} = this.props;

    fetch(`/api/${contestName}/notifications`)
      .then(resp => {
        if (!resp.ok) {
          throw new Error();
        }

        return resp.json();
      })
      .then(({result: {notiList}}) => {
        this.setState({notiList});
      })
      .catch(err => {
        console.error(err);
      })
  }

  render() {
    const {notiList} = this.state;

    if (notiList === null) {
      return <div className="container"> 로딩중 </div>;
    }

    return (
      <div className="page QnA">
        <div className="page-title">
          <div className="container">
            <div className="row">
              <div className="col-md-10 offset-md-1">
                <h1> 공지 </h1>
                <p> 공지사항 페이지입니다. </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-10 offset-md-1">
              <h5> 공지사항 </h5>
              <div className="card paper">
                <NotiTable notiList={notiList} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Noti;
