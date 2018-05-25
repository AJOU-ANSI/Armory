import React, {Component} from 'react';
import classnames from 'classnames';
import ReactMarkdown from 'react-markdown';

import './ProblemView.css';

export class ProblemView extends Component {
  render () {
    const {problem, className} = this.props; // title, code, description

    return (
      <div className={classnames(className, 'ProblemView')}>
        <div className="card">
          <div className="card-header font-weight-bold">
            <h3> {problem.title} </h3>
          </div>

          <div className="card-block">
            <ReactMarkdown source={problem.description} className={'content'} escapeHtml={false} />
          </div>
        </div>
      </div>
    )

  }
}

export default ProblemView;
