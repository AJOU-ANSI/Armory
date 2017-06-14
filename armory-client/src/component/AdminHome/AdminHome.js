import React, {Component} from 'react';
import {Link, Redirect, Route, Switch} from 'react-router-dom';
import AdminProblem from '../AdminProblem/AdminProblem';
import {connect} from 'react-redux';

export class AdminHome extends Component {
  render () {
    const {match: {url, path, params: {contestName}}, user} = this.props;

    if (!user) return null;

    if (!user.isAdmin) {
      return <Redirect to={`/${contestName}`} />;
    }

    return (
      <div className="AdminHome my-5">
        <div className="container">
          <div>
            <h2> Admin Page </h2> <Link to={`${path}`}> 홈으로 </Link>
          </div>

          <Switch>
            <Route exact path={`${path}`} render={() => (
              <div>
                <ul className="list-group">
                  <li className="list-group-item">
                    <Link to={`${url}/problems`}> 문제 편집 </Link>
                  </li>
                  <li className="list-group-item">
                    <Link to={`${url}/contest`}> 콘테스트 편집 </Link>
                  </li>
                </ul>
              </div>
            )} />

            <Route path={`${path}/problems`} component={AdminProblem} />
          </Switch>
        </div>
      </div>

    );
  }
}

const stateToProps = ({user}) => ({user});

export default connect(stateToProps)(AdminHome);
