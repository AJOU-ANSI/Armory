import React, {Component} from 'react';
import NotiTable from "../Noti/NotiTable";

export class AdminNoti extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notiList: null
    };
  }

  componentWillMount() {
    this.updateNotiList();
  }

  updateNotiList = () => {
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
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {match: {params: {contestName}}} = this.props;

    const content = this.refs.content.value;

    fetch(`/api/${contestName}/notifications`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({content}),
    })
      .then(resp => {
        if (!resp.ok) {
          throw new Error();
        }
        this.updateNotiList();
      })
      .catch(err => {
        console.error(err);
      })
  }

  render () {
    const {notiList} = this.state;

    return (
      <div className="page">
        <h5> 공지 추가 </h5>

        <div className="card paper">
          <div className="card-block">
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label> 공지 내용 </label>
                <textarea rows="4" className="form-control" ref="content" />
              </div>

              <div>
                <button type="submit" className="btn btn-success"> 추가 </button>
              </div>
            </form>
          </div>
        </div>

        <h5 className="mt-5"> 공지 목록 </h5>
        <div className="card paper">
          {notiList && <NotiTable notiList={notiList} />}
        </div>
      </div>
    );
  }
}

export default AdminNoti;
