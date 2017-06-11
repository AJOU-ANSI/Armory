import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Home from '../Home/Home';
import ProblemList from '../ProblemList/ProblemList';
import ProblemDetail from '../ProblemDetail/ProblemDetail';

import Footer from '../../include/Footer/Footer';
import Header from '../../include/Header/Header';

import './Contest.css';
import NotFound from '../NotFound/NotFound';
import {connect} from 'react-redux';
import {fetchGetContestByName} from '../../actions/contest';
import Login from '../../include/Login/Login';
import {fetchLoggedIn, fetchLogin} from "../../actions/auth";

export class Contest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginModal: false
    };
  }

  componentWillMount() {
    const {
      match: {params: {contestName}},
      fetchGetContestByName,
      fetchLoggedIn,
      contestMap: {[contestName]: contest}
    } = this.props;

    fetchLoggedIn(contestName);

    if (!contest) {
      fetchGetContestByName(contestName);
    }
  }

  handleClickLogin = () => {
    this.setState({
      loginModal: true
    });
  }

  handleLogin = (userId, userPwd) => {
    const {match: {params: {contestName}}, fetchLogin} = this.props;

    fetchLogin(contestName, {userId, userPwd})
      .then(action => {
        if (!action.error) {
          this.toggleLoginModal();
        }
      });
  }

  toggleLoginModal = () => {
    this.setState({
      loginModal: !this.state.loginModal
    });
  }

  render() {
    const {match: {url, params: {contestName}}, contestMap: {[contestName]: contest}} = this.props;
    const {loginModal} = this.state;

    if (!contest) {
      return (<div> 로딩 중... </div>);
    }

    else if(contest.empty) {
      return (<div> No such contest </div>);
    }

    return (
      <div className="Contest">
        <Header match={this.props.match} onClickLogin={this.handleClickLogin} />

        <Login modalOpen={loginModal} onToggle={this.toggleLoginModal} onLogin={this.handleLogin} />

        <div>
          <Switch>
            <Route exact path={`${url}`} render={() => <Home contest={contest} />} />
            <Route exact path={`${url}/problems`} component={ProblemList} />
            <Route path={`${url}/problems/:problemCode`} component={ProblemDetail} />

            <Route component={NotFound} />
          </Switch>
        </div>

        <Footer />
      </div>
    )
  }
}

const stateToProps = ({contestMap}) => ({contestMap});
const actionToProps = {
  fetchGetContestByName,
  fetchLogin,
  fetchLoggedIn
};

export default connect(stateToProps, actionToProps)(Contest);
