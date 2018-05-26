import React, {Component} from 'react';
import moment from 'moment';
import {toastr} from 'react-redux-toastr';

import blackLogo from '../../image/black-logo.png';
import {NavLink, Link} from 'react-router-dom';

import './Header.css';
import {connect} from "react-redux";
import {Dropdown, DropdownItem, DropdownMenu} from "reactstrap";
import {fetchGetContestByName, fetchGetUserContestInfo} from '../../actions/contest';

function isEmpty (value) {
  return value === null || value === undefined;
}

export class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false,
      remainTime: null
    };
  }

  componentDidMount() {
    const {contest: {start, end, name: contestName}, fetchGetUserContestInfo, fetchGetContestByName} = this.props;

    this.timer = setInterval(() => {
      const now = (new Date()).getTime();
      let remainTime;

      if (0 <= (start - now) && (start - now) < 1000) {
        toastr.info('시스템 메세지', '대회가 시작되었습니다!');
      }

      if (0 <= (now - end) && (now - end) < 1000) {
        toastr.warning('시스템 메세지', '대회가 종료되었습니다. 고생 많으셨습니다. :)');
      }

      if (start < now && now < end) {
        remainTime = end - now;

      }
      else if (now < start) {
        remainTime = now - start;
      }
      else {
        remainTime = null;
      }

      this.setState({remainTime});
    }, 1000);

    if (this.props.user && this.props.user.isAuth) {
      fetchGetUserContestInfo(contestName, this.props.user);
    }

    this.infoTimer = setInterval(() => {
      if (this.props.user && this.props.user.isAuth && !this.props.user.isAdmin) {
        fetchGetUserContestInfo(contestName, this.props.user);
      }
      fetchGetContestByName(contestName);
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    clearInterval(this.infoTimer);
  }

  handleClickLogin = (e) => {
    e.preventDefault();

    this.props.onClickLogin();
  };

  handleLogout = () => {
    this.props.onLogout();
  };

  handleToggleMenu = (e) => {
    if (e) e.preventDefault();

    this.setState({
      menuOpen: !this.state.menuOpen
    });
  };

  renderLogin = (user) => {
    if (user === null) {
      return <li className="menu-item"> 로딩중 </li>;
    }
    else if (user.isAuth) {
      return (
        <li className="menu-item">
          <Dropdown isOpen={this.state.menuOpen} toggle={this.handleToggleMenu}>
            <a className="user-info" href="" onClick={this.handleToggleMenu}> {user.strId}님 </a>

            <DropdownMenu right>
              <DropdownItem onClick={this.handleLogout}> 로그아웃 </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </li>
      );
    }
    else {
      return (
        <li className="menu-item">
          <a href="" onClick={this.handleClickLogin}> 로그인 </a>
        </li>
      )
    }
  }

  render() {
    const {match: {url}, user, userContestInfo, contest, contestMap: {[contest.name]: newContest}} = this.props;
    const {remainTime} = this.state;

    let isFreezing;

    if (newContest && newContest.freezeAt !== 0 && newContest.freezeAt < (new Date()).getTime()) {
      isFreezing = true;
    }

    const timeFormat = 'HH시간 mm분 ss초';

    const menus = [
      // {to: `${url}`, title: "메인"},
      {to: `${url}/noti`, title: "공지"},
      {to: `${url}/rank`, title: "순위"},
    ];

    if (user && user.isAuth) {
      menus.push(
        {to: `${url}/problems`, title: "문제"},
        {to: `${url}/status`, title: "제출내역"},
        {to: `${url}/qna`, title: "질문하기"},
      );
    }
    if (user && user.isAdmin) {
      menus.push(
        {to: `${url}/admin`, title: "관리자"}
      );
    }

    return (
      <header className="Header fixed-top">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <div className="logo">
                <Link className="logo-link" to={`${url}`}>
                  <img src={blackLogo} className="logo-image" alt="shake logo" />
                </Link>
              </div>
            </div>

            <div className="col-md-9 text-right">
              <div className="menu">
                <ul className="menu-list">
                  {
                    menus.map((menu, idx) => (
                      <li className="menu-item" key={idx}>
                        <NavLink activeClassName="active" exact={menu.to === url} to={menu.to}>
                          {menu.title}
                        </NavLink>
                      </li>
                    ))
                  }

                  {this.renderLogin(user)}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="helper-wrapper">
          <div className="container">
            <div className="helper">
              <div>
              {remainTime && (
                <div>
                  <span className="text-logo time-basis">
                    {remainTime < 0 ? '대회까지 ' : '종료까지 '}
                  </span>
                  남은 시간:&nbsp;
                  <span className="text-logo time-value font-weight-bold">
                    {`${moment.duration(remainTime > 0 ? remainTime : -remainTime).format(timeFormat)}`}
                  </span>
                </div>
              )}
              </div>

              {!isEmpty(userContestInfo.acceptedCnt) && (
                <div className="ml-4">
                  <span className="text-logo time-basis">맞은</span> 문제:&nbsp;
                  <span className="text-logo solved-value font-weight-bold">
                      {userContestInfo.acceptedCnt}개
                    </span>
                </div>
              )}

              {!isEmpty(userContestInfo.rank) && (
                <div className="ml-4">
                  <span className="text-logo time-basis">랭크</span>:&nbsp;
                  <span className="text-logo solved-value font-weight-bold">
                    {userContestInfo.rank}위
                  </span>
                  {isFreezing && <span className="text-info"> (랭크 프리징) </span>}
                </div>
              )}

              {!isEmpty(userContestInfo.totalScore) && (
              <div className="ml-4">
                <span className="text-logo time-basis">점수</span>:&nbsp;
                <span className="text-logo solved-value font-weight-bold">
                  {userContestInfo.totalScore}점
                </span>
              </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }
}

const stateToProps = ({user, userContestInfo, contestMap}) => ({user, userContestInfo, contestMap});
const actionToProps = {
  fetchGetUserContestInfo,
  fetchGetContestByName,
};

export default connect(stateToProps, actionToProps)(Header);
