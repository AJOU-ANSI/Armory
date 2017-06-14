import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchGetProblemList, fetchSaveProblem} from '../../actions/problem';
import ProblemTable from './ProblemTable';
import ProblemForm from './ProblemForm';

export class AdminProblem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formOpen: false,
      target: null
    };
  }

  componentWillMount() {
    const {match: {params: {contestName}}, fetchGetProblemList} = this.props;

    fetchGetProblemList(contestName);
  }

  handleClickAdd = () => {
    this.setState({
      formOpen: true,
      target: null
    });
  }

  handleSave = (problemId, problemInfo) => {
    console.log(problemId, problemInfo);

    const {match: {params: {contestName}}, fetchSaveProblem, fetchGetProblemList} = this.props;

    let promise;

    if (!problemId) {
      promise = fetchSaveProblem(contestName, problemInfo);
    }

    promise
      .then(() => {
        this.setState({
          formOpen: false,
          target: null
        });
        fetchGetProblemList(contestName);
      })
  }

  render () {
    const {problemList} = this.props;

    return (
      <div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-success" onClick={this.handleClickAdd}> 추가 </button>
        </div>
        <h3> 문제 목록 </h3>

        <ProblemTable problemList={problemList} />

        {
          this.state.formOpen && (
            <ProblemForm problem={this.state.target} onSave={this.handleSave} />
          )
        }
      </div>
    );
  }
}

const stateToProps = ({problemList}) => ({problemList});
const actionToProps = {
  fetchGetProblemList,
  fetchSaveProblem
};

export default connect(stateToProps, actionToProps)(AdminProblem);
