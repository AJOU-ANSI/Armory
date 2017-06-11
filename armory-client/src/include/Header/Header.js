import React, {Component} from 'react';

import blackLogo from '../../image/black-logo.png';
import {NavLink, Link} from 'react-router-dom';

import './Header.css';
import {connect} from "react-redux";
import {Dropdown, DropdownItem, DropdownMenu} from "reactstrap";
import {fetchLogout} from "../../actions/auth";
import {withRouter} from "react-router";

export class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false
    };
  }

  handleClickLogin = (e) => {
    e.preventDefault();

    this.props.onClickLogin();
  }

  handleLogout = () => {
    const {fetchLogout, history, match: {params: {contestName}}} = this.props;

    fetchLogout(contestName)
      .then(() => {
        history.push(`/${contestName}`);
      });
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
    const {match: {url}, user} = this.props;

    const menus = [
      {to: `${url}`, title: "메인"},
      {to: `${url}/ranking`, title: "랭킹"},
      {to: `${url}/problems`, title: "문제"},
      {to: `${url}/status`, title: "제출내역"},
      {to: `${url}/qna`, title: "질문하기"}
    ];

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

      </header>
    );
  }
}

const stateToProps = ({user}) => ({user});
const actionToProps = {
  fetchLogout
};

export default withRouter(connect(stateToProps, actionToProps)(Header));
