import React, {Component} from 'react';
import moment from 'moment';

import blackLogo from '../../image/black-logo.png';
import {NavLink, Link} from 'react-router-dom';

import './Header.css';
import {connect} from "react-redux";
import {Dropdown, DropdownItem, DropdownMenu} from "reactstrap";

export class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false,
      remainTime: null
    };
  }

  componentDidMount() {
    const {contest: {start, end}} = this.props;

    this.timer = setInterval(() => {
      const now = (new Date()).getTime();
      let remainTime;

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
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  handleClickLogin = (e) => {
    e.preventDefault();

    this.props.onClickLogin();
  }

  handleLogout = () => {
    this.props.onLogout();
  }

  handleToggleMenu = (e) => {
    if (e) e.preventDefault();

    this.setState({
      menuOpen: !this.state.menuOpen
    });
  }

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
    const {match: {url}, user, userContestInfo} = this.props;
    const {remainTime} = this.state;

    const timeFormat = 'HH시간 mm분 ss초';

    const menus = [
      {to: `${url}`, title: "메인"},
      {to: `${url}/noti`, title: "공지"},
      {to: `${url}/problems`, title: "문제"},
      {to: `${url}/status`, title: "제출내역"},
      {to: `${url}/qna`, title: "질문하기"},
      {to: `${url}/ranking`, title: "랭킹"},
    ];

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

              <div className="ml-4">
                <span className="text-logo time-basis">맞은</span> 문제:&nbsp;
                <span className="text-logo solved-value font-weight-bold">
                  {userContestInfo.acceptedCnt}개
                </span>
              </div>

              <div className="ml-4">
                <span className="text-logo time-basis">랭크</span>:&nbsp;
                <span className="text-logo solved-value font-weight-bold">
                  {userContestInfo.rank}위
                </span>
              </div>

            </div>
          </div>
        </div>
      </header>
    );
  }
}

const stateToProps = ({user, userContestInfo}) => ({user, userContestInfo});

export default connect(stateToProps)(Header);
