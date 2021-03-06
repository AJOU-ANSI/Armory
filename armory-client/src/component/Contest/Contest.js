import React, {Component} from 'react';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import ReduxToastr from "react-redux-toastr";
import Helmet from 'react-helmet';

import {fetchGetContestByName} from '../../actions/contest';
import {fetchLoggedIn, fetchLogin, fetchLogout} from '../../actions/auth';
import {fetchConnectWebSocket} from '../../actions/socket';

import ProblemList from '../ProblemList/ProblemList';
import ProblemDetail from '../ProblemDetail/ProblemDetail';
import Noti from '../Noti/Noti';
import Status from '../Status/Status';

import AdminHome from '../AdminHome/AdminHome';

import Footer from '../../include/Footer/Footer';
import Header from '../../include/Header/Header';

import NotFound from '../NotFound/NotFound';
import Login from '../../include/Login/Login';

import QnA from '../QnA/QnA';
import Rank from '../Rank/Rank';

import './Contest.css';

export class Contest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginModal: false
    };
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
  };

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
    const {match: {path, params: {contestName}}, contestMap: {[contestName]: contest}} = this.props;
    const {loginModal} = this.state;

    if (!contest) {
      return (<div> 로딩 중... </div>);
    }

    else if(contest.empty) {
      return (<div> No such contest </div>);
    }

    return (
      <div className="Contest">
        <Helmet>
          <title> shake! 2018 결승 </title>
        </Helmet>

        <ReduxToastr
          timeOut={4000}
          newestOnTop={false}
          preventDuplicates
          position="bottom-right"
          transitionIn="fadeIn"
          transitionOut="fadeOut"
          progressBar/>

        <Header
          contest={contest}
          match={this.props.match}
          onClickLogin={this.handleClickLogin}
          onLogout={this.handleLogout}
        />

        <Login modalOpen={loginModal} onToggle={this.toggleLoginModal} onLogin={this.handleLogin} />

        <div>
          <Switch>
            {/*<Route exact path={`${path}`} render={() => <Home contest={contest} />} />*/}
            <Redirect exact from={`${path}`} to={`/${contestName}/noti`}/>
            <Route exact path={`${path}/problems`} component={ProblemList} />
            <Route path={`${path}/problems/:problemCode`} component={ProblemDetail} />

            <Route path={`${path}/noti`} component={Noti} />
            <Route path={`${path}/qna`} component={QnA} />
            <Route path={`${path}/status`} render={() => <Status contest={contest} />} />

            <Route path={`${path}/admin`} component={AdminHome} />
            <Route path={`${path}/rank`} component={Rank} />

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
