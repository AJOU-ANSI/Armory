import React, {Component} from 'react';
import classnames from 'classnames';

import './ProblemDetail.css';

import problemA from '../../data/problem_detail_a.json';
import problemB from '../../data/problem_detail_b.json';
import problemC from '../../data/problem_detail_c.json';

export class ProblemDetail extends Component {
  render() {
    const {match: {params: {problemCode}}} = this.props;

    const problemMap = {
      'A': problemA,
      'B': problemB,
      'C': problemC
    };

    const problem = problemMap[problemCode];

    const ProblemSection = ({label, value, sample}) => (
      <div className="mb-5">
        <h5 className="mb-3"> <strong> {label} </strong> </h5>
        <p dangerouslySetInnerHTML={{__html: value}} className={classnames(sample && 'sample')} />
      </div>
    );

    const labels = ['문제 설명', '입력', '출력', '예제 입력', '예제 출력'];
    const keys = ['description', 'input', 'output', 'sample_input', 'sample_output'];
    const samples = [false, false, false, true, true];

    return (
      <div className="ProblemDetail page page-grey">
        <div className="page-title">
          <div className="container">
            <div className="row">
              <div className="col-10 offset-1">
                <h1> Problem <strong>{problemCode}</strong> </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="container">
            <div className="row">
              <div className="offset-md-1 col-md-8 flex-last flex-md-start">
                <div className="card problem-card paper">
                  <div className="card-header font-weight-bold">
                    <h3> {problem.title} </h3>
                  </div>

                  <div className="card-block">
                    {
                      labels.map((label, index) => (
                        <ProblemSection
                          key={index}
                          label={label}
                          value={problem[keys[index]]}
                          sample={samples[index]} />
                      ))
                    }
                  </div>
                </div>
              </div>

              <div className="col-md-3 mt-3 mt-md-0 flex-first flex-md-last">
                <div className="mb-3">
                  <h5 className="font-weight-light mb-3"> 문제 정보 </h5>

                  <div className="card problem-info-card paper">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-block">
                        시간 제한
                        <strong className="float-right"> {problem.time_limit} </strong>
                      </li>

                      <li className="list-group-item d-block">
                        메모리 제한
                        <strong className="float-right"> {problem.time_limit} </strong>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mb-3">
                  <h5 className="font-weight-light mb-3"> 다른 문제 </h5>

                  <div className="card problem-info-card paper">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-block">
                        문제 A
                      </li>

                      <li className="list-group-item d-block">
                        문제 B
                      </li>

                      <li className="list-group-item d-block">
                        문제 C
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <button className="btn btn-custom btn-success w-100 py-3">
                    제출하기
                  </button>

                  <button className="btn btn-custom btn-info w-100 mt-2 py-3">
                    질문하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProblemDetail;
