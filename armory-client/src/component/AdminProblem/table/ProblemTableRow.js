import React, {Component} from 'react';

export class ProblemTableRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      problemData: null
    }
  }
  componentWillMount() {
    const {problem, contestName} = this.props;

    this.updateData(contestName, problem);
  }

  updateData = (contestName, problem) => {
    fetch(`/api/${contestName}/problems/${problem.code}/data`, {
      credentials: 'include'
    })
      .then(resp => {
        if (!resp.ok) {
          throw new Error();
        }

        return resp.json();
      })
      .then(({result: {problem_data}}) => {
        this.setState({
          problemData: problem_data
        })
      })
      .catch(e => {
        console.error(e);
      })
  }

  componentWillReceiveProps(nextProps) {
    const {contestName, problem} = this.props;
    
    if (this.props.dataFormVersion !== nextProps.dataFormVersion) {
      this.updateData(contestName, problem);
    }
  }
  render() {
    const {problem, target} = this.props;
    const {problemData = []} = this.state;

    return (
      <tr key={problem.id}>
        <th>
          <div className="form-check">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="checkbox"
                checked={target === problem}
                onChange={() => this.props.onSelectTarget(problem)} />
            </label>
          </div>
        </th>
        <th> {problem.code} </th>
        <th> {problem.title} </th>
        <th> {problem.ProblemInfo.memory_limit}MB </th>
        <th> {problem.ProblemInfo.time_limit}초 </th>
        <th> {problemData && problemData.length > 0 && <span className="text-success">&#10004;</span>} </th>
      </tr>
    )
  }
}
