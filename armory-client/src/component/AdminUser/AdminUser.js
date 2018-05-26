import React, {Component} from 'react';

export class AdminUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userList: null
    };
  }

  componentWillMount() {
    this.updateUserList();
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const file = this.refs.data.files[0];

    if (!file) {
      alert('파일을 업로드해주세요!');
      return;
    }

    const {match: {params: {contestName}}} = this.props;
    const data = new FormData();

    data.append('user_file', file);

    fetch(`/api/${contestName}/users`, {
      method: 'POST',
      credentials: 'include',
      body: data
    })
      .then(resp => {
        if (!resp.ok) {
          throw new Error();
        }

        this.updateUserList();
      })
      .catch(e => {
        console.error(e);
      })
  }

  updateUserList = () => {
    const {match: {params: {contestName}}} = this.props;

    fetch(`/api/${contestName}/users`, {
      credentials: 'include'
    })
      .then(resp => {
        if (!resp.ok) {
          throw new Error('Not ok');
        }

        return resp.json();
      })
      .then(({result: {user_list: userList}}) => {
        this.setState({userList});
      })
      .catch(err => {
        console.error(err);
      });
  }

  render () {
    const {userList} = this.state;

    return (
      <div className="page">
        <h5> 유저 추가 </h5>

        <div className="card paper">
          <div className="card-block">
            <form onSubmit={this.handleSubmit}>


              <div className="form-group">
                <input type="file" className="form-control-file" ref="data" />
                <small className="form-text text-muted">
                  유저 목록이 들어있는 csv를 업로드해주세요.
                </small>
              </div>

              <div>
                <button className="btn btn-info ml-1" type="submit"> 저장 </button>
              </div>
            </form>
          </div>
        </div>

        <h5 className="mt-3"> 유저 목록 <span className={'badge badge-default'}> {userList && userList.length} </span> </h5>

        <div className="card paper">
          <table className="table table-custom">
            <thead>
              <tr>
                <th> 아이디 </th>
                <th> 이름 </th>
                <th> 소속 </th>
              </tr>
            </thead>
            <tbody>
            {
              userList && (
                userList.sort((a, b) => a.strId > b.strId ? 1 : (a.strId === b.strId ? 0 : -1)).map(user => (
                  <tr key={user.id}>
                    <td> {user.strId} </td>
                    <td> {user.name} </td>
                    <td> {user.groupName} </td>
                  </tr>
                ))
              )
            }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default AdminUser;
