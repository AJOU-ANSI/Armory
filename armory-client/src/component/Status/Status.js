import React, {Component} from 'react';

import './Status.css';
import StatusTable from './StatusTable';

export class Status extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submissionList: null,
    };
  }

  componentWillMount() {
    const {contest} = this.props;

    fetch(`/api/${contest.name}/submissions`, {
      credentials: 'include'
    })
      .then(resp => {
        if (!resp.ok) {
          throw new Error('Problem occurred!!');
        }
        return resp.json();
      })
      .then(body => {
        const {result: {submission_list}} = body;

        this.setState({
          submissionList: submission_list
        });
      })
      .catch(e => {
        console.error(e);
      });
  }

  render() {
    const {submissionList} = this.state;
    const {contest} = this.props;

    // const createDate = function(offset) { // second
    //   const now = (new Date()).getTime();
    //
    //   const date = new Date(now - offset*1000);
    //
    //   return date;
    // }
    //
    //
    // const submissionList = require('./data.json');
    // submissionList.forEach((submission, index) => {
    //   submission.createdAt = createDate(20 - index*2);
    // });

    return (
      <div className="page Status">
        <div className="page-title">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h1> 제출 현황 </h1>
                <p> 문제 제출 현황을 보여주는 페이지입니다. </p>
              </div>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="container">
            <div className="row">
              <StatusTable
                className="paper"
                submissionList={submissionList}
                contest={contest}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Status;
