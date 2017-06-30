import React, {Component} from 'react';
import StatusTable from '../Status/StatusTable';

export class AdminSubmission extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userList: null,
      submissionsList: null,
      search: '',
    }
  }

  componentWillMount() {
    this.updateSubmissionList();
  }

  handleChangeSearch = ({target: {value}}) => {
    this.setState({search: value});
  }

  updateSubmissionList = () => {
    const {match: {params: {contestName}}} = this.props;

    fetch(`/api/${contestName}/submissions/admin`, {
      credentials: 'include'
    })
      .then(resp => {
        if (!resp.ok) {
          throw new Error();
        }

        return resp.json();
      })
      .then(({result: {submission_list: submissionList}}) => {
        this.setState({submissionList});
      });
  }

  render () {
    const {match: {params: {contestName}}} = this.props;
    let {submissionList, search} = this.state;

    if (!submissionList) return null;

    submissionList = submissionList.filter(s => {
      if (search === '') return true;

      return s.id + '' === search;
    });

    return (
      <div className="page">
        <h5> 제출 확인 </h5>

        <div className="form-group">
          <label> 제출 번호 </label>
          <input type="number" onChange={this.handleChangeSearch} value={this.state.search} />
        </div>

        <StatusTable
          className="paper"
          submissionList={submissionList}
          contest={{name: contestName}}
          admin={true}
        />
      </div>
    );
  }
}

export default AdminSubmission;
