import React, {Component} from 'react';
import classnames from 'classnames';
import Remarkable from 'remarkable';
import remarkableKatex from 'remarkable-katex';

import './ProblemView.css';

const md = new Remarkable({
  html: true
});

md.use(remarkableKatex);

export class ProblemView extends Component {
  render () {
    const {problem, className} = this.props; // title, code, description

    const desc = md.render(problem.description);

    return (
      <div className={classnames(className, 'ProblemView')}>
        <div className="card">
          <div className="card-header font-weight-bold">
            <h3> {problem.title} </h3>
          </div>

          <div className="card-block">
            <div className="content" dangerouslySetInnerHTML={{__html: desc}} />
          </div>
        </div>
      </div>
    )

  }
}

export default ProblemView;
