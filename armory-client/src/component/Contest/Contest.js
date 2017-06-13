import React, {Component} from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import Home from '../Home/Home';
import ProblemList from '../ProblemList/ProblemList';
import ProblemDetail from '../ProblemDetail/ProblemDetail';

import Footer from '../../include/Footer/Footer';
import Header from '../../include/Header/Header';

import NotFound from '../NotFound/NotFound';
import Login from '../../include/Login/Login';

import './Contest.css';

import {fetchGetContestByName} from '../../actions/contest';
import {fetchLoggedIn, fetchLogin, fetchLogout} from '../../actions/auth';
import {fetchConnectWebSocket} from '../../actions/socket';

export class Contest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginModal: false
    };

    this.Socket = null;
  }

  componentWillReceiveProps(nextProps) {
    const {fetchConnectWebSocket} = nextProps;

    if (this.props.user !== nextProps.user && nextProps.user.isAuth) {
      fetchConnectWebSocket();
    }
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
      .then((action) => {
        if(!action.error) {
          this.toggleLoginModal();
        }
      });
  }

  handleLogout = () => {
    const {fetchLogout, history, match: {params: {contestName}}} = this.props;

    this.Socket.emit('logout');

    fetchLogout(contestName)
      .then(() => {
        history.push(`/${contestName}`);
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
        <Header
          match={this.props.match}
          onClickLogin={this.handleClickLogin}
          onLogout={this.handleLogout}
        />

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

const stateToProps = ({contestMap, user}) => ({contestMap, user});
const actionToProps = {
  fetchGetContestByName,
  fetchLogin,
  fetchLoggedIn,
  fetchLogout,
  fetchConnectWebSocket
};

export default withRouter(connect(stateToProps, actionToProps)(Contest));
