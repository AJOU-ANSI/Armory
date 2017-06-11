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

export class Contest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginModal: false
    };
  }

  componentWillMount() {
    const {match: {params: {contestName}}, fetchGetContestByName, contestMap: {[contestName]: contest}} = this.props;

    if (!contest) {
      fetchGetContestByName(contestName);
    }
  }

  handleClickLogin = () => {
    this.setState({
      loginModal: true
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
      <BrowserRouter>
        <div className="Contest">
          <Header match={this.props.match} onClickLogin={this.handleClickLogin} />

          <Login modalOpen={loginModal} onToggle={this.toggleLoginModal} />

          <div>
            <Switch>
              <Route exact path={`${path}`} render={() => <Home contest={contest} />} />
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

const stateToProps = ({contestMap}) => ({contestMap});
const actionToProps = {
  fetchGetContestByName
};

export default connect(stateToProps, actionToProps)(Contest);
