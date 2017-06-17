import React, {Component} from 'react';
import classnames from 'classnames';
import ProblemView from '../../ProblemDetail/ProblemView';
import ProblemInfoView from '../../ProblemDetail/ProblemInfoView';

export class ProblemPreview extends Component {
  render () {
    const {problem, className} = this.props; // title, code, description

    return (
      <div className={classnames(className, 'p-4')} style={{backgroundColor: '#eeedee', color: '#212121'}}>
        <div className="flex-justify-content-end">
          <button type="button" className="close" aria-label="Close" onClick={() => this.props.onClose()}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div>
          <h1> Problem <strong> {problem.code} </strong> </h1>
        </div>
        <div className="row">
          <div className="col-md-9">
            <ProblemView problem={problem} className="paper" />
          </div>

          <div className="col-md-3">
            <h5 className="font-weight-light"> 문제 정보 </h5>

            <ProblemInfoView problem={problem} className="paper" />
          </div>
        </div>
      </div>
    )

  }
}

export default ProblemPreview;
