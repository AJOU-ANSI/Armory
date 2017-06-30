import React, {Component} from 'react';
import StatusTable from '../Status/StatusTable';

export class AdminSubmission extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userList: null,
      submissionsList: null,
    }
  }

  componentWillMount() {
    this.updateSubmissionList();
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
    const {submissionList} = this.state;

    if (!submissionList) return null;

    return (
      <div className="page">
        <h5> 제출 확인 </h5>

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
