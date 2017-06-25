import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchGetProblemList, fetchSaveProblem} from '../../actions/problem';
import ProblemTable from './table/ProblemTable';
import ProblemForm from './form/ProblemForm';
import ProblemDataForm from './dataForm/ProblemDataForm';

export class AdminProblem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formOpen: false,
      dataFormOpen: false,
      target: null,
      dataFormVersion: 1
    };
  }

  componentWillMount() {
    const {match: {params: {contestName}}, fetchGetProblemList} = this.props;

    fetchGetProblemList(contestName)
      .then(({payload: problemList}) => {
      // this.handleSelectTarget(problemList[0]);
      // this.handleClickData();
      })
  }

  handleClickAdd = () => {
    this.setState({
      formOpen: true,
      dataFormOpen: false,
      target: null
    });
  }

  handleClickData = () => {
    this.setState({
      formOpen: false,
      dataFormOpen: true
    })
  }

  handleSelectTarget = (problem) => {
    if (this.state.target === problem) {
      this.setState({
        target: null,
        dataFormOpen: false
      });
    }
    else {
      this.setState({
        target: problem
      });
    }
  }

  handleSave = (problemId, problemInfo) => {
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

  handleSaveData = () => {
    this.setState({
      dataFormOpen: false,
      target: null,
      dataFormVersion: this.state.dataFormVersion + 1
    });
  }

  render () {
    const {problemList, match: {params: {contestName}}} = this.props;
    const {target} = this.state;

    return (
      <div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-success" onClick={this.handleClickAdd}>
            추가
          </button>
          <button className="btn btn-info ml-2" onClick={this.handleClickData} disabled={target === null}>
            데이터 관리
          </button>
        </div>

        <h4> 문제 목록 </h4>
        <div className="card paper b-0">
          <ProblemTable
            dataFormVersion={this.state.dataFormVersion}
            contestName={contestName}
            problemList={problemList}
            onSelectTarget={this.handleSelectTarget}
            target={target} />
        </div>

        {
          this.state.formOpen && (
            <ProblemForm problem={this.state.target} onSave={this.handleSave} />
          )
        }

        {
          this.state.dataFormOpen && (
            <div className="card paper b-0 mt-3">
              <div className="card-block">
                <ProblemDataForm
                  problem={this.state.target}
                  onSave={this.handleSaveData}
                  contestName={contestName} />
              </div>
            </div>
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
