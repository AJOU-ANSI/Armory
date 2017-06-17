import React, {Component} from 'react';

export class ProblemDataForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      problemData: null
    };
  }

  componentWillMount() {
    this.updateDataList(this.props.contestName, this.props.problem);
  }

  componentWillReceiveProps(nextProps) {
    this.updateDataList(nextProps.contestName, nextProps.problem);
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const file = this.refs.data.files[0];

    if (!file) {
      alert('파일을 업로드해주세요!');
      return;
    }

    const {contestName, problem} = this.props;
    const data = new FormData();

    data.append('data', file);

    fetch(`/api/${contestName}/problems/${problem.code}/data`, {
      method: 'POST',
      credentials: 'include',
      body: data
    })
      .then(resp => {
        if (!resp.ok) {
          throw new Error();
        }

        this.updateDataList(contestName, problem);
      })
      .catch(e => {
        console.error(e);
      })
  }

  handleSave = () => {
    this.props.onSave();
  }
  
  updateDataList = (contestName, problem) => {
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

  render () {
    let {problemData} = this.state;

    return (
      <div>
        <h4> 데이터 </h4>

        <form onSubmit={this.handleSubmit}>
          <h5> 데이터 추가 </h5>

          <div className="form-group">
            <input type="file" className="form-control-file" ref="data" />
            <small className="form-text text-muted">
              데이터(data01.in, data01.out, data02.in, data02.out...)를 압축해서 .zip 형태로 올려주세요. spj는 문의 요망.
            </small>
          </div>

          <div>
            <button className="btn btn-success" type="submit"> 등록 </button>
            <button className="btn btn-info ml-1" type="button" onClick={this.handleSave}> 저장 </button>
          </div>
        </form>

        <div className="card mt-3">
          <div className="card-block">
            <h5> 데이터 목록 </h5>
            <table className="table">
              <thead>
                <tr>
                  <th> 파일이름 </th>
                </tr>
              </thead>
              <tbody>
              {
                problemData && (
                  problemData.map((datum, index) => (
                    <tr key={index}>
                      <td> {datum} </td>
                    </tr>
                  ))
                )

              }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default ProblemDataForm;
