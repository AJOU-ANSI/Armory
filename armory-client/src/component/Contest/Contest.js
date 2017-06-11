import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Home from '../Home/Home';
import ProblemList from '../ProblemList/ProblemList';
import ProblemDetail from '../ProblemDetail/ProblemDetail';

import Footer from '../../include/Footer/Footer';
import Header from '../../include/Header/Header';

import './Contest.css';
import NotFound from '../NotFound/NotFound';

export class Contest extends Component {
  render() {
    const {match: {path, params: {contestName}}} = this.props;

    console.log(contestName);

    return (
      <BrowserRouter>
        <div className="Contest">
          <Header match={this.props.match} />

          <div>
            <Switch>
              <Route exact path={`${path}`} component={Home} />
              <Route exact path={`${path}/problems`} component={ProblemList} />
              <Route exact path={`${path}/problems/:problemCode`} component={ProblemDetail} />

              <Route component={NotFound} />
            </Switch>
          </div>

          <Footer />
        </div>
      </BrowserRouter>
    )
  }
}

export default Contest;
