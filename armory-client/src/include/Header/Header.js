import React, {Component} from 'react';

import blackLogo from '../../image/black-logo.png';
import {NavLink, Link} from 'react-router-dom';

import './Header.css';

export class Header extends Component {
  render() {
    /*

    <% if( typeof user_id == 'undefined' ) { %>
    <li><a data-toggle="modal" data-target="#modalLogin">계정 인증</a></li>
    <% } else { %>
    <li className="dropdown"><a href=""><%=user_id%>님</a>
    <ul className="dropdown-menu">
    <li><a href="/logout">로그아웃</a>
    </li>
    </ul>
    </li>
    <% } %>
    */

    const {match: {url}} = this.props;

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
                </ul>
              </div>
            </div>
          </div>

        </div>

      </header>
    );
  }
}

export default Header;
