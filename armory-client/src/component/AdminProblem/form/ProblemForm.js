import React, {Component} from 'react';
import './ProblemForm.css';

import ProblemPreview from '../preview/ProblemPreview';

export class ProblemForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      previewOpen: false,
      problem: {}
    };
  }

  componentDidMount() {
    // this.handlePreview();
  }

  handleClosePreview = () => {
    this.setState({
      previewOpen: false,
      problem: {}
    });
  }

  refsToProblem = () => {
    const {
      problemTitle: {value: title},
      problemCode: {value: code},
      problemDesc: {value: desc},
      problemMemoryLimit: {value: memoryLimit},
      problemTimeLimit: {value: timeLimit},
      problemScore: {value: score}
    } = this.refs;

    return {title, code, description: desc, memoryLimit, timeLimit, score};
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const problem = this.props.problem || {};

    this.props.onSave(problem.id, this.refsToProblem());
  }

  handlePreview = () => {
    this.setState({
      previewOpen: true,
      problem: this.refsToProblem()
    });
  }

  render () {
    const problem = this.props.problem || {
      ProblemInfo: {
        memory_limit: 128,
        time_limit: 1
      }
    };

    return (
      <div className="card">
        <div className="card-block">
          <h4> 문제 추가 </h4>

          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label> 아이디 </label>
              <input className="form-control" defaultValue={problem.id} disabled />
            </div>

            <div className="form-group">
              <label> 제목 </label>
              <input
                className="form-control"
                type="text"
                ref="problemTitle"
                placeholder="제목을 입력해주세요."
                defaultValue={problem.title} />
            </div>

            <div className="form-group">
              <label> 코드 </label>
              <input
                className="form-control"
                type="text"
                ref="problemCode"
                placeholder="코드를 입력해주세요"
                defaultValue={problem.code} />
                <p className="form-text text-muted">
                  유저한테 보여지는 문제 번호입니다.
                </p>
            </div>

            <div className="form-group">
              <label> 점수 </label>
              <input
              className="form-control"
              type="text"
              ref="problemScore"
              placeholder="점수를 입력해주세요"
              defaultValue={problem.score} />
            </div>

            <div className="form-group">
              <label> 시간 제한 </label>

              <div className="input-group">
                <input
                  className="form-control"
                  type="number"
                  ref="problemTimeLimit"
                  placeholder="시간 제한을 입력해주세요"
                  defaultValue={problem.ProblemInfo.time_limit} />
                <span className="input-group-addon">초</span>
              </div>
            </div>

            <div className="form-group">
              <label> 메모리 제한 </label>

              <div className="input-group">
                <input
                  className="form-control"
                  type="number"
                  ref="problemMemoryLimit"
                  placeholder="메모리 제한을 입력해주세요"
                  defaultValue={problem.ProblemInfo.memory_limit} />
                <span className="input-group-addon">MB</span>
              </div>
            </div>

            <div className="form-group">
              <label> 문제 설명 </label>
              <textarea className="form-control" defaultValue={problem.description} rows={10} ref="problemDesc" />
              <p className="form-text text-muted">
                마크다운 에디터로 작성한 후 내용을 복붙해주세요.
              </p>
            </div>

            <div>
              <button type="submit" className="btn btn-success">
                저장
              </button>

              <button type="button" className="btn btn-info" onClick={this.handlePreview}>
                미리보기
              </button>

              <button type="submit" className="btn btn-danger" onClick={this.props.onClose}>
                취소
              </button>
            </div>
          </form>

          {this.state.previewOpen && (
            <ProblemPreview problem={this.state.problem} onClose={this.handleClosePreview} />
          )}
        </div>
      </div>
    )
  }
}

export default ProblemForm;
